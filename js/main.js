/* ============================================================
   LCS3 PORTFOLIO — MAIN JS
   ============================================================ */

// ── TYPED EFFECT ─────────────────────────────────────────────
const phrases = [
  'BSIT Web Developer',
  'Front-End Enthusiast',
  'PHP & JS Builder',
  'Open to Opportunities'
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ci + 1);
    ci++;
    if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = phrase.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
typeLoop();

// ── MOBILE NAV ────────────────────────────────────────────────
const toggle = document.getElementById('navToggle');
const links = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

// ── PROJECT STORAGE HELPERS ───────────────────────────────────
function getProjects() {
  try { return JSON.parse(localStorage.getItem('lcs3_projects') || '[]'); }
  catch { return []; }
}

function tagClass(type) {
  if (type === 'web') return 'tag-web';
  if (type === 'mobile') return 'tag-mobile';
  return 'tag-software';
}

function buildCard(p) {
  const typeLabel = p.type || 'web';
  const iconMap = { web: '⟨/⟩', mobile: '◉', software: '⚙' };
  const icon = iconMap[typeLabel] || '◈';

  const imgHTML = p.image
    ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" loading="lazy" />`
    : `<span>${icon}</span>`;

  let actionsHTML = '';
  if (p.liveUrl) actionsHTML += `<a href="${escHtml(p.liveUrl)}" target="_blank" rel="noopener">🔗 live demo</a>`;
  if (p.repoUrl) actionsHTML += `<a href="${escHtml(p.repoUrl)}" target="_blank" rel="noopener">⌘ source</a>`;
  if (p.downloadUrl) actionsHTML += `<a href="${escHtml(p.downloadUrl)}" target="_blank" rel="noopener" class="download">⬇ download</a>`;

  return `
    <div class="project-card" data-type="${escHtml(typeLabel)}">
      <div class="project-img">${imgHTML}</div>
      <div class="project-body">
        <div class="project-tags">
          <span class="tag ${tagClass(typeLabel)}">${typeLabel}</span>
          ${(p.techs || []).map(t => `<span class="tag tag-web">${escHtml(t)}</span>`).join('')}
        </div>
        <h3 class="project-title">${escHtml(p.title)}</h3>
        <p class="project-desc">${escHtml(p.description || '')}</p>
        <div class="project-actions">${actionsHTML}</div>
      </div>
    </div>
  `;
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectsGrid');
  const noProj = document.getElementById('noProjects');
  const projects = getProjects();
  const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter);

  if (!grid) return;
  // Remove old cards
  grid.querySelectorAll('.project-card').forEach(c => c.remove());

  if (filtered.length === 0) {
    if (noProj) noProj.style.display = 'block';
  } else {
    if (noProj) noProj.style.display = 'none';
    filtered.forEach(p => {
      grid.insertAdjacentHTML('afterbegin', buildCard(p));
    });
  }

  // Update count
  const countEl = document.getElementById('projectCount');
  if (countEl) countEl.textContent = projects.length;
}

renderProjects();

// ── FILTER BUTTONS ────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// ── CONTACT FORM ──────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        btn.textContent = '⚠ failed. try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = '⚠ failed. try again';
      btn.disabled = false;
    }
  });
}

// ── NAV SCROLL STYLE ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.style.boxShadow = scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.5)' : '';
});

// ── ANIMATE ON SCROLL ─────────────────────────────────────────
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
}, { threshold: 0.1 });
document.querySelectorAll('.skill-card, .project-card, .stat-box').forEach(el => {
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.5s ease';
  obs.observe(el);
});
