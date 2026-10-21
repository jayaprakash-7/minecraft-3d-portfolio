import * as THREE from 'three';

/**
 * Vegetation.js
 * Builds diverse procedural voxel trees (Oak, Birch, Spruce/Pine),
 * bushes, and floral details using InstancedMesh blocks from Terrain.
 */

export class Vegetation {
  constructor(terrain, scene) {
    this.terrain = terrain;
    this.scene = scene;
    this.trees = []; // tracks tree groups for subtle wind sway
    this.generateVegetation();
  }

  generateVegetation() {
    // Tree spawn locations chosen to surround the paths and populate hills
    const treeLocations = [
      // Near Spawn / Path borders
      { x: -5, z: -4, type: 'oak' },
      { x: 5, z: -4, type: 'oak' },
      { x: -6, z: 4, type: 'birch' },
      { x: 6, z: 4, type: 'birch' },
      { x: -3, z: 8, type: 'oak' },
      { x: 3, z: 8, type: 'oak' },

      // North-West Orchard
      { x: -12, z: -8, type: 'oak' },
      { x: -15, z: -11, type: 'birch' },
      { x: -10, z: -14, type: 'oak' },
      { x: -17, z: -6, type: 'birch' },

      // South-West Forest
      { x: -13, z: 12, type: 'spruce' },
      { x: -17, z: 15, type: 'spruce' },
      { x: -9, z: 16, type: 'spruce' },
      { x: -14, z: 19, type: 'oak' },

      // East Slopes
      { x: 14, z: 6, type: 'birch' },
      { x: 18, z: 9, type: 'oak' },
      { x: 15, z: 15, type: 'spruce' },
      { x: 19, z: 18, type: 'spruce' },

      // Near River / Pond
      { x: 8, z: -7, type: 'birch' },
      { x: 15, z: -5, type: 'oak' },
      { x: 18, z: -14, type: 'birch' },

      // Mountain Ridges
      { x: -21, z: 0, type: 'spruce' },
      { x: 21, z: -3, type: 'spruce' },
      { x: -20, z: -18, type: 'spruce' },
      { x: 20, z: 20, type: 'spruce' },
      { x: 0, z: 22, type: 'spruce' }
    ];

    treeLocations.forEach(loc => {
      const surfaceY = this.terrain.getHeight(loc.x, loc.z);
      // Only plant on grass and reasonable heights
      if (surfaceY >= 1 && surfaceY < 8) {
        if (loc.type === 'oak') {
          this.buildOakTree(loc.x, surfaceY + 1, loc.z);
        } else if (loc.type === 'birch') {
          this.buildBirchTree(loc.x, surfaceY + 1, loc.z);
        } else if (loc.type === 'spruce') {
          this.buildSpruceTree(loc.x, surfaceY + 1, loc.z);
        }
      }
    });

    // Add small bushes / shrubs
    const bushLocations = [
      { x: -4, z: -2 }, { x: 4, z: -2 },
      { x: -5, z: 2 }, { x: 5, z: 2 },
      { x: -8, z: 7 }, { x: 8, z: 7 },
      { x: 7, z: -12 }, { x: 11, z: -14 }
    ];

    bushLocations.forEach(b => {
      const y = this.terrain.getHeight(b.x, b.z);
      if (y >= 1) {
        this.terrain.addBlock(b.x, y + 1, b.z, 'oak_leaves', true);
        this.terrain.addBlock(b.x + 1, y + 1, b.z, 'oak_leaves', true);
        this.terrain.addBlock(b.x, y + 1, b.z + 1, 'oak_leaves', true);
      }
    });
  }

