import * as THREE from 'three';

/**
 * MiningSystem.js
 * Implements the authentic Minecraft voxel mining mechanic:
 * - Hold left click / touch to mine
 * - Progressive cracking overlay mesh (stages 0 to 9)
 * - Block vibration / shaking
 * - Material-dependent mining durations (durability)
 * - Cubic debris particle bursts on destruction
 * - Automatic block respawn timer with configurable delay
 * - Audio synthesis synchronization
 */

export class MiningSystem {
  constructor(scene, terrain, textureGenerator, particleSystem, audioSystem, domElement) {
    this.scene = scene;
    this.terrain = terrain;
    this.textureGenerator = textureGenerator;
    this.particleSystem = particleSystem;
    this.audioSystem = audioSystem;
    this.domElement = domElement;

    this.isMining = false;
    this.miningBlock = null;
    this.miningProgress = 0; // 0.0 to 1.0
    this.lastHitSoundTime = 0;

    this.respawnDelay = 12.0; // seconds
    this.respawnQueue = [];

    // Progressive Cracking Overlay Box (1.002 to prevent z-fighting)
    const crackGeo = new THREE.BoxGeometry(1.002, 1.002, 1.002);
    this.crackMaterial = new THREE.MeshBasicMaterial({
      map: this.textureGenerator.getCrackTexture(0),
      transparent: true,
      opacity: 0.95,
      depthTest: true
    });
    this.crackMesh = new THREE.Mesh(crackGeo, this.crackMaterial);
    this.crackMesh.visible = false;
    this.scene.add(this.crackMesh);

    // Mining HUD progress ring in DOM
    this.miningIndicator = document.getElementById('mining-indicator');
    this.miningRing = document.getElementById('mining-ring');

    // Block durability table (seconds to mine)
    this.durabilityTable = {
      oak_leaves: 0.28,
      birch_leaves: 0.28,
      spruce_leaves: 0.28,
      dirt: 0.5,
      grass: 0.55,
      sand: 0.45,
      oak_planks: 0.85,
      oak_log: 0.95,
      birch_log: 0.95,
      spruce_log: 0.95,
      stone: 1.25,
      cobblestone: 1.3,
      bricks: 1.4,
      glass: 0.35,
      bookshelf: 0.75,
      iron_ore: 1.5,
      gold_ore: 1.6,
      redstone_ore: 1.6,
      emerald_ore: 1.8,
      lapis_ore: 1.6,
      diamond_ore: 2.2,
      obsidian: 3.8
    };

    this.onBlockMinedCallback = null;
    this.setupListeners();
  }

  getDurability(type) {
    return this.durabilityTable[type] || 0.8;
  }

  setupListeners() {
    this.domElement.addEventListener('pointerdown', (e) => {
      // Ignore right clicks or clicks on UI overlays
      if (e.button !== 0) return;
      if (e.target.closest('nav, .modal, .hotbar, .panel, button, a')) return;

      this.audioSystem.ensureContext();
      this.isMining = true;
    });

    window.addEventListener('pointerup', () => {
      this.cancelMining();
    });

    window.addEventListener('pointercancel', () => {
      this.cancelMining();
    });
  }

  startMining(block) {
    this.miningBlock = block;
    this.miningProgress = 0;
    this.crackMesh.position.set(block.x, block.y, block.z);
    this.crackMesh.visible = true;
  }

  cancelMining() {
    this.isMining = false;
    this.miningBlock = null;
    this.miningProgress = 0;
    this.crackMesh.visible = false;

    if (this.miningIndicator) {
      this.miningIndicator.classList.remove('active');
    }
  }

  update(delta, blockSelector, elapsedTime) {
    // 1. Process Respawn Queue
    for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
      const item = this.respawnQueue[i];
      item.timeLeft -= delta;
      if (item.timeLeft <= 0) {
        this.terrain.restoreBlock(item.block);
        this.audioSystem.playRespawn();
        this.respawnQueue.splice(i, 1);
      }
    }

    // 2. Process Mining Action
    const targetBlock = blockSelector.hoveredBlock;

    if (this.isMining && targetBlock && targetBlock.isMineable && !targetBlock.broken) {
      if (this.miningBlock !== targetBlock) {
        this.startMining(targetBlock);
      }

      const totalTime = this.getDurability(this.miningBlock.type);
      this.miningProgress += delta / totalTime;

      // Progressive cracking stage (0 to 9)
      const stage = Math.min(9, Math.floor(this.miningProgress * 10));
      this.crackMaterial.map = this.textureGenerator.getCrackTexture(stage);
      this.crackMaterial.needsUpdate = true;

      // Block vibration during digging
      const jitter = (Math.random() - 0.5) * 0.04;
      this.crackMesh.position.set(
        this.miningBlock.x + jitter,
        this.miningBlock.y + jitter,
        this.miningBlock.z + jitter
      );

      // Play digging sound effect periodically
      if (elapsedTime - this.lastHitSoundTime > 0.16) {
        this.audioSystem.playHit(this.miningBlock.type);
        this.lastHitSoundTime = elapsedTime;
      }

      // Update Screen HUD Ring
      if (this.miningIndicator && this.miningRing) {
        this.miningIndicator.classList.add('active');
        const percent = Math.min(100, Math.round(this.miningProgress * 100));
        this.miningRing.style.setProperty('--progress', `${percent}%`);
      }

      // Block Break Threshold Reached
      if (this.miningProgress >= 1.0) {
        this.completeBlockBreak(this.miningBlock);
      }
    } else {
      if (this.miningBlock) {
        this.cancelMining();
      }
    }
  }

  completeBlockBreak(block) {
    const worldPos = new THREE.Vector3(block.x, block.y, block.z);
    const type = block.type;

    // 1. Hide block in terrain
    this.terrain.breakBlock(block);

    // 2. Burst cubic debris particles
    this.particleSystem.spawnBlockBreakParticles(worldPos, type, 14);

    // 3. Play break chime sound
    this.audioSystem.playBreak(type);

    // 4. Queue automatic respawn
    this.respawnQueue.push({
      block: block,
      timeLeft: this.respawnDelay
    });

    // 5. Notify HUD callback
    if (this.onBlockMinedCallback) {
      this.onBlockMinedCallback(type, this.respawnDelay);
    }

    this.cancelMining();
  }

  dispose() {
    this.scene.remove(this.crackMesh);
    this.crackMesh.geometry.dispose();
    this.crackMaterial.dispose();
  }
}
