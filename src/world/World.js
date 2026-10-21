import * as THREE from 'three';
import { TextureGenerator } from './Textures.js';
import { Terrain } from './Terrain.js';
import { Vegetation } from './Vegetation.js';
import { Structures } from './Structures.js';
import { Water } from './Water.js';
import { Sky } from './Sky.js';
import { Lighting } from './Lighting.js';
import { CameraController } from './CameraController.js';
import { ParticleSystem } from '../interaction/ParticleSystem.js';
import { BlockSelector } from '../interaction/BlockSelector.js';
import { MiningSystem } from '../interaction/MiningSystem.js';
import { AudioSystem } from '../interaction/AudioSystem.js';
import { PerformanceManager } from '../utils/performance.js';

/**
 * World.js
 * Central 3D engine coordinator linking rendering, physics, terrain,
 * camera, lighting, audio, and the delta-time animation loop.
 */

export class World {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.textureGenerator = null;
    this.terrain = null;
    this.vegetation = null;
    this.structures = null;
    this.water = null;
    this.sky = null;
    this.lighting = null;
    this.cameraController = null;
    this.particleSystem = null;
    this.blockSelector = null;
    this.miningSystem = null;
    this.audioSystem = null;
    this.performanceManager = null;
    this.ui = null; // Set by main.js

    this.isTabHidden = false;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x78b5e8);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 300);

    // 2. WebGLRenderer with high-end Acer Nitro / RTX & mobile compatibility
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // 3. Procedural Systems
    this.textureGenerator = new TextureGenerator();
    this.audioSystem = new AudioSystem();

    this.lighting = new Lighting(this.scene);
    this.sky = new Sky(this.scene);
    this.terrain = new Terrain(this.scene, this.textureGenerator);
    this.vegetation = new Vegetation(this.terrain, this.scene);
    this.structures = new Structures(this.terrain, this.scene, this.textureGenerator);
    this.water = new Water(this.scene, this.textureGenerator);

    this.cameraController = new CameraController(this.camera, this.canvas);
    this.particleSystem = new ParticleSystem(this.scene, this.textureGenerator);
    this.blockSelector = new BlockSelector(this.camera, this.scene, this.terrain, this.canvas);
    this.miningSystem = new MiningSystem(
      this.scene,
      this.terrain,
      this.textureGenerator,
      this.particleSystem,
      this.audioSystem,
      this.canvas
    );

    this.performanceManager = new PerformanceManager(this);

    // Setup Block Mined Toast Callback
    this.miningSystem.onBlockMinedCallback = (type, delay) => {
      if (this.ui) {
        const cleanName = type.replace(/_/g, ' ').toUpperCase();
        this.ui.showToast(`⛏ Mined ${cleanName}! (Respawning in ${delay}s)`);
      }
    };

    // Setup POI Banner Click Handling
    this.canvas.addEventListener('click', (e) => {
      if (e.target.closest('nav, .modal, .hotbar, .panel, button, a')) return;
      if (this.blockSelector.hoveredPOI && this.ui) {
        const sec = this.blockSelector.hoveredPOI.userData.sectionId;
        if (sec.startsWith('project-')) {
          const idx = parseInt(sec.split('-')[1], 10);
          this.ui.openProjectDetail(idx);
        } else {
          this.ui.navigateToSection(sec);
        }
      }
    });

    this.setupListeners();
    this.animate();
  }

  setupListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    // Pause / throttle when browser tab is hidden
    document.addEventListener('visibilitychange', () => {
      this.isTabHidden = document.hidden;
      if (!this.isTabHidden) {
        this.clock.getDelta(); // reset delta to prevent large jump
      }
    });
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.isTabHidden) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Camera & Systems Update
    this.cameraController.update(delta);
    this.sky.update(delta, this.lighting);
    this.water.update(delta, elapsedTime);
    this.vegetation.update(elapsedTime);
    this.structures.update(elapsedTime);
    this.particleSystem.update(delta);

    // 2. Interaction Raycasting & Mining
    this.blockSelector.update(this.structures);
    this.miningSystem.update(delta, this.blockSelector, elapsedTime);

    // 3. Performance tracking
    this.performanceManager.update(delta);

    // 4. Render
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
    this.terrain.dispose();
    this.water.dispose();
    this.sky.dispose();
    this.lighting.dispose();
    this.particleSystem.dispose();
    this.blockSelector.dispose();
    this.miningSystem.dispose();
  }
}