  buildOakTree(baseX, baseY, baseZ) {
    const trunkHeight = 4 + Math.floor(Math.random() * 2);

    // Trunk
    for (let y = 0; y < trunkHeight; y++) {
      this.terrain.addBlock(baseX, baseY + y, baseZ, 'oak_log', true);
    }

    // Canopy (5x5, 3x3, 1)
    const topTrunkY = baseY + trunkHeight - 1;

    // Layer 1 & 2: 5x5 canopy with rounded corners
    for (let dy = 0; dy <= 1; dy++) {
      const cy = topTrunkY + dy;
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          // Omit extreme outer 4 corners for rounded voxel canopy
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2 && Math.random() > 0.4) continue;
          if (dx === 0 && dz === 0 && dy === 0) continue; // trunk inside
          this.terrain.addBlock(baseX + dx, cy, baseZ + dz, 'oak_leaves', true);
        }
      }
    }

    // Layer 3: 3x3 canopy
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (Math.abs(dx) === 1 && Math.abs(dz) === 1 && Math.random() > 0.5) continue;
        this.terrain.addBlock(baseX + dx, topTrunkY + 2, baseZ + dz, 'oak_leaves', true);
      }
    }

    // Top cap (plus shape)
    this.terrain.addBlock(baseX, topTrunkY + 3, baseZ, 'oak_leaves', true);
    this.terrain.addBlock(baseX + 1, topTrunkY + 3, baseZ, 'oak_leaves', true);
    this.terrain.addBlock(baseX - 1, topTrunkY + 3, baseZ, 'oak_leaves', true);
    this.terrain.addBlock(baseX, topTrunkY + 3, baseZ + 1, 'oak_leaves', true);
    this.terrain.addBlock(baseX, topTrunkY + 3, baseZ - 1, 'oak_leaves', true);
  }

  buildBirchTree(baseX, baseY, baseZ) {
    const trunkHeight = 5 + Math.floor(Math.random() * 2);

    // Birch trunk
    for (let y = 0; y < trunkHeight; y++) {
      this.terrain.addBlock(baseX, baseY + y, baseZ, 'birch_log', true);
    }

    // Birch canopy (slender 3x3 and 2-layer)
    const topY = baseY + trunkHeight - 1;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (dx === 0 && dz === 0 && dy < 1) continue;
          this.terrain.addBlock(baseX + dx, topY + dy, baseZ + dz, 'birch_leaves', true);
        }
      }
    }
    this.terrain.addBlock(baseX, topY + 2, baseZ, 'birch_leaves', true);
  }

  buildSpruceTree(baseX, baseY, baseZ) {
    const trunkHeight = 6 + Math.floor(Math.random() * 2);

    // Spruce trunk
    for (let y = 0; y < trunkHeight; y++) {
      this.terrain.addBlock(baseX, baseY + y, baseZ, 'spruce_log', true);
    }

    // Conical tiered canopy
    const topY = baseY + trunkHeight - 1;

    // Base tier: 5x5 cross
    const bTierY = topY - 2;
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
        if (dx === 0 && dz === 0) continue;
        this.terrain.addBlock(baseX + dx, bTierY, baseZ + dz, 'spruce_leaves', true);
      }
    }

    // Middle tier: 3x3
    const mTierY = topY;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (Math.abs(dx) === 1 && Math.abs(dz) === 1 && Math.random() > 0.4) continue;
        if (dx === 0 && dz === 0) continue;
        this.terrain.addBlock(baseX + dx, mTierY, baseZ + dz, 'spruce_leaves', true);
      }
    }

    // Top spike
    this.terrain.addBlock(baseX, topY + 1, baseZ, 'spruce_leaves', true);
    this.terrain.addBlock(baseX, topY + 2, baseZ, 'spruce_leaves', true);
  }

  // Update wind sway in centralized loop
  update(elapsedTime) {
    // Subtle leaf mesh sway
    const leafMeshes = [
      this.terrain.instancedMeshes['oak_leaves'],
      this.terrain.instancedMeshes['birch_leaves'],
      this.terrain.instancedMeshes['spruce_leaves']
    ];

    const sway = Math.sin(elapsedTime * 1.5) * 0.015;
    leafMeshes.forEach(mesh => {
      if (mesh) {
        mesh.rotation.y = sway;
      }
    });
  }
}
