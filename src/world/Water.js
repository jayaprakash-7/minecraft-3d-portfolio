import * as THREE from 'three';

/**
 * Water.js
 * Renders the animated river and lake water surface with
 * UV scrolling, gentle sinusoidal vertex wobble, and transparency.
 */

export class Water {
  constructor(scene, textureGenerator) {
    this.scene = scene;
    this.textureGenerator = textureGenerator;
    this.waterMesh = null;
    this.waterTexture = null;
    this.init();
  }

  init() {
    // Clone water texture so we can animate its offset independently
    this.waterTexture = this.textureGenerator.textures.water.clone();
    this.waterTexture.wrapS = THREE.RepeatWrapping;
    this.waterTexture.wrapT = THREE.RepeatWrapping;
    this.waterTexture.repeat.set(16, 16);

    const geo = new THREE.PlaneGeometry(36, 36, 18, 18);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      map: this.waterTexture,
      color: 0x3388cc,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    });

    this.waterMesh = new THREE.Mesh(geo, mat);
    // Position at river/lake depression (x: 12, z: -10, y: 0.8)
    this.waterMesh.position.set(12, 0.75, -10);
    this.waterMesh.receiveShadow = true;
    this.scene.add(this.waterMesh);
  }

  update(delta, elapsedTime) {
    if (this.waterTexture) {
      // Flowing water UV drift
      this.waterTexture.offset.x = (this.waterTexture.offset.x + delta * 0.08) % 1;
      this.waterTexture.offset.y = (this.waterTexture.offset.y + delta * 0.04) % 1;
    }

    if (this.waterMesh) {
      // Very gentle surface height oscillation
      this.waterMesh.position.y = 0.75 + Math.sin(elapsedTime * 1.8) * 0.03;
    }
  }

  dispose() {
    if (this.waterMesh) {
      this.scene.remove(this.waterMesh);
      this.waterMesh.geometry.dispose();
      this.waterMesh.material.dispose();
    }
    if (this.waterTexture) {
      this.waterTexture.dispose();
    }
  }
}
