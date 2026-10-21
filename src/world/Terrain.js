import * as THREE from 'three';

/**
 * Terrain.js
 * Procedural voxel terrain generator using InstancedMesh.
 * Creates stepped hills, paths, beaches, mountains, and underground layers.
 * Provides fast O(1) instance lookup and dynamic block mining/restoring.
 */

export class Terrain {
  constructor(scene, textureGenerator) {
    this.scene = scene;
    this.textureGenerator = textureGenerator;

    this.blockSize = 1.0;
    this.width = 52; // -26 to +26
    this.depth = 52; // -26 to +26

    // Maps for fast instance <-> block lookup
    this.blocksByKey = new Map(); // "x,y,z" -> block info
    this.blocksByInstance = new Map(); // "meshName_instanceId" -> block info
    this.instancedMeshes = {}; // meshName -> THREE.InstancedMesh
    this.instanceCounts = {}; // meshName -> count

    this.unitGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.dummy = new THREE.Object3D();

    this.waterBlocks = [];
    this.generate();
  }

  // Seeded noise-like elevation function
  getHeight(x, z) {
    // Flatten spawn plaza area in center
    const distFromCenter = Math.sqrt(x * x + z * z);
    if (distFromCenter < 7) {
      return 1;
    }

    // Lake depression in north-east
    const lakeDx = x - 12;
    const lakeDz = z - (-10);
    const lakeDist = Math.sqrt(lakeDx * lakeDx + lakeDz * lakeDz);
    if (lakeDist < 6) {
      return -1;
    }

    // River channel leading to lake
    if (x > 3 && x < 20 && z > -16 && z < -6) {
      const riverFactor = Math.sin(x * 0.4) * 2;
      if (Math.abs(z - (-11 + riverFactor)) < 2.5) {
        return -1;
      }
    }

    // Rolling hills using multi-frequency sines
    let h = 1.0;
    h += Math.sin(x * 0.15) * Math.cos(z * 0.15) * 1.8;
    h += Math.sin(x * 0.3 + 1.2) * Math.cos(z * 0.28 + 0.8) * 1.1;

    // Mountainous perimeter (distances > 16)
    if (distFromCenter > 16) {
      const mountainBlend = (distFromCenter - 16) / 10;
      const mountainRidge = (Math.sin(x * 0.22) + Math.cos(z * 0.22)) * 3.5 + 4.0;
      h += mountainBlend * mountainRidge;
    }

    // Stepped discrete voxel heights
    return Math.max(-1, Math.min(12, Math.round(h)));
  }

