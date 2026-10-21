import { portfolioData } from '../data/portfolioData.js';

/**
 * ConventionalView.js
 * Generates the complete, semantic 2D HTML portfolio layout.
 * Provides accessibility, screen reader friendliness, and instant non-WebGL fallback.
 */

export class ConventionalView {
  constructor(container) {
    this.container = container;
  }

  render() {
    const p = portfolioData.profile;
    const skills = portfolioData.skills;
    const projects = portfolioData.projects;
    const hackathons = portfolioData.hackathons;
    const experience = portfolioData.experience;
    const edu = portfolioData.education;
    const certs = portfolioData.certifications;

    this.container.innerHTML = `
      <div class="conventional-portfolio" id="conventional-root">
        <header class="conv-hero">
          <div class="conv-wrap">
            <span class="conv-badge">PORTFOLIO // JAYAPRAKASH G</span>
            <h1>${p.name}</h1>
            <h2>${p.title}</h2>
            <p class="conv-intro">${p.intro}</p>
            <div class="conv-actions">
              <a href="#conv-projects" class="conv-btn primary">View Projects</a>
              <a href="#conv-skills" class="conv-btn secondary">Technical Skills</a>
              <a href="#conv-contact" class="conv-btn secondary">Contact Info</a>
            </div>
          </div>
        </header>

        <section class="conv-section" id="conv-about">
          <div class="conv-wrap">
            <h2 class="conv-section-title">01 // Profile & Education</h2>
            <div class="conv-grid two-col">
              <div class="conv-card">
                <h3>About Me</h3>
                <p>${p.aboutLong}</p>
                <div class="conv-meta">
                  <p><strong>Location:</strong> ${p.location}</p>
                  <p><strong>Status:</strong> ECE Graduate (Class of 2026)</p>
                </div>
              </div>
              <div class="conv-card">
                <h3>Academic Background</h3>
                <p><strong>${edu.degree}</strong></p>
                <p>${edu.institution}</p>
                <p><strong>Period:</strong> ${edu.period} · <strong>CGPA:</strong> ${edu.cgpa}</p>
                <h4>Core Coursework:</h4>
                <div class="conv-pills">
                  ${edu.coursework.map(c => `<span class="pill">${c}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="conv-section" id="conv-skills">
          <div class="conv-wrap">
            <h2 class="conv-section-title">02 // Technical Skills</h2>
            <div class="conv-grid">
              ${skills.map(cat => `
                <div class="conv-card">
                  <div class="conv-icon-header">${cat.icon} <h3>${cat.category}</h3></div>
                  <div class="conv-skills-list">
                    ${cat.items.map(item => `
                      <div class="conv-skill-item">
                        <div class="conv-skill-name"><strong>${item.name}</strong> <span class="conv-tag">${item.level}</span></div>
                        <p class="conv-skill-desc">${item.desc}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="conv-section" id="conv-projects">
          <div class="conv-wrap">
            <h2 class="conv-section-title">03 // Featured Projects</h2>
            <div class="conv-grid">
              ${projects.map(proj => `
                <div class="conv-card project-card">
                  <span class="conv-badge">${proj.badge}</span>
                  <h3>${proj.title}</h3>
                  <p class="conv-subtitle">${proj.subtitle}</p>
                  <p>${proj.fullDesc}</p>
                  <h4>Key Implementations:</h4>
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
        </section>

        <section class="conv-section" id="conv-hackathons">
          <div class="conv-wrap">
            <h2 class="conv-section-title">04 // Hackathons & Innovation</h2>
            <div class="conv-grid two-col">
              ${hackathons.map(h => `
                <div class="conv-card">
                  <h3>${h.title}</h3>
                  <p class="conv-tag">${h.role}</p>
                  <p>${h.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="conv-section" id="conv-experience">
          <div class="conv-wrap">
            <h2 class="conv-section-title">05 // Experience & Certifications</h2>
            <div class="conv-grid two-col">
              <div class="conv-card">
                <h3>Internship Experience</h3>
                ${experience.map(exp => `
                  <div class="exp-item">
                    <h4>${exp.organization} — ${exp.location}</h4>
                    <p class="conv-tag">${exp.role} (${exp.period})</p>
                    <p>${exp.summary}</p>
                    <ul class="conv-list">
                      ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
              <div class="conv-card">
                <h3>Certifications & Workshops</h3>
                <ul class="conv-list">
                  ${certs.map(c => `<li><strong>${c.name}</strong> — <em>${c.institution}</em></li>`).join('')}
                </ul>
                <h4 style="margin-top:20px;">Continuous Learning</h4>
                <p><strong>Automation with Generative AI</strong> — CFRSI (Currently Pursuing)</p>
              </div>
            </div>
          </div>
        </section>

        <section class="conv-section" id="conv-contact">
          <div class="conv-wrap">
            <h2 class="conv-section-title">06 // Contact Information</h2>
            <div class="conv-card contact-card">
              <h3>Get In Touch</h3>
              <p>Feel free to reach out for embedded systems, hardware prototyping, robotics, or engineering opportunities.</p>
              <div class="conv-actions">
                <a href="mailto:${p.email}" class="conv-btn primary">✉ Email: ${p.email}</a>
                <a href="tel:${p.phone.replace(/\s+/g, '')}" class="conv-btn secondary">☎ Call: ${p.phone}</a>
                <a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" class="conv-btn secondary">↗ LinkedIn Profile</a>
              </div>
            </div>
          </div>
        </section>

        <footer class="conv-footer">
          <p>© 2026 Jayaprakash G · Voxel Engineering Portfolio · All Rights Reserved.</p>
        </footer>
      </div>
    `;
  }
}
