import { portfolioData } from '../data/portfolioData.js';

/**
 * PortfolioUI.js
 * Manages the overlay UI:
 * - Top navigation bar
 * - Minecraft 9-slot Hotbar
 * - Detail Modals for Projects, Skills, About, Experience, and Contact
 * - Toast notification banner
 * - Settings drawer (Quality, Weather, Respawn delay)
 * - 2D Conventional layout toggle
 */

export class PortfolioUI {
  constructor(world) {
    this.world = world;
    this.is2DMode = false;

    this.modal = document.getElementById('portfolio-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.toastEl = document.getElementById('toast');

    this.init();
  }

  init() {
    this.setupNavLinks();
    this.setupHotbar();
    this.setupModalEvents();
    this.setupSettingsEvents();
    this.setupCopyEmail();
    this.setup2DToggle();
    this.setupResetWorld();
  }

  setupNavLinks() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.navigateToSection(section);
      });
    });

    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }
  }

  setupHotbar() {
    const slots = document.querySelectorAll('.hotbar-slot');
    slots.forEach(slot => {
      slot.addEventListener('click', () => {
        this.world.audioSystem.playClick();
        slots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');

        const action = slot.dataset.action;
        if (action === 'home') this.navigateToSection('home');
        else if (action === 'about') this.openAboutModal();
        else if (action === 'skills') this.openSkillsModal();
        else if (action === 'projects') this.openProjectsModal();
        else if (action === 'experience') this.openExperienceModal();
        else if (action === 'contact') this.openContactModal();
        else if (action === 'daynight') this.toggleDayNight();
        else if (action === 'audio') this.toggleAudio();
        else if (action === 'settings') this.toggleSettings();
      });
    });
  }

  navigateToSection(sectionId) {
    this.world.audioSystem.playClick();
    if (this.is2DMode) {
      const el = document.getElementById(`conv-${sectionId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    this.world.cameraController.flyToSection(sectionId);

    // Open corresponding modal for detailed reading
    if (sectionId === 'about') setTimeout(() => this.openAboutModal(), 600);
    else if (sectionId === 'skills') setTimeout(() => this.openSkillsModal(), 600);
    else if (sectionId === 'projects') setTimeout(() => this.openProjectsModal(), 600);
    else if (sectionId === 'experience') setTimeout(() => this.openExperienceModal(), 600);
    else if (sectionId === 'contact') setTimeout(() => this.openContactModal(), 600);
  }

  setupModalEvents() {
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  openModal(title, htmlContent) {
    if (!this.modal) return;
    this.modalTitle.innerHTML = title;
    this.modalBody.innerHTML = htmlContent;
    this.modal.classList.add('open');
    this.world.audioSystem.playClick();
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('open');
    }
  }

  openAboutModal() {
    const p = portfolioData.profile;
    const edu = portfolioData.education;

    const html = `
      <div class="modal-section">
        <span class="modal-tag">PLAYER LOG // LOCATION 01</span>
        <p style="font-size:1.05rem; line-height:1.7;">${p.aboutLong}</p>
        
        <div class="modal-split">
          <div class="modal-card">
            <h4>Degree & Academic Institution</h4>
            <p><strong>${edu.degree}</strong></p>
            <p>${edu.institution}</p>
            <p><strong>Timeline:</strong> ${edu.period} · <strong>CGPA:</strong> ${edu.cgpa}</p>
          </div>
          <div class="modal-card">
            <h4>Engineering Coursework</h4>
            <div class="conv-pills">
              ${edu.coursework.map(c => `<span class="pill">${c}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    this.openModal('About Jayaprakash G', html);
  }

  openSkillsModal() {
    const skills = portfolioData.skills;
    const html = `
      <div class="modal-section">
        <span class="modal-tag">SKILL TREE // LOCATION 02</span>
        <p>Interactive breakdown of technical competencies and engineering interests.</p>
        <div class="modal-grid">
          ${skills.map(cat => `
            <div class="modal-card">
              <h4>${cat.icon} ${cat.category}</h4>
              <div class="skill-stack">
                ${cat.items.map(it => `
                  <div class="skill-row">
                    <div class="skill-head"><strong>${it.name}</strong> <span class="conv-tag">${it.level}</span></div>
                    <small>${it.desc}</small>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    this.openModal('Technical Skill Tree', html);
  }

  openProjectsModal(selectedProjId = null) {
    const projects = portfolioData.projects;
    const html = `
      <div class="modal-section">
        <span class="modal-tag">MISSION HEADQUARTERS // LOCATION 03</span>
        <div class="modal-grid">
          ${projects.map(proj => `
            <div class="modal-card ${selectedProjId === proj.id ? 'highlight' : ''}">
              <span class="modal-tag">${proj.badge}</span>
              <h3>${proj.title}</h3>
              <p class="conv-subtitle">${proj.subtitle}</p>
              <p>${proj.fullDesc}</p>
              <h5>Key Features:</h5>
              <ul class="conv-list">
                ${proj.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <div class="conv-pills">
                ${proj.technologies.map(t => `<span class="pill tech-pill">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    this.openModal('Project Missions', html);
  }

  openProjectDetail(index) {
    const proj = portfolioData.projects[index];
    if (!proj) return;

    const html = `
      <div class="modal-section">
        <span class="modal-tag">${proj.badge}</span>
        <h3>${proj.title}</h3>
        <p class="conv-subtitle">${proj.subtitle}</p>
        <p style="font-size:1.05rem; line-height:1.7;">${proj.fullDesc}</p>
        <div class="modal-card" style="margin:16px 0;">
          <h4>Engineering Specifications:</h4>
          <ul class="conv-list">
            ${proj.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div class="conv-pills">
          ${proj.technologies.map(t => `<span class="pill tech-pill">${t}</span>`).join('')}
        </div>
      </div>
    `;
    this.openModal(proj.title, html);
  }

  openExperienceModal() {
    const exp = portfolioData.experience;
    const hack = portfolioData.hackathons;
    const certs = portfolioData.certifications;

    const html = `
      <div class="modal-section">
        <span class="modal-tag">FIELD LOGS // LOCATION 04 & 05</span>
        <div class="modal-grid">
          <div class="modal-card">
            <h4>Internship Experience</h4>
            ${exp.map(e => `
              <h5>${e.organization} · ${e.location}</h5>
              <p class="conv-tag">${e.role} (${e.period})</p>
              <p>${e.summary}</p>
              <ul class="conv-list">
                ${e.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            `).join('')}
          </div>
          <div class="modal-card">
            <h4>Hackathon Contributions</h4>
            ${hack.map(h => `
              <h5>${h.title}</h5>
              <p class="conv-tag">${h.role}</p>
              <p>${h.desc}</p>
            `).join('')}
            <h4 style="margin-top:20px;">Certifications</h4>
            <ul class="conv-list">
              ${certs.map(c => `<li><strong>${c.name}</strong> (${c.institution})</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    this.openModal('Experience & Hackathons', html);
  }

  openContactModal() {
    const p = portfolioData.profile;
    const html = `
      <div class="modal-section">
        <span class="modal-tag">COMMS PORTAL // LOCATION 06</span>
        <p>Available for roles in embedded systems, hardware prototyping, robotics, and AI automation.</p>
        
        <div class="modal-card" style="margin-top:16px;">
          <div class="contact-actions-vertical">
            <a href="mailto:${p.email}" class="conv-btn primary" style="display:block; text-align:center; margin:8px 0;">✉ Send Email: ${p.email}</a>
            <button id="copy-email-btn" class="conv-btn secondary" style="width:100%; margin:8px 0;">📋 Copy Email Address</button>
            <a href="tel:${p.phone.replace(/\s+/g, '')}" class="conv-btn secondary" style="display:block; text-align:center; margin:8px 0;">☎ Call: ${p.phone}</a>
            <a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" class="conv-btn secondary" style="display:block; text-align:center; margin:8px 0;">↗ Connect on LinkedIn</a>
          </div>
        </div>
      </div>
    `;
    this.openModal('Contact Jayaprakash G', html);

    setTimeout(() => {
      const copyBtn = document.getElementById('copy-email-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(p.email);
          this.showToast('📋 Email address copied to clipboard!');
        });
      }
    }, 50);
  }

  setupCopyEmail() {
    // Also handle copy anywhere in document
    const copyBtns = document.querySelectorAll('.copy-email-action');
    copyBtns.forEach(b => {
      b.addEventListener('click', () => {
        navigator.clipboard.writeText(portfolioData.profile.email);
        this.showToast('📋 Email address copied to clipboard!');
      });
    });
  }

  showToast(message, duration = 3000) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, duration);
  }

  toggleDayNight() {
    const isNight = this.world.sky.toggleDayNight();
    this.showToast(isNight ? '🌙 Night mode activated' : '☀️ Day mode activated');
    const slot = document.getElementById('slot-daynight');
    if (slot) slot.querySelector('.hotbar-icon').textContent = isNight ? '🌙' : '☀️';
  }

  toggleAudio() {
    const isMuted = this.world.audioSystem.toggleMute();
    this.showToast(isMuted ? '🔇 Audio Muted' : '🔊 Audio Unmuted');
    const slot = document.getElementById('slot-audio');
    if (slot) slot.querySelector('.hotbar-icon').textContent = isMuted ? '🔇' : '🔊';
  }

  toggleSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel) panel.classList.toggle('open');
  }

  setupSettingsEvents() {
    const panel = document.getElementById('settings-panel');
    const closeBtn = document.getElementById('settings-close');
    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => panel.classList.remove('open'));
    }

    // Graphics profile dropdown
    const gfxSelect = document.getElementById('graphics-select');
    if (gfxSelect) {
      gfxSelect.addEventListener('change', (e) => {
        this.world.performanceManager.setQuality(e.target.value);
        this.showToast(`⚙ Graphics set to ${e.target.value.toUpperCase()}`);
      });
    }

    // Weather toggle checkbox
    const weatherCheck = document.getElementById('weather-toggle');
    if (weatherCheck) {
      weatherCheck.addEventListener('change', (e) => {
        this.world.sky.setWeather(e.target.checked);
        this.showToast(e.target.checked ? '🌧 Rain enabled' : '☀️ Rain disabled');
      });
    }

    // Respawn delay slider
    const respawnSlider = document.getElementById('respawn-slider');
    const respawnLabel = document.getElementById('respawn-val');
    if (respawnSlider && respawnLabel) {
      respawnSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.world.miningSystem.respawnDelay = val;
        respawnLabel.textContent = `${val}s`;
      });
    }
  }

  setup2DToggle() {
    const toggleBtn = document.getElementById('toggle-2d-btn');
    const canvasWrap = document.getElementById('canvas-wrap');
    const convRoot = document.getElementById('conventional-root');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.is2DMode = !this.is2DMode;
        if (this.is2DMode) {
          canvasWrap.style.display = 'none';
          convRoot.style.display = 'block';
          toggleBtn.textContent = '🎮 3D Voxel World';
          this.showToast(' Switched to 2D Portfolio View');
        } else {
          canvasWrap.style.display = 'block';
          convRoot.style.display = 'none';
          toggleBtn.textContent = '📄 2D Portfolio View';
          this.showToast('🎮 Returned to 3D Voxel World');
          this.world.onWindowResize();
        }
      });
    }
  }

  setupResetWorld() {
    const resetBtn = document.getElementById('reset-world-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.world.terrain.resetAllBlocks();
        this.world.cameraController.resetCamera();
        this.showToast('✦ World blocks restored & camera returned to spawn!');
        this.world.audioSystem.playRespawn();
      });
    }
  }
}
