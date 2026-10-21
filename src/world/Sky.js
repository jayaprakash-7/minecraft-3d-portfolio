import * as THREE from 'three';

/**
 * Sky.js
 * Renders procedural Minecraft-style animated sky:
 * - Blocky drifting voxel clouds
 * - Orbiting voxel Sun and Moon
 * - Twinkling night stars
 * - Atmospheric fog color transitions (Day, Sunset, Night, Sunrise)
 * - Rain weather particle system
 */

export class Sky {
  constructor(scene) {
    this.scene = scene;

    this.timeOfDay = 0.25; // 0.25 = Day/Noon, 0.5 = Sunset, 0.75 = Night, 0.0/1.0 = Sunrise
    this.dayDuration = 180; // seconds for full cycle (3 minutes)
    this.autoCycle = true;
    this.isRaining = false;

    this.sunMesh = null;
    this.moonMesh = null;
    this.stars = null;
    this.cloudGroup = null;
    this.rainParticles = null;

    this.skyColor = new THREE.Color(0x78b5e8);
    this.fogColor = new THREE.Color(0x8cc4f2);

    this.init();
  }

  init() {
    this.createSunAndMoon();
    this.createStars();
    this.createClouds();
    this.createRainSystem();

    // Scene atmospheric fog
    this.scene.fog = new THREE.FogExp2(this.fogColor, 0.016);
  }

  createSunAndMoon() {
    // Voxel Sun (Bright yellow square plane with glow)
    const sunGeo = new THREE.PlaneGeometry(8, 8);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfffa88,
      side: THREE.DoubleSide
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sunMesh);

    // Voxel Moon (Silver-white square plane)
    const moonGeo = new THREE.PlaneGeometry(7, 7);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xe6eef8,
      side: THREE.DoubleSide
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.scene.add(this.moonMesh);
  }

  createStars() {
    const starCount = 200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Hemisphere distribution high in the sky
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.45);
      const radius = 90;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) + 10;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.0 // Initially invisible during day
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  createClouds() {
    this.cloudGroup = new THREE.Group();
    this.cloudGroup.position.y = 32;

    const cloudCount = 14;
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.82
    });

    for (let i = 0; i < cloudCount; i++) {
      // Each cloud is composed of 3 to 6 flat voxel slabs
      const slabCount = 3 + Math.floor(Math.random() * 4);
      const cloudCenter = new THREE.Group();

      const cx = (Math.random() - 0.5) * 90;
      const cz = (Math.random() - 0.5) * 90;
      cloudCenter.position.set(cx, 0, cz);

      for (let s = 0; s < slabCount; s++) {
        const sx = 4 + Math.floor(Math.random() * 6);
        const sz = 4 + Math.floor(Math.random() * 6);
        const geo = new THREE.BoxGeometry(sx, 1.2, sz);
        const slab = new THREE.Mesh(geo, cloudMat);
        slab.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 6
        );
        cloudCenter.add(slab);
      }

      this.cloudGroup.add(cloudCenter);
    }

    this.scene.add(this.cloudGroup);
  }

  createRainSystem() {
    const rainCount = 600;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x9bc2e6,
      size: 0.25,
      transparent: true,
      opacity: 0.0 // Initially invisible
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.scene.add(this.rainParticles);
  }

  setWeather(isRaining) {
    this.isRaining = isRaining;
    if (this.rainParticles) {
      this.rainParticles.material.opacity = isRaining ? 0.75 : 0.0;
    }
  }

  toggleWeather() {
    this.setWeather(!this.isRaining);
    return this.isRaining;
  }

  setTimeOfDay(t) {
    this.timeOfDay = ((t % 1.0) + 1.0) % 1.0;
  }

  toggleDayNight() {
    // If day, switch to night (0.75); if night, switch to day (0.25)
    if (this.timeOfDay > 0.45 && this.timeOfDay < 0.9) {
      this.setTimeOfDay(0.25); // Day
    } else {
      this.setTimeOfDay(0.75); // Night
    }
    return this.isNight();
  }

  isNight() {
    return this.timeOfDay > 0.55 && this.timeOfDay < 0.95;
  }

  update(delta, lighting) {
    if (this.autoCycle) {
      this.timeOfDay = (this.timeOfDay + delta / this.dayDuration) % 1.0;
    }

    // 1. Sun and Moon celestial rotation
    const angle = this.timeOfDay * Math.PI * 2 - Math.PI / 2;
    const distance = 80;

    const sunX = Math.cos(angle) * distance;
    const sunY = Math.sin(angle) * distance;
    const sunZ = Math.sin(angle * 0.3) * 20;

    this.sunMesh.position.set(sunX, sunY, sunZ);
    this.sunMesh.lookAt(0, 0, 0);

    const moonX = -sunX;
    const moonY = -sunY;
    const moonZ = -sunZ;

    this.moonMesh.position.set(moonX, moonY, moonZ);
    this.moonMesh.lookAt(0, 0, 0);

    // 2. Sky & Fog color transitions based on sun angle
    const sunElev = Math.sin(angle); // -1 (midnight) to +1 (noon)

    if (sunElev > 0.2) {
      // Crisp Day
      this.skyColor.setHex(this.isRaining ? 0x5a6a7a : 0x78b5e8);
      this.fogColor.setHex(this.isRaining ? 0x697b8c : 0x8cc4f2);
      this.stars.material.opacity = 0.0;
    } else if (sunElev > -0.1) {
      // Golden Sunset / Sunrise
      const t = (sunElev - (-0.1)) / 0.3;
      const sunsetSky = new THREE.Color(0xd97736);
      const sunsetFog = new THREE.Color(0xdf8850);
      const daySky = new THREE.Color(0x78b5e8);
      const dayFog = new THREE.Color(0x8cc4f2);

      this.skyColor.lerpColors(sunsetSky, daySky, t);
      this.fogColor.lerpColors(sunsetFog, dayFog, t);
      this.stars.material.opacity = (1.0 - t) * 0.4;
    } else {
      // Night (Moonlit)
      this.skyColor.setHex(0x0e1726);
      this.fogColor.setHex(0x142033);
      this.stars.material.opacity = 0.85;
    }

    // Apply to scene background & fog
    if (this.scene.background) {
      this.scene.background.copy(this.skyColor);
    }
    if (this.scene.fog) {
      this.scene.fog.color.copy(this.fogColor);
    }

    // Update directional light & ambient colors in lighting system
    if (lighting) {
      lighting.updateSkyLighting(sunX, sunY, sunZ, sunElev, this.isRaining);
    }

    // 3. Clouds drift slowly across the sky
    if (this.cloudGroup) {
      this.cloudGroup.position.x = (this.cloudGroup.position.x + delta * 0.9) % 100;
    }

    // 4. Rain falling
    if (this.isRaining && this.rainParticles) {
      const pos = this.rainParticles.geometry.attributes.position;
      const arr = pos.array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] -= delta * 24.0;
        if (arr[i] < 0) {
          arr[i] = 28.0;
        }
      }
      pos.needsUpdate = true;
    }
  }

  dispose() {
    this.sunMesh.geometry.dispose();
    this.sunMesh.material.dispose();
    this.moonMesh.geometry.dispose();
    this.moonMesh.material.dispose();
    this.stars.geometry.dispose();
    this.stars.material.dispose();
    if (this.rainParticles) {
      this.rainParticles.geometry.dispose();
      this.rainParticles.material.dispose();
    }
  }
}
