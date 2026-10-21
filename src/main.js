import { World } from './world/World.js';
import { PortfolioUI } from './portfolio/PortfolioUI.js';
import { ConventionalView } from './portfolio/ConventionalView.js';

/**
 * main.js
 * Application entry point:
 * - WebGL support check and graceful non-WebGL fallback
 * - 2D Conventional view initialization
 * - Animated loading screen sequence
 * - 3D World engine startup
 * - Audio autoplay unlock
 */

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const convContainer = document.getElementById('conventional-container');
  const conventionalView = new ConventionalView(convContainer);
  conventionalView.render();

  const loadingScreen = document.getElementById('loading-screen');
  const loadingFill = document.getElementById('loading-fill');
  const loadingText = document.getElementById('loading-text');

  // Check WebGL compatibility
  if (!isWebGLAvailable()) {
    console.warn('WebGL is not supported on this browser/device. Defaulting to 2D portfolio view.');
    if (loadingScreen) loadingScreen.classList.add('hidden');
    const canvasWrap = document.getElementById('canvas-wrap');
    if (canvasWrap) canvasWrap.style.display = 'none';
    const convRoot = document.getElementById('conventional-root');
    if (convRoot) convRoot.style.display = 'block';
    return;
  }

  // Simulated staged loading progress
  let progress = 15;
  const updateProgress = (val, text) => {
    progress = val;
    if (loadingFill) loadingFill.style.width = `${progress}%`;
    if (loadingText) loadingText.textContent = text;
  };

  updateProgress(35, 'Generating procedural voxel terrain and hills...');

  setTimeout(() => {
    try {
      updateProgress(65, 'Planting oak, birch, and spruce voxel trees...');
      const canvas = document.getElementById('webgl-canvas');
      const world = new World(canvas);
      const ui = new PortfolioUI(world);
      world.ui = ui;

      // Settings open button hook
      const openSettingsBtn = document.getElementById('open-settings-btn');
      if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => ui.toggleSettings());
      }

      updateProgress(90, 'Calibrating raycast mining physics and audio...');

      setTimeout(() => {
        updateProgress(100, 'Welcome to Jayaprakash G\'s Voxel World!');
        setTimeout(() => {
          if (loadingScreen) {
            loadingScreen.classList.add('hidden');
          }
        }, 400);
      }, 350);

    } catch (err) {
      console.error('Failed to initialize 3D World:', err);
      if (loadingScreen) loadingScreen.classList.add('hidden');
      const canvasWrap = document.getElementById('canvas-wrap');
      if (canvasWrap) canvasWrap.style.display = 'none';
      const convRoot = document.getElementById('conventional-root');
      if (convRoot) convRoot.style.display = 'block';
    }
  }, 250);

  // Global Audio Unlock on first interaction
  const unlockAudio = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      // AudioContext resumed on interaction
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
});
