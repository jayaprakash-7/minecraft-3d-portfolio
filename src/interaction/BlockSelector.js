import * as THREE from 'three';

/**
 * BlockSelector.js
 * Uses Three.js Raycaster to detect the block or POI banner under the pointer.
 * Displays the classic Minecraft 3D black wireframe outline bounding box
 * around the hovered block and updates interaction tooltips.
 */

export class BlockSelector {
  constructor(camera, scene, terrain, domElement) {
    this.camera = camera;
    this.scene = scene;
    this.terrain = terrain;
    this.domElement = domElement;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    this.hoveredBlock = null;
    this.hoveredPOI = null;

    // Minecraft 3D Wireframe Selection Box (slightly larger than 1.0 unit: 1.004)
    const boxGeo = new THREE.BoxGeometry(1.004, 1.004, 1.004);
    const edges = new THREE.EdgesGeometry(boxGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
      depthTest: true
    });
    this.selectionBox = new THREE.LineSegments(edges, lineMat);
    this.selectionBox.visible = false;
    this.scene.add(this.selectionBox);

    // Block Tooltip element in DOM
    this.tooltipEl = document.getElementById('block-tooltip');

    this.setupListeners();
  }

  setupListeners() {
    this.domElement.addEventListener('pointermove', (e) => {
      // Convert to normalized device coordinates (-1 to +1)
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.tooltipEl) {
        this.tooltipEl.style.left = `${e.clientX + 16}px`;
        this.tooltipEl.style.top = `${e.clientY + 16}px`;
      }
    });

    this.domElement.addEventListener('pointerleave', () => {
      this.mouse.set(-999, -999);
      this.selectionBox.visible = false;
      this.hoveredBlock = null;
      this.hoveredPOI = null;
      if (this.tooltipEl) this.tooltipEl.classList.remove('visible');
    });
  }

  update(structures) {
    if (this.mouse.x < -1 || this.mouse.x > 1) {
      this.selectionBox.visible = false;
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Check for POI Banners first (clickable landmarks)
    if (structures && structures.poiObjects.length > 0) {
      const poiIntersects = this.raycaster.intersectObjects(structures.poiObjects, false);
      if (poiIntersects.length > 0) {
        const poi = poiIntersects[0].object;
        this.hoveredPOI = poi;
        this.selectionBox.visible = false;
        this.hoveredBlock = null;

        if (this.tooltipEl) {
          this.tooltipEl.textContent = `✦ ${poi.userData.title} (Click to open)`;
          this.tooltipEl.classList.add('visible');
        }
        return;
      }
    }
    this.hoveredPOI = null;

    // 2. Check InstancedMesh terrain blocks
    const targetMeshes = Object.values(this.terrain.instancedMeshes);
    const intersects = this.raycaster.intersectObjects(targetMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const block = this.terrain.getBlockFromIntersection(hit);

      if (block && !block.broken) {
        this.hoveredBlock = block;
        this.selectionBox.position.set(block.x, block.y, block.z);
        this.selectionBox.visible = true;

        if (this.tooltipEl) {
          const formattedType = block.type.replace(/_/g, ' ').toUpperCase();
          const mineableText = block.isMineable ? '⛏ HOLD TO MINE' : '🛡 PROTECTED';
          this.tooltipEl.textContent = `${formattedType} · ${mineableText}`;
          this.tooltipEl.classList.add('visible');
        }
        return;
      }
    }

    this.selectionBox.visible = false;
    this.hoveredBlock = null;
    if (this.tooltipEl) this.tooltipEl.classList.remove('visible');
  }

  dispose() {
    this.scene.remove(this.selectionBox);
    this.selectionBox.geometry.dispose();
    this.selectionBox.material.dispose();
  }
}
