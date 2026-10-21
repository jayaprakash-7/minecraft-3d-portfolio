import * as THREE from 'three';

/**
 * CameraController.js
 * Smooth orbit camera with preset section fly-to transitions,
 * parallax, mouse drag, wheel zoom, touch controls, and height bounds.
 */

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Spherical coordinates
    this.target = new THREE.Vector3(0, 2, 0);
    this.desiredTarget = new THREE.Vector3(0, 2, 0);

    this.radius = 16;
    this.desiredRadius = 16;
    this.minRadius = 4;
    this.maxRadius = 38;

    this.theta = 0.0; // horizontal angle around target
    this.desiredTheta = 0.0;

    this.phi = Math.PI / 4; // elevation angle (45 degrees)
    this.desiredPhi = Math.PI / 4;
    this.minPhi = 0.15;
    this.maxPhi = Math.PI / 2.15; // prevent going below horizon

    // Interaction state
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.isFlying = false;

    // Subtle parallax offset
    this.parallax = { x: 0, y: 0 };

    this.presetViews = {
      home: { pos: new THREE.Vector3(0, 8, 14), target: new THREE.Vector3(0, 2, 0) },
      about: { pos: new THREE.Vector3(-6, 6, 5), target: new THREE.Vector3(-10, 3, -1) },
      skills: { pos: new THREE.Vector3(-6, 7, 14), target: new THREE.Vector3(-9, 3, 7) },
      projects: { pos: new THREE.Vector3(6, 7, 4), target: new THREE.Vector3(11, 3, 1) },
      experience: { pos: new THREE.Vector3(0, 7, 17), target: new THREE.Vector3(0, 3, 10) },
      contact: { pos: new THREE.Vector3(0, 6, -3), target: new THREE.Vector3(0, 3, -10) }
    };

    this.setupEventListeners();
    this.updateCameraImmediate();
  }

  setupEventListeners() {
    const el = this.domElement;

    // Pointer down (mouse / touch)
    el.addEventListener('pointerdown', (e) => {
      // Only drag if left click or touch and not clicking UI
      if (e.button === 0) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointermove', (e) => {
      // Update mouse parallax
      this.parallax.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      this.parallax.y = (e.clientY / window.innerHeight - 0.5) * 0.3;

      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      const sensitivity = 0.006;
      this.desiredTheta -= deltaX * sensitivity;
      this.desiredPhi -= deltaY * sensitivity;

      this.desiredPhi = Math.max(this.minPhi, Math.min(this.maxPhi, this.desiredPhi));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.isFlying = false; // User manually took over
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Mouse wheel zoom
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.0035;
      this.desiredRadius += e.deltaY * zoomSpeed * (this.desiredRadius * 0.15);
      this.desiredRadius = Math.max(this.minRadius, Math.min(this.maxRadius, this.desiredRadius));
      this.isFlying = false;
    }, { passive: false });

    // Touch pinch to zoom support
    let initialTouchDist = 0;
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDist = Math.hypot(dx, dy);
      }
    });

    el.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = initialTouchDist - dist;

        this.desiredRadius += diff * 0.04;
        this.desiredRadius = Math.max(this.minRadius, Math.min(this.maxRadius, this.desiredRadius));
        initialTouchDist = dist;
      }
    });
  }

  // Smooth cinematic fly to a section
  flyToSection(sectionId) {
    const view = this.presetViews[sectionId] || this.presetViews.home;
    this.desiredTarget.copy(view.target);

    // Calculate desired spherical coords from target to pos
    const offset = new THREE.Vector3().subVectors(view.pos, view.target);
    this.desiredRadius = offset.length();
    this.desiredPhi = Math.acos(Math.max(-1, Math.min(1, offset.y / this.desiredRadius)));
    this.desiredTheta = Math.atan2(offset.x, offset.z);

    this.isFlying = true;
  }

  resetCamera() {
    this.flyToSection('home');
  }

  updateCameraImmediate() {
    this.theta = this.desiredTheta;
    this.phi = this.desiredPhi;
    this.radius = this.desiredRadius;
    this.target.copy(this.desiredTarget);

    const x = this.target.x + this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.target.y + this.radius * Math.cos(this.phi);
    const z = this.target.z + this.radius * Math.sin(this.phi) * Math.cos(this.theta);

    this.camera.position.set(x, Math.max(2.0, y), z);
    this.camera.lookAt(this.target);
  }

  update(delta) {
    // Smooth dampening interpolation (lerp)
    const lerpFactor = this.isFlying ? 3.5 * delta : 6.0 * delta;

    this.theta += (this.desiredTheta - this.theta) * lerpFactor;
    this.phi += (this.desiredPhi - this.phi) * lerpFactor;
    this.radius += (this.desiredRadius - this.radius) * lerpFactor;
    this.target.lerp(this.desiredTarget, lerpFactor);

    // Spherical position computation
    const x = this.target.x + this.radius * Math.sin(this.phi) * Math.sin(this.theta) + this.parallax.x;
    const y = this.target.y + this.radius * Math.cos(this.phi) + this.parallax.y;
    const z = this.target.z + this.radius * Math.sin(this.phi) * Math.cos(this.theta);

    // Ensure camera stays above terrain floor
    this.camera.position.set(x, Math.max(2.2, y), z);
    this.camera.lookAt(this.target);
  }
}
