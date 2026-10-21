# Jayaprakash G — Realistic Live Minecraft 3D Portfolio

An immersive, real-time, Minecraft-inspired 3D personal portfolio for **Jayaprakash G**, Electronics and Communication Engineering Graduate (Class of 2026), built with **Three.js**, **Vite**, and procedural voxel graphics.

---

## 🌟 Highlights & Key Features

- **Genuine 3D Voxel World**: Real-time 3D environment generated procedurally with grass, dirt, stone cliffs, sand beaches, river water, and mountain ranges using Three.js `InstancedMesh`.
- **Authentic Mining Mechanics**:
  - Raycaster-based 3D block selection with Minecraft's black wireframe bounding box.
  - Hold-to-mine action with 10 progressive cracking stages (procedural pixel-art crack overlays).
  - Block vibration during mining.
  - Cubic debris particle bursts with outward physics velocity, gravity, and tumble rotation.
  - Automatic block restoration / respawning after configurable delay (default 12s).
  - Protected architectural structures so critical portfolio buildings cannot be permanently destroyed.
- **Voxel Foliage & Dynamic Nature**:
  - Oak trees, white-barked Birch trees, and tiered Spruce/Pine trees with gentle wind sway.
  - Drifting blocky voxel clouds at altitude.
  - Celestial Day-to-Night cycle with orbiting voxel Sun, Moon, twinkling night stars, and dynamic atmospheric fog transitions.
  - Shimmering, flowing water surface with UV waves and transparency.
  - Optional voxel rain weather particle system.
- **Interactive Portfolio Structures**:
  - **Spawn Plaza**: Welcome monument, cobblestone pathways, torches, and lanterns.
  - **About Cottage**: Cozy wooden workshop with books, crafting table, and degree records.
  - **Skill Garden**: Pedestals showcasing Hardware (Gold), Programming (Diamond), Tools (Iron), and Career Interests (Redstone).
  - **Projects District**: 4 specialized interactive laboratory stations & tracks:
    1. *Offline Emotional Support Robot Using Raspberry Pi*
    2. *Assistive Walking Stick (ESP32 / Ultrasonic)*
    3. *Pendulum-Based Solar Tracker (SIH 2024)*
    4. *Line-Following Robot with Obstacle Avoidance (Arduino UNO)*
    5. *Hackathon Pavilion (Smart India Hackathon 2024 & Tata InnoVent 2025)*
  - **Experience & Training Hub**: Dedicated zone for IGNITE SKYLABS embedded internship and CFRSI Generative AI coursework.
  - **Nether Comms Portal**: Glowing obsidian portal with purple particle swirling vortex and contact triggers.
- **Minecraft 9-Slot Hotbar & HUD**:
  - Slot 1: ⛏ Pickaxe (Mine blocks)
  - Slot 2: 🗺 Spawn Plaza
  - Slot 3: 📖 About Cottage
  - Slot 4: ⚡ Skill Garden
  - Slot 5: 🚀 Projects Village
  - Slot 6: 📜 Experience Hub
  - Slot 7: ✉ Comms Portal
  - Slot 8: ☀️ Day/Night Cycle Toggle
  - Slot 9: 🔊 8-Bit Audio Synthesizer Toggle
- **Procedural Audio Synthesizer**: Web Audio API sound synthesizer generating authentic digging hits, cracks, pops, and chimes with zero external audio assets.
- **Performance Optimized for Acer Nitro Lite 16 (i7-13620H + RTX 4050)**:
  - High, Medium, and Low graphics profiles.
  - Automatic quality reduction if frame rates drop below threshold.
  - Instanced draw calls for thousands of voxel blocks.
- **Accessibility & Non-WebGL Fallback**:
  - "📄 2D View" toggle for quick reading without 3D exploration.
  - Graceful automatic fallback if WebGL is unavailable.
  - Responsive layout for desktop, laptops, tablets, and mobile phones.

---

## 🛠️ Project Structure

```
portfolio/
├── index.html                 # Semantic HTML shell, SEO tags, HUD, Hotbar, Modals
├── package.json               # Three.js and Vite dependencies
├── vite.config.js             # Vite configuration
├── README.md                  # Documentation and setup instructions
├── src/
│   ├── main.js                # Bootstrap, WebGL check, loading progress
│   ├── style.css              # Minecraft aesthetic styling, HUD, modals, responsive design
│   ├── data/
│   │   └── portfolioData.js   # Centralized resume & project data for Jayaprakash G
│   ├── world/
│   │   ├── World.js           # Central 3D engine coordinator & animation loop
│   │   ├── Terrain.js         # Procedural voxel terrain & InstancedMesh management
│   │   ├── Textures.js        # Procedural pixel-art canvas textures & 10 crack stages
│   │   ├── Vegetation.js      # Oak, birch, spruce trees, and wind sway
│   │   ├── Structures.js      # Spawn, About house, Skill garden, Project labs, Portal
│   │   ├── Water.js           # Flowing river & lake water surface
│   │   ├── Sky.js             # Sun/Moon orbit, day/night cycle, clouds, rain
│   │   ├── Lighting.js        # Directional sunlight, soft shadows, sky transitions
│   │   └── CameraController.js# Orbit, smooth lerp fly-to, zoom, bounds clamping
│   ├── interaction/
│   │   ├── BlockSelector.js   # Raycasting, 3D wireframe bounding box, hover tooltip
│   │   ├── MiningSystem.js    # Progressive cracking, durability, break, respawn queue
│   │   ├── ParticleSystem.js  # 3D cubic voxel debris physics & object pooling
│   │   └── AudioSystem.js     # Web Audio API procedural sound synthesizer
│   ├── portfolio/
│   │   ├── PortfolioUI.js     # HUD navigation, modals, settings drawer, toast alerts
│   │   └── ConventionalView.js# Semantic 2D accessible portfolio layout
│   └── utils/
│       └── performance.js     # FPS counter, graphics profiles, dynamic resolution cap
└── vendor/
    └── three.module.js        # Offline fallback Three.js bundle
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🎮 Controls & Exploration

- **Camera Orbit**: Click and drag with left mouse button (or swipe on touchscreens) to rotate camera.
- **Zoom**: Mouse scroll wheel (or two-finger pinch on touchscreens).
- **Mining**: Hover over any mineable voxel block and **hold left click / touch** until cracked.
- **Section Navigation**: Click any link in top navigation, banner sign in the 3D world, or hotbar slots 2–7.
- **Day/Night**: Click Hotbar Slot 8 (☀️/🌙).
- **Sound Toggle**: Click Hotbar Slot 9 (🔊/🔇).
- **2D / 3D Mode**: Click "📄 2D View" in top right.
- **Reset World**: Click "✦ Reset" in top nav to respawn all broken blocks and return camera to spawn.
- **Settings**: Click "⚙ Settings" to configure Graphics Quality, Weather (Rain), and Block Respawn Delay.
