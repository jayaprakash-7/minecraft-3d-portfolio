/**
 * AudioSystem.js
 * Synthesizes procedural 8-bit / voxel audio effects using the Web Audio API.
 * Guarantees zero external network asset dependencies, zero missing audio files,
 * and handles browser autoplay policies gracefully.
 */

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
    this.ambientGain = null;
    this.portalGain = null;
    this.portalOsc = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx ? this.ctx.currentTime : 0);
    }
    if (this.portalGain) {
      this.portalGain.gain.setValueAtTime(muted ? 0 : 0.06, this.ctx ? this.ctx.currentTime : 0);
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Play a block hit / dig sound
  playHit(material = 'dirt') {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    let startFreq = 160;
    let endFreq = 60;
    let duration = 0.08;

    if (material === 'stone' || material.includes('ore')) {
      startFreq = 340;
      endFreq = 120;
      osc.type = 'square';
    } else if (material === 'wood' || material.includes('planks') || material.includes('log')) {
      startFreq = 220;
      endFreq = 90;
      osc.type = 'triangle';
    } else if (material.includes('leaves')) {
      startFreq = 480;
      endFreq = 260;
      osc.type = 'sawtooth';
      duration = 0.05;
    } else {
      // Grass / dirt
      startFreq = 180;
      endFreq = 70;
      osc.type = 'sine';
    }

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Play a crack sound during progressive mining
  playCrack() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Short burst of filtered white noise
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // Play a block destruction break sound
  playBreak(material = 'dirt') {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Noise burst
    const bufferSize = this.ctx.sampleRate * 0.16;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = material.includes('ore') ? 'highpass' : 'lowpass';
    filter.frequency.setValueAtTime(material.includes('ore') ? 1400 : 700, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 2. Tonal pop chime
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const isGem = material.includes('ore') || material === 'diamond_ore';

    osc.type = isGem ? 'triangle' : 'sine';
    const baseFreq = isGem ? 587.33 : 260; // D5 or C4

    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.14);

    oscGain.gain.setValueAtTime(0.25, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Play block respawn chime
  playRespawn() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(640, t + 0.12);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // UI button click sound
  playClick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.04);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Ambient Nether portal hum when near portal
  startPortalHum() {
    if (this.portalOsc || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      this.portalOsc = this.ctx.createOscillator();
      this.portalGain = this.ctx.createGain();

      this.portalOsc.type = 'sine';
      this.portalOsc.frequency.setValueAtTime(55, t); // Low A1

      // Subtle LFO modulation
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(1.5, t);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(8, t);
      lfo.connect(lfoGain);
      lfoGain.connect(this.portalOsc.frequency);
      lfo.start(t);

      this.portalGain.gain.setValueAtTime(this.muted ? 0 : 0.04, t);

      this.portalOsc.connect(this.portalGain);
      this.portalGain.connect(this.ctx.destination);
      this.portalOsc.start(t);
    } catch (e) {
      // Ignored
    }
  }
}
