import * as THREE from 'three';

/**
 * ParticleSystem.js
 * Manages cubic voxel debris particles when blocks are mined.
 * Uses object pooling and batch updating with gravity, velocity, rotation, and fading.
 */

export class ParticleSystem {
  constructor(scene, textureGenerator) {
    this.scene = scene;
    this.textureGenerator = textureGenerator;
    this.particles = [];
    this.pool = [];
    this.maxParticles = 120;

    // Shared unit cube geometry for all mini voxel debris
    this.geometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);

    // Common materials cache for particle types
    this.particleMaterials = {};
    this.initMaterialCache();
  }

  initMaterialCache() {
    const types = [
      'dirt', 'grass', 'stone', 'cobblestone', 'oak_planks',
      'oak_log', 'birch_log', 'spruce_log', 'oak_leaves',
      'sand', 'bricks', 'diamond_ore', 'gold_ore', 'iron_ore',
      'redstone_ore', 'emerald_ore', 'lapis_ore', 'obsidian'
    ];

    types.forEach(type => {
      const baseMat = this.textureGenerator.getMaterial(type);
      let map = null;
      let color = 0x888888;

      if (Array.isArray(baseMat)) {
        map = baseMat[0].map;
      } else if (baseMat.map) {
        map = baseMat.map;
      }

      this.particleMaterials[type] = new THREE.MeshBasicMaterial({
        map: map,
        transparent: true,
        opacity: 1.0,
        color: map ? 0xffffff : color
      });
    });
  }

  getMaterialForType(type) {
    return this.particleMaterials[type] || this.particleMaterials['dirt'];
  }

  // Spawn a burst of cubic debris at the mined block's world position
  spawnBlockBreakParticles(worldPos, blockType = 'dirt', count = 12) {
    for (let i = 0; i < count; i++) {
      let p;
      if (this.pool.length > 0) {
        p = this.pool.pop();
        p.mesh.visible = true;
      } else if (this.particles.length < this.maxParticles) {
        const mesh = new THREE.Mesh(this.geometry, this.getMaterialForType(blockType));
        this.scene.add(mesh);
        p = {
          mesh: mesh,
          velocity: new THREE.Vector3(),
          rotVelocity: new THREE.Vector3(),
          life: 0,
          maxLife: 0.85
        };
      } else {
        // Recycle oldest particle
        p = this.particles.shift();
      }

      p.mesh.material = this.getMaterialForType(blockType);
      p.mesh.position.set(
        worldPos.x + (Math.random() - 0.5) * 0.7,
        worldPos.y + (Math.random() - 0.5) * 0.7,
        worldPos.z + (Math.random() - 0.5) * 0.7
      );

      // Random burst velocity (upward bias + outward explosion)
      const speed = 2.5 + Math.random() * 3.0;
      const angle = Math.random() * Math.PI * 2;
      const upSpeed = 2.0 + Math.random() * 3.5;

      p.velocity.set(
        Math.cos(angle) * speed,
        upSpeed,
        Math.sin(angle) * speed
      );

      p.rotVelocity.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      p.life = 0;
      p.maxLife = 0.6 + Math.random() * 0.4;
      p.mesh.scale.setScalar(0.7 + Math.random() * 0.6);
      p.mesh.material.opacity = 1.0;

      this.particles.push(p);
    }
  }

  update(delta) {
    const gravity = -12.0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        // Return to pool
        p.mesh.visible = false;
        this.pool.push(p);
        this.particles.splice(i, 1);
        continue;
      }

      // Physics integration
      p.velocity.y += gravity * delta;
      p.mesh.position.addScaledVector(p.velocity, delta);

      p.mesh.rotation.x += p.rotVelocity.x * delta;
      p.mesh.rotation.y += p.rotVelocity.y * delta;
      p.mesh.rotation.z += p.rotVelocity.z * delta;

      // Scale down and fade towards end of life
      const progress = p.life / p.maxLife;
      const scale = Math.max(0.1, 1.0 - progress * 0.8);
      p.mesh.scale.setScalar(scale);
      p.mesh.material.opacity = Math.max(0.0, 1.0 - progress);
    }
  }

  dispose() {
    this.geometry.dispose();
    Object.values(this.particleMaterials).forEach(mat => mat.dispose());
    this.particles.forEach(p => this.scene.remove(p.mesh));
    this.pool.forEach(p => this.scene.remove(p.mesh));
    this.particles = [];
    this.pool = [];
  }
}
