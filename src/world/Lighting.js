import * as THREE from 'three';

/**
 * Lighting.js
 * Manages cinematic Minecraft lighting:
 * - Directional sunlight with soft shadow mapping
 * - Hemisphere light for subtle ambient sky/ground contrast
 * - Dynamic color transitions driven by the sun/moon celestial positions
 */

export class Lighting {
  constructor(scene) {
    this.scene = scene;

    this.sunLight = null;
    this.hemiLight = null;
    this.init();
  }

  init() {
    // 1. Hemisphere Light (Soft ambient lighting with sky vs ground contrast)
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x445533, 0.65);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    // 2. Directional Sunlight
    this.sunLight = new THREE.DirectionalLight(0xfff5d6, 1.25);
    this.sunLight.position.set(30, 45, 20);
    this.sunLight.castShadow = true;

    // Optimize shadow frustum for the portfolio bounds
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 140;

    const d = 28;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;

    this.scene.add(this.sunLight);
  }

  updateSkyLighting(sunX, sunY, sunZ, sunElev, isRaining) {
    if (!this.sunLight || !this.hemiLight) return;

    if (sunElev > 0.15) {
      // Day
      this.sunLight.position.set(sunX, Math.max(15, sunY), sunZ);
      this.sunLight.color.setHex(isRaining ? 0xc4d4e0 : 0xfff5d6);
      this.sunLight.intensity = isRaining ? 0.75 : 1.25;

      this.hemiLight.color.setHex(isRaining ? 0xa0b0c0 : 0xddeeff);
      this.hemiLight.groundColor.setHex(0x445533);
      this.hemiLight.intensity = 0.65;
    } else if (sunElev > -0.15) {
      // Sunset / Sunrise
      const t = (sunElev - (-0.15)) / 0.3;
      this.sunLight.position.set(sunX, Math.max(10, sunY), sunZ);
      this.sunLight.color.lerpColors(new THREE.Color(0xff8833), new THREE.Color(0xfff5d6), t);
      this.sunLight.intensity = 0.85;

      this.hemiLight.color.lerpColors(new THREE.Color(0xee8855), new THREE.Color(0xddeeff), t);
      this.hemiLight.groundColor.setHex(0x332222);
      this.hemiLight.intensity = 0.55;
    } else {
      // Night (Moonlit - kept readable and clear)
      this.sunLight.position.set(-sunX, Math.max(15, -sunY), -sunZ);
      this.sunLight.color.setHex(0x7899cc); // Cool lunar light
      this.sunLight.intensity = 0.45;

      this.hemiLight.color.setHex(0x223355);
      this.hemiLight.groundColor.setHex(0x111622);
      this.hemiLight.intensity = 0.5; // Keeps world well-lit so portfolio remains readable
    }
  }

  setShadowQuality(quality) {
    if (!this.sunLight) return;
    if (quality === 'high') {
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 2048;
      this.sunLight.shadow.mapSize.height = 2048;
    } else if (quality === 'medium') {
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
    } else {
      // low
      this.sunLight.castShadow = false;
    }
  }

  dispose() {
    if (this.sunLight) this.scene.remove(this.sunLight);
    if (this.hemiLight) this.scene.remove(this.hemiLight);
  }
}
