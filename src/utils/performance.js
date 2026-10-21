/**
 * performance.js
 * Tracks FPS, manages graphics profiles (High, Medium, Low),
 * caps devicePixelRatio, and automatically scales settings if FPS dips.
 */

export class PerformanceManager {
  constructor(world) {
    this.world = world;
    this.quality = 'high'; // 'high' | 'medium' | 'low'

    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.lowFpsDuration = 0;

    this.fpsDisplay = document.getElementById('fps-counter');
  }

  setQuality(level) {
    this.quality = level;
    const renderer = this.world.renderer;
    if (!renderer) return;

    if (level === 'high') {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      renderer.shadowMap.enabled = true;
      this.world.lighting.setShadowQuality('high');
      this.world.particleSystem.maxParticles = 140;
    } else if (level === 'medium') {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      this.world.lighting.setShadowQuality('medium');
      this.world.particleSystem.maxParticles = 80;
    } else {
      // low
      renderer.setPixelRatio(1.0);
      renderer.shadowMap.enabled = false;
      this.world.lighting.setShadowQuality('low');
      this.world.particleSystem.maxParticles = 40;
    }

    const select = document.getElementById('graphics-select');
    if (select) select.value = level;
  }

  update(delta) {
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      if (this.fpsDisplay) {
        this.fpsDisplay.textContent = `${this.fps} FPS`;
      }

      // Dynamic quality throttling if FPS is sustained below 24 for 4 seconds
      if (this.fps < 24) {
        this.lowFpsDuration += 1.0;
        if (this.lowFpsDuration > 4.0 && this.quality !== 'low') {
          console.warn('FPS low, automatically adjusting graphics to ensure smooth experience.');
          this.setQuality(this.quality === 'high' ? 'medium' : 'low');
          this.lowFpsDuration = 0;
        }
      } else {
        this.lowFpsDuration = 0;
      }
    }
  }
}
