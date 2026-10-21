import * as THREE from 'three';

/**
 * Structures.js
 * Builds interactive voxel structures representing the portfolio sections:
 * - Spawn Plaza & Welcome Monument
 * - About Cottage / Workshop
 * - Skill Pedestals Garden
 * - Project Laboratories (Robotics, Assistive Tech, Solar, Line Tracker, Hackathon)
 * - Experience & Training Hub
 * - Nether-style Comms Portal with purple particle vortex
 */

export class Structures {
  constructor(terrain, scene, textureGenerator) {
    this.terrain = terrain;
    this.scene = scene;
    this.textureGenerator = textureGenerator;

    this.poiObjects = []; // Clickable 3D POI interactables
    this.portalParticles = null;
    this.floatingBadges = [];

    this.buildSpawnPlaza();
    this.buildAboutHouse();
    this.buildSkillGarden();
    this.buildProjectsDistrict();
    this.buildExperienceWorkshop();
    this.buildCommsPortal();
  }

  // Create a 3D POI banner / billboard
  createPOIBanner(x, y, z, title, sectionId, icon = '✦') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Minecraft styled wooden/dark sign background
    ctx.fillStyle = '#1c281e';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#c6f36b';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 248, 120);

    ctx.fillStyle = '#72d572';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(icon + ' ' + title, 128, 54);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('[ CLICK TO OPEN ]', 128, 96);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;