  generate() {
    // 1. First pass: determine all block positions and types
    const blockList = [];
    const minX = -Math.floor(this.width / 2);
    const maxX = Math.floor(this.width / 2);
    const minZ = -Math.floor(this.depth / 2);
    const maxZ = Math.floor(this.depth / 2);

    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        const topY = this.getHeight(x, z);

        // Water surface in depression
        if (topY < 1) {
          // Water at y = 0
          this.waterBlocks.push({ x, y: 0, z });
        }

        // Column from topY down to bedrock/bottom (e.g. -3)
        const bottomY = Math.max(-3, topY - 4);
        for (let y = topY; y >= bottomY; y--) {
          let type = 'stone';

          if (y === topY) {
            // Top layer block
            if (topY <= 0) {
              type = 'sand'; // Beach / riverbed
            } else if (topY >= 7) {
              type = 'stone'; // Mountain rocky peak
            } else {
              // Path in spawn plaza
              const isCenterPath = (Math.abs(x) <= 1 && Math.abs(z) <= 7) || (Math.abs(z) <= 1 && Math.abs(x) <= 7);
              if (isCenterPath && topY === 1) {
                type = 'cobblestone';
              } else {
                type = 'grass';
              }
            }
          } else if (y >= topY - 2) {
            // Sub-surface dirt
            type = topY <= 0 ? 'sand' : 'dirt';
          } else {
            // Deep stone with random ore deposits
            const oreRng = Math.abs(Math.sin(x * 37.1 + y * 71.3 + z * 53.7));
            if (oreRng > 0.96) {
              type = 'diamond_ore';
            } else if (oreRng > 0.92) {
              type = 'gold_ore';
            } else if (oreRng > 0.85) {
              type = 'iron_ore';
            } else if (oreRng > 0.80) {
              type = 'redstone_ore';
            } else {
              type = 'stone';
            }
          }

          blockList.push({ x, y, z, type });
        }
      }
    }

    // 2. Count instances per block type
    const counts = {};
    blockList.forEach(b => {
      counts[b.type] = (counts[b.type] || 0) + 1;
    });

    // Also reserve room for decorative structures blocks added later
    counts['oak_planks'] = 400;
    counts['oak_log'] = 300;
    counts['birch_log'] = 150;
    counts['spruce_log'] = 150;
    counts['oak_leaves'] = 1200;
    counts['birch_leaves'] = 500;
    counts['spruce_leaves'] = 500;
    counts['bricks'] = 300;
    counts['glass'] = 150;
    counts['bookshelf'] = 80;
    counts['obsidian'] = 120;
    counts['glowstone'] = 60;
    counts['emerald_ore'] = 50;
    counts['lapis_ore'] = 50;

    // 3. Create InstancedMeshes
    const allTypes = Object.keys(counts);
    allTypes.forEach(type => {
      const maxCount = counts[type] + 50; // buffer
      const mat = this.textureGenerator.getMaterial(type);
      const mesh = new THREE.InstancedMesh(this.unitGeometry, mat, maxCount);
      mesh.name = `terrain_${type}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { blockType: type };

      this.scene.add(mesh);
      this.instancedMeshes[type] = mesh;
      this.instanceCounts[type] = 0;
    });

    // 4. Fill instances
    blockList.forEach(b => {
      this.addBlock(b.x, b.y, b.z, b.type, true);
    });

    // Update instance matrix buffers
    Object.values(this.instancedMeshes).forEach(mesh => {
      mesh.instanceMatrix.needsUpdate = true;
    });
  }

  // Add a block to the InstancedMesh collection
  addBlock(x, y, z, type, isMineable = true, isProtected = false) {
    const key = `${x},${y},${z}`;
    if (this.blocksByKey.has(key)) return null;

    const mesh = this.instancedMeshes[type];
    if (!mesh) return null;

    const instanceId = this.instanceCounts[type];
    if (instanceId >= mesh.count) return null;

    this.dummy.position.set(x, y, z);
    this.dummy.rotation.set(0, 0, 0);
    this.dummy.scale.set(1, 1, 1);
    this.dummy.updateMatrix();

    mesh.setMatrixAt(instanceId, this.dummy.matrix);

    const blockData = {
      x, y, z,
      type,
      instanceId,
      meshName: mesh.name,
      mesh: mesh,
      matrix: this.dummy.matrix.clone(),
      isMineable,
      isProtected,
      broken: false
    };

    this.blocksByKey.set(key, blockData);
    this.blocksByInstance.set(`${mesh.name}_${instanceId}`, blockData);
    this.instanceCounts[type]++;

    return blockData;
  }

  // Hide/break a block by scaling its matrix to 0
  breakBlock(blockData) {
    if (!blockData || blockData.broken) return;

    blockData.broken = true;
    this.dummy.matrix.set(
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
    );
    blockData.mesh.setMatrixAt(blockData.instanceId, this.dummy.matrix);
    blockData.mesh.instanceMatrix.needsUpdate = true;
  }

  // Restore/respawn a broken block
  restoreBlock(blockData) {
    if (!blockData || !blockData.broken) return;

    blockData.broken = false;
    blockData.mesh.setMatrixAt(blockData.instanceId, blockData.matrix);
    blockData.mesh.instanceMatrix.needsUpdate = true;
  }

  // Look up block info from Raycaster intersection
  getBlockFromIntersection(intersection) {
    if (!intersection || !intersection.object) return null;
    const meshName = intersection.object.name;
    const instanceId = intersection.instanceId;
    if (instanceId === undefined) return null;

    return this.blocksByInstance.get(`${meshName}_${instanceId}`) || null;
  }

  // Reset entire world to unbroken state
  resetAllBlocks() {
    this.blocksByKey.forEach(b => {
      if (b.broken) {
        this.restoreBlock(b);
      }
    });
  }

  dispose() {
    this.unitGeometry.dispose();
    Object.values(this.instancedMeshes).forEach(mesh => {
      this.scene.remove(mesh);
      mesh.dispose();
    });
    this.blocksByKey.clear();
    this.blocksByInstance.clear();
  }
}
