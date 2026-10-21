import * as THREE from 'three';

/**
 * Textures.js
 * Generates procedural pixel-art canvas textures for all voxel blocks,
 * foliage, ores, materials, and mining crack overlays.
 * Uses NearestFilter for authentic crisp Minecraft voxel aesthetics.
 */

// Helper to create an offscreen canvas
function createCanvas(size = 32) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

// Convert canvas to Three.js texture with NearestFilter
function createTextureFromCanvas(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

// Simple seeded pseudo-random generator for consistent pixel patterns
function createPRNG(seed = 12345) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export class TextureGenerator {
  constructor() {
    this.textures = {};
    this.crackTextures = [];
    this.materials = {};
    this.init();
  }

  init() {
    this.generateBlockTextures();
    this.generateCrackOverlays();
  }

  // Generate 16x16 or 32x32 pixel-art textures
  generateBlockTextures() {
    this.textures.grass_top = this.generateGrassTop();
    this.textures.grass_side = this.generateGrassSide();
    this.textures.dirt = this.generateDirt();
    this.textures.stone = this.generateStone();
    this.textures.cobblestone = this.generateCobblestone();
    this.textures.oak_planks = this.generateOakPlanks();
    this.textures.oak_log_side = this.generateLogSide('#6d4e32', '#4c3420', '#835e3c');
    this.textures.oak_log_top = this.generateLogTop('#bca076', '#876847', '#5c4126');
    this.textures.oak_leaves = this.generateLeaves('#3b7a32', '#2d6026', '#4a953e');
    this.textures.birch_log_side = this.generateBirchLogSide();
    this.textures.birch_leaves = this.generateLeaves('#5ea03b', '#487f2b', '#78be4f');
    this.textures.spruce_log_side = this.generateLogSide('#382718', '#25190f', '#4a3522');
    this.textures.spruce_leaves = this.generateLeaves('#264d2e', '#1c3b23', '#33633d');
    this.textures.sand = this.generateSand();
    this.textures.water = this.generateWater();
    this.textures.glass = this.generateGlass();
    this.textures.bricks = this.generateBricks();
    this.textures.bookshelf = this.generateBookshelf();
    this.textures.obsidian = this.generateObsidian();
    this.textures.glowstone = this.generateGlowstone();
    this.textures.redstone_lamp = this.generateRedstoneLamp();

    // Ore textures
    this.textures.diamond_ore = this.generateOre('#4dedf4', '#2bc2c9');
    this.textures.gold_ore = this.generateOre('#fcee4b', '#d4af24');
    this.textures.iron_ore = this.generateOre('#d8af93', '#b38d72');
    this.textures.redstone_ore = this.generateOre('#ff2200', '#c21000');
    this.textures.emerald_ore = this.generateOre('#17dd62', '#0eb04b');
    this.textures.lapis_ore = this.generateOre('#2244bb', '#152b7e');
  }

  generateGrassTop() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(101);
    const colors = ['#4e8e35', '#579d3b', '#62af42', '#417a2c', '#3c7228'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateGrassSide() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(202);
    const dirtColors = ['#866043', '#795438', '#6b482e', '#5e3f28'];
    const grassColors = ['#579d3b', '#62af42', '#4e8e35', '#417a2c'];

    // Fill dirt base
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = dirtColors[Math.floor(rng() * dirtColors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Grass fringe hanging from top (varied depths: 2 to 5 pixels)
    for (let x = 0; x < 16; x++) {
      const fringeDepth = 2 + Math.floor(rng() * 4);
      for (let y = 0; y <= fringeDepth; y++) {
        ctx.fillStyle = grassColors[Math.floor(rng() * grassColors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateDirt() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(303);
    const colors = ['#866043', '#795438', '#6b482e', '#5e3f28', '#946d4c'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateStone() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(404);
    const colors = ['#757575', '#808080', '#6b6b6b', '#616161', '#8c8c8c'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateCobblestone() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(505);
    const baseColors = ['#545454', '#636363', '#727272', '#828282'];
    const mortar = '#383838';

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        // Mortar lines separating irregular stone lumps
        const isBorder = (x % 5 === 0 && (y % 4 !== 0)) || (y % 4 === 0 && (x % 5 !== 2));
        if (isBorder && rng() > 0.3) {
          ctx.fillStyle = mortar;
        } else {
          ctx.fillStyle = baseColors[Math.floor(rng() * baseColors.length)];
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateOakPlanks() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(606);
    const woodColors = ['#b8945f', '#a9834e', '#c5a36e', '#9b7642'];
    const seam = '#624620';

    for (let y = 0; y < 16; y++) {
      const isSeam = y % 4 === 0;
      for (let x = 0; x < 16; x++) {
        if (isSeam) {
          ctx.fillStyle = seam;
        } else {
          // Vertical planks seam staggered
          const plankIndex = Math.floor(y / 4);
          const isPlankBreak = (plankIndex % 2 === 0 && x === 7) || (plankIndex % 2 === 1 && (x === 3 || x === 11));
          if (isPlankBreak) {
            ctx.fillStyle = seam;
          } else {
            ctx.fillStyle = woodColors[Math.floor(rng() * woodColors.length)];
          }
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateLogSide(mid, dark, light) {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(707);
    const colors = [mid, dark, light];

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        // Vertical bark grooves
        const groove = (x % 3 === 0);
        ctx.fillStyle = groove ? dark : (rng() > 0.3 ? mid : light);
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateBirchLogSide() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(750);
    const whites = ['#dedede', '#e8e8e8', '#f2f2f2', '#cfcfcf'];
    const blacks = ['#282828', '#1c1c1c'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = whites[Math.floor(rng() * whites.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Horizontal dark birch markings
    const markRows = [3, 7, 11, 14];
    markRows.forEach(row => {
      const start = Math.floor(rng() * 10);
      const len = 2 + Math.floor(rng() * 4);
      for (let i = 0; i < len; i++) {
        ctx.fillStyle = blacks[Math.floor(rng() * blacks.length)];
        ctx.fillRect((start + i) % 16, row, 1, 1);
      }
    });

    return createTextureFromCanvas(canvas);
  }

  generateLogTop(core, ring, bark) {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const dx = x - 7.5;
        const dy = y - 7.5;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 7) {
          ctx.fillStyle = bark;
        } else if (dist > 4.5 || (dist > 2 && dist < 3.2)) {
          ctx.fillStyle = ring;
        } else {
          ctx.fillStyle = core;
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateLeaves(mid, dark, light) {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(808);
    const colors = [mid, dark, light];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        // Some leaf holes for airy voxel feel
        if (rng() < 0.12) {
          ctx.fillStyle = dark;
        } else {
          ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateSand() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(909);
    const colors = ['#dfce9f', '#d7c490', '#ebd9ab', '#cbb780'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateWater() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1010);
    const blues = ['#2968a8', '#327ac4', '#3d8ce0', '#22568e'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = blues[Math.floor(rng() * blues.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateGlass() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(210, 240, 255, 0.28)';
    ctx.fillRect(0, 0, 16, 16);

    // Frame border
    ctx.strokeStyle = '#c4e8f8';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, 15, 15);

    // Diagonal specular glint lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 2, 2, 1);
    ctx.fillRect(4, 3, 2, 1);
    ctx.fillRect(6, 4, 2, 1);

    ctx.fillRect(3, 10, 2, 1);
    ctx.fillRect(5, 11, 2, 1);

    const tex = createTextureFromCanvas(canvas);
    return tex;
  }

  generateBricks() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1111);
    const brickRed = ['#9c4938', '#ab5341', '#8b3d2d', '#b75b47'];
    const mortar = '#d3c9ba';

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const isHorizMortar = y % 4 === 0;
        const row = Math.floor(y / 4);
        const isVertMortar = (row % 2 === 0 && x % 8 === 0) || (row % 2 === 1 && (x + 4) % 8 === 0);

        if (isHorizMortar || isVertMortar) {
          ctx.fillStyle = mortar;
        } else {
          ctx.fillStyle = brickRed[Math.floor(rng() * brickRed.length)];
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateBookshelf() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1212);
    const wood = '#9b7642';
    const bookColors = ['#9e2b25', '#22577a', '#38b000', '#7b2cbf', '#e09f3e'];

    // Outer wood shelf
    ctx.fillStyle = wood;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#5c4126';
    ctx.fillRect(0, 7, 16, 2);

    // Books on top shelf
    for (let x = 1; x < 15; x += 2) {
      ctx.fillStyle = bookColors[Math.floor(rng() * bookColors.length)];
      ctx.fillRect(x, 1, 2, 6);
    }
    // Books on bottom shelf
    for (let x = 1; x < 15; x += 2) {
      ctx.fillStyle = bookColors[Math.floor(rng() * bookColors.length)];
      ctx.fillRect(x, 9, 2, 6);
    }
    return createTextureFromCanvas(canvas);
  }

  generateObsidian() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1313);
    const purples = ['#15101e', '#1c1529', '#241b36', '#2d2244', '#100c17', '#3d2b5c'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = purples[Math.floor(rng() * purples.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateGlowstone() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1414);
    const golds = ['#eed055', '#e0be3a', '#cfa727', '#fff188', '#ad8415'];

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = golds[Math.floor(rng() * golds.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return createTextureFromCanvas(canvas);
  }

  generateRedstoneLamp() {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1515);

    ctx.fillStyle = '#55341c';
    ctx.fillRect(0, 0, 16, 16);

    ctx.fillStyle = '#a66b3c';
    ctx.fillRect(2, 2, 12, 12);

    ctx.fillStyle = '#f99e38';
    ctx.fillRect(4, 4, 8, 8);

    return createTextureFromCanvas(canvas);
  }

  generateOre(gemColor, gemDark) {
    const canvas = createCanvas(16);
    const ctx = canvas.getContext('2d');
    const rng = createPRNG(1616);
    const stoneColors = ['#757575', '#808080', '#6b6b6b', '#616161'];

    // Fill stone background
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = stoneColors[Math.floor(rng() * stoneColors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Gem specks
    const gemSpots = [
      [3, 4], [4, 4], [3, 5],
      [11, 3], [12, 3], [12, 4],
      [6, 9], [7, 9], [7, 10], [6, 10],
      [10, 12], [11, 12],
      [2, 13]
    ];

    gemSpots.forEach(([x, y]) => {
      ctx.fillStyle = gemColor;
      ctx.fillRect(x, y, 1, 1);
    });

    // Dark borders on some spots for 3D depth
    gemSpots.slice(0, 4).forEach(([x, y]) => {
      ctx.fillStyle = gemDark;
      ctx.fillRect((x + 1) % 16, (y + 1) % 16, 1, 1);
    });

    return createTextureFromCanvas(canvas);
  }

  // 10 Progressive Cracking Overlays (Stage 0 to Stage 9)
  generateCrackOverlays() {
    this.crackTextures = [];
    const crackSeeds = [
      [[7, 7]],
      [[7, 7], [8, 7], [7, 8]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8], [4, 10], [10, 4], [3, 7], [11, 8]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8], [4, 10], [10, 4], [3, 7], [11, 8], [3, 11], [12, 5], [6, 4], [8, 11]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8], [4, 10], [10, 4], [3, 7], [11, 8], [3, 11], [12, 5], [6, 4], [8, 11], [2, 12], [13, 3], [5, 12], [11, 12]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8], [4, 10], [10, 4], [3, 7], [11, 8], [3, 11], [12, 5], [6, 4], [8, 11], [2, 12], [13, 3], [5, 12], [11, 12], [1, 13], [14, 2], [2, 5], [13, 10]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8], [4, 10], [10, 4], [3, 7], [11, 8], [3, 11], [12, 5], [6, 4], [8, 11], [2, 12], [13, 3], [5, 12], [11, 12], [1, 13], [14, 2], [2, 5], [13, 10], [0, 14], [15, 1], [4, 2], [11, 14]],
      [[7, 7], [8, 7], [7, 8], [6, 8], [8, 6], [5, 9], [9, 5], [9, 8], [4, 10], [10, 4], [3, 7], [11, 8], [3, 11], [12, 5], [6, 4], [8, 11], [2, 12], [13, 3], [5, 12], [11, 12], [1, 13], [14, 2], [2, 5], [13, 10], [0, 14], [15, 1], [4, 2], [11, 14], [0, 0], [15, 15], [0, 15], [15, 0]]
    ];

    for (let stage = 0; stage < 10; stage++) {
      const canvas = createCanvas(16);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 16, 16);

      const pixels = crackSeeds[stage];
      // Draw white highlight border first
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      pixels.forEach(([x, y]) => {
        ctx.fillRect(Math.min(15, x + 1), y, 1, 1);
        ctx.fillRect(x, Math.min(15, y + 1), 1, 1);
      });

      // Draw dark core crack
      ctx.fillStyle = 'rgba(20, 20, 20, 0.92)';
      pixels.forEach(([x, y]) => {
        ctx.fillRect(x, y, 1, 1);
      });

      const tex = createTextureFromCanvas(canvas);
      this.crackTextures.push(tex);
    }
  }

  // Get material for block type
  getMaterial(type) {
    if (this.materials[type]) return this.materials[type];

    let mat;
    switch (type) {
      case 'grass':
        // Cube with different sides (right, left, top, bottom, front, back)
        mat = [
          new THREE.MeshLambertMaterial({ map: this.textures.grass_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.grass_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.grass_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.dirt }),
          new THREE.MeshLambertMaterial({ map: this.textures.grass_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.grass_side })
        ];
        break;
      case 'dirt':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.dirt });
        break;
      case 'stone':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.stone });
        break;
      case 'cobblestone':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.cobblestone });
        break;
      case 'oak_planks':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.oak_planks });
        break;
      case 'oak_log':
        mat = [
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_side })
        ];
        break;
      case 'birch_log':
        mat = [
          new THREE.MeshLambertMaterial({ map: this.textures.birch_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.birch_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.birch_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.birch_log_side })
        ];
        break;
      case 'spruce_log':
        mat = [
          new THREE.MeshLambertMaterial({ map: this.textures.spruce_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.spruce_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_log_top }),
          new THREE.MeshLambertMaterial({ map: this.textures.spruce_log_side }),
          new THREE.MeshLambertMaterial({ map: this.textures.spruce_log_side })
        ];
        break;
      case 'oak_leaves':
        mat = new THREE.MeshLambertMaterial({
          map: this.textures.oak_leaves,
          transparent: true,
          opacity: 0.94,
          alphaTest: 0.1
        });
        break;
      case 'birch_leaves':
        mat = new THREE.MeshLambertMaterial({
          map: this.textures.birch_leaves,
          transparent: true,
          opacity: 0.94,
          alphaTest: 0.1
        });
        break;
      case 'spruce_leaves':
        mat = new THREE.MeshLambertMaterial({
          map: this.textures.spruce_leaves,
          transparent: true,
          opacity: 0.94,
          alphaTest: 0.1
        });
        break;
      case 'sand':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.sand });
        break;
      case 'water':
        mat = new THREE.MeshStandardMaterial({
          map: this.textures.water,
          transparent: true,
          opacity: 0.75,
          roughness: 0.1,
          metalness: 0.2
        });
        break;
      case 'glass':
        mat = new THREE.MeshStandardMaterial({
          map: this.textures.glass,
          transparent: true,
          opacity: 0.45,
          roughness: 0.1
        });
        break;
      case 'bricks':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.bricks });
        break;
      case 'bookshelf':
        mat = [
          new THREE.MeshLambertMaterial({ map: this.textures.bookshelf }),
          new THREE.MeshLambertMaterial({ map: this.textures.bookshelf }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_planks }),
          new THREE.MeshLambertMaterial({ map: this.textures.oak_planks }),
          new THREE.MeshLambertMaterial({ map: this.textures.bookshelf }),
          new THREE.MeshLambertMaterial({ map: this.textures.bookshelf })
        ];
        break;
      case 'obsidian':
        mat = new THREE.MeshStandardMaterial({
          map: this.textures.obsidian,
          roughness: 0.4,
          metalness: 0.3
        });
        break;
      case 'glowstone':
        mat = new THREE.MeshBasicMaterial({
          map: this.textures.glowstone
        });
        break;
      case 'redstone_lamp':
        mat = new THREE.MeshStandardMaterial({
          map: this.textures.redstone_lamp,
          emissive: new THREE.Color('#ff8822'),
          emissiveIntensity: 0.6
        });
        break;
      case 'diamond_ore':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.diamond_ore });
        break;
      case 'gold_ore':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.gold_ore });
        break;
      case 'iron_ore':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.iron_ore });
        break;
      case 'redstone_ore':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.redstone_ore });
        break;
      case 'emerald_ore':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.emerald_ore });
        break;
      case 'lapis_ore':
        mat = new THREE.MeshLambertMaterial({ map: this.textures.lapis_ore });
        break;
      default:
        mat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    }

    this.materials[type] = mat;
    return mat;
  }

  getCrackTexture(stage) {
    const s = Math.max(0, Math.min(9, Math.floor(stage)));
    return this.crackTextures[s] || this.crackTextures[0];
  }
}