    const planeGeo = new THREE.PlaneGeometry(2.4, 1.2);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });

    const bannerMesh = new THREE.Mesh(planeGeo, planeMat);
    bannerMesh.position.set(x, y, z);
    bannerMesh.name = `poi_${sectionId}`;
    bannerMesh.userData = {
      isPOI: true,
      sectionId: sectionId,
      title: title
    };

    this.scene.add(bannerMesh);
    this.poiObjects.push(bannerMesh);
    return bannerMesh;
  }

  // 1. Spawn Plaza (Center: 0, 1, 0)
  buildSpawnPlaza() {
    // Cobblestone border and lantern posts
    const corners = [
      { x: -3, z: -3 }, { x: 3, z: -3 },
      { x: -3, z: 3 }, { x: 3, z: 3 }
    ];

    corners.forEach(c => {
      this.terrain.addBlock(c.x, 2, c.z, 'cobblestone', false, true);
      this.terrain.addBlock(c.x, 3, c.z, 'oak_planks', false, true);
      this.terrain.addBlock(c.x, 4, c.z, 'glowstone', false, true);
    });

    // Central Welcome Obelisk
    this.terrain.addBlock(0, 2, -2, 'cobblestone', false, true);
    this.terrain.addBlock(0, 3, -2, 'stone', false, true);
    this.terrain.addBlock(0, 4, -2, 'glowstone', false, true);

    this.createPOIBanner(0, 5.2, -2, 'WELCOME', 'home', '▰');
  }

  // 2. About Cottage / Engineering Workshop (West: x = -10, z = -2)
  buildAboutHouse() {
    const ox = -10;
    const oz = -2;
    const by = 1;

    // 6x5 House walls with Oak Planks & Bricks
    for (let x = 0; x < 6; x++) {
      for (let z = 0; z < 5; z++) {
        const isWall = (x === 0 || x === 5 || z === 0 || z === 4);
        const isDoor = (x === 5 && z === 2); // Door facing east toward spawn path

        // Floor
        this.terrain.addBlock(ox + x, by, oz + z, 'oak_planks', false, true);

        if (isWall && !isDoor) {
          for (let y = 1; y <= 3; y++) {
            // Windows
            const isWindow = (y === 2 && ((x === 0 && z === 2) || (z === 0 && x === 2)));
            const blockType = isWindow ? 'glass' : (y === 1 ? 'cobblestone' : 'oak_planks');
            this.terrain.addBlock(ox + x, by + y, oz + z, blockType, false, true);
          }
        }
      }
    }

    // Interior Bookshelf & Crafting Table
    this.terrain.addBlock(ox + 1, by + 1, oz + 1, 'bookshelf', true);
    this.terrain.addBlock(ox + 1, by + 2, oz + 1, 'bookshelf', true);
    this.terrain.addBlock(ox + 2, by + 1, oz + 1, 'glowstone', false, true);

    // Pitched Wooden Roof
    for (let x = -1; x <= 6; x++) {
      this.terrain.addBlock(ox + x, by + 4, oz - 1, 'oak_log', false, true);
      this.terrain.addBlock(ox + x, by + 4, oz + 5, 'oak_log', false, true);
      for (let z = 0; z <= 4; z++) {
        this.terrain.addBlock(ox + x, by + 4, oz + z, 'bricks', false, true);
      }
      this.terrain.addBlock(ox + x, by + 5, oz + 2, 'oak_planks', false, true);
    }

    this.createPOIBanner(ox + 5.5, by + 3.8, oz + 2, 'ABOUT ME', 'about', '👤');
  }

  // 3. Skill Garden (South-West: x = -9, z = 7)
  buildSkillGarden() {
    const sx = -9;
    const sz = 7;
    const by = 1;

    // Pedestals for 4 skill categories
    const pedestals = [
      { dx: 0, dz: 0, ore: 'gold_ore', name: 'HARDWARE' },
      { dx: 3, dz: 0, ore: 'diamond_ore', name: 'PROGRAMMING' },
      { dx: 0, dz: 3, ore: 'iron_ore', name: 'TOOLS' },
      { dx: 3, dz: 3, ore: 'redstone_ore', name: 'INTERESTS' }
    ];

    pedestals.forEach(p => {
      this.terrain.addBlock(sx + p.dx, by + 1, sz + p.dz, 'cobblestone', false, true);
      this.terrain.addBlock(sx + p.dx, by + 2, sz + p.dz, p.ore, true);

      // Mini floating badge cube
      const badgeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const mat = this.textureGenerator.getMaterial(p.ore);
      const badge = new THREE.Mesh(badgeGeo, mat);
      badge.position.set(sx + p.dx, by + 3.2, sz + p.dz);
      badge.userData = { isBadge: true, rotSpeed: 1.5, baseHeight: by + 3.2 };
      this.scene.add(badge);
      this.floatingBadges.push(badge);
    });

    this.createPOIBanner(sx + 1.5, by + 4.2, sz - 0.8, 'SKILL TREE', 'skills', '⚡');
  }

  // 4. Projects Village (East: x = 9, z = -3)
  buildProjectsDistrict() {
    const px = 9;
    const pz = -3;
    const by = 1;

    // Project 1: Robotics Lab (North-East: x = 9, z = -6)
    this.buildLabStation(px, by, pz - 3, 'ROBOTICS LAB', 'project-0', 'lapis_ore');

    // Project 2: Assistive Walking Stick Station (x = 13, z = -2)
    this.buildLabStation(px + 4, by, pz + 1, 'ASSISTIVE TECH', 'project-1', 'emerald_ore');

    // Project 3: Solar Tracker Energy Area (x = 9, z = 3)
    this.buildLabStation(px, by, pz + 5, 'SOLAR TRACKER', 'project-2', 'gold_ore');

    // Project 4: Line Following Track (x = 13, z = 7)
    this.buildLabStation(px + 4, by, pz + 9, 'ROBOT TRACK', 'project-3', 'redstone_ore');

    // Master Project District Banner
    this.createPOIBanner(px - 1.2, by + 4.5, pz + 2, 'PROJECTS', 'projects', '🚀');
  }

  buildLabStation(x, by, z, title, projectId, oreType) {
    // Pedestal and tech terminal
    this.terrain.addBlock(x, by + 1, z, 'bricks', false, true);
    this.terrain.addBlock(x, by + 2, z, 'iron_ore', false, true);
    this.terrain.addBlock(x, by + 3, z, oreType, true);

    // Decorative glowstone beacon
    this.terrain.addBlock(x + 1, by + 1, z, 'cobblestone', false, true);
    this.terrain.addBlock(x + 1, by + 2, z, 'glowstone', false, true);

    this.createPOIBanner(x, by + 4.3, z, title, projectId, '⚙');
  }

  // 5. Experience Workshop & CFRSI Hub (South: x = 0, z = 10)
  buildExperienceWorkshop() {
    const ex = 0;
    const ez = 10;
    const by = 1;

    // Open-air workshop gazebo
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -1; dz <= 2; dz++) {
        this.terrain.addBlock(ex + dx, by, ez + dz, 'oak_planks', false, true);
      }
    }

    // Corner pillars
    [-2, 2].forEach(dx => {
      [-1, 2].forEach(dz => {
        this.terrain.addBlock(ex + dx, by + 1, ez + dz, 'oak_log', false, true);
        this.terrain.addBlock(ex + dx, by + 2, ez + dz, 'oak_log', false, true);
      });
    });

    // Bookshelf & tools
    this.terrain.addBlock(ex - 1, by + 1, ez + 2, 'bookshelf', true);
    this.terrain.addBlock(ex + 1, by + 1, ez + 2, 'bookshelf', true);
    this.terrain.addBlock(ex, by + 1, ez + 2, 'gold_ore', true);

    // Canopy top
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -1; dz <= 2; dz++) {
        this.terrain.addBlock(ex + dx, by + 3, ez + dz, 'oak_leaves', false, true);
      }
    }

    this.createPOIBanner(ex, by + 4.3, ez - 1.5, 'EXPERIENCE', 'experience', '📜');
  }

  // 6. Nether-style Comms Portal (North: x = 0, z = -10)
  buildCommsPortal() {
    const px = 0;
    const pz = -10;
    const by = 1;

    // 4x5 Obsidian Portal Frame
    // Bottom: 4 blocks (x from -1 to 2)
    for (let x = -1; x <= 2; x++) {
      this.terrain.addBlock(px + x, by + 1, pz, 'obsidian', false, true);
      this.terrain.addBlock(px + x, by + 5, pz, 'obsidian', false, true);
    }
    // Left & right pillars
    for (let y = 2; y <= 4; y++) {
      this.terrain.addBlock(px - 1, by + y, pz, 'obsidian', false, true);
      this.terrain.addBlock(px + 2, by + y, pz, 'obsidian', false, true);
    }

    // Portal membrane (semi-translucent purple plane)
    const portalGeo = new THREE.PlaneGeometry(2, 3);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide
    });
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalMesh.position.set(px + 0.5, by + 3, pz);
    this.scene.add(portalMesh);

    // Swirling purple portal particles
    const particleCount = 45;
    const partGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = px + 0.5 + (Math.random() - 0.5) * 2.2;
      positions[i * 3 + 1] = by + 1.8 + Math.random() * 2.6;
      positions[i * 3 + 2] = pz + (Math.random() - 0.5) * 0.8;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const partMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.15,
      transparent: true,
      opacity: 0.85
    });

    this.portalParticles = new THREE.Points(partGeo, partMat);
    this.scene.add(this.portalParticles);

    // Portal Light
    const portalLight = new THREE.PointLight(0xa855f7, 2.5, 9);
    portalLight.position.set(px + 0.5, by + 3, pz + 1);
    this.scene.add(portalLight);

    this.createPOIBanner(px + 0.5, by + 6.2, pz + 0.5, 'CONTACT ME', 'contact', '✉');
  }

  update(elapsedTime) {
    // 1. Floating badges spin and bob
    this.floatingBadges.forEach((b, idx) => {
      b.rotation.y = elapsedTime * (b.userData.rotSpeed || 1.0);
      b.position.y = b.userData.baseHeight + Math.sin(elapsedTime * 2.0 + idx) * 0.12;
    });

    // 2. Swirling portal particles
    if (this.portalParticles) {
      const posAttr = this.portalParticles.geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += 0.015; // Float upwards
        if (arr[i + 1] > 5.5) {
          arr[i + 1] = 2.0;
        }
        arr[i] += Math.sin(elapsedTime * 3.0 + i) * 0.005;
      }
      posAttr.needsUpdate = true;
    }

    // 3. POI banners face camera slightly or subtle hover bob
    this.poiObjects.forEach((banner, i) => {
      banner.position.y += Math.sin(elapsedTime * 2.0 + i) * 0.0008;
    });
  }

  dispose() {
    this.poiObjects.forEach(b => {
      this.scene.remove(b);
      b.geometry.dispose();
      b.material.dispose();
    });
    if (this.portalParticles) {
      this.scene.remove(this.portalParticles);
      this.portalParticles.geometry.dispose();
      this.portalParticles.material.dispose();
    }
  }
}
