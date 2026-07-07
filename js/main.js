(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  doc.classList.add('js');

  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress-bar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const revealItems = [...document.querySelectorAll('.reveal')];
  const cursorGlow = document.querySelector('.cursor-glow');
  const year = document.getElementById('year');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation
  if (navToggle && navLinks) {
    const closeNav = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      body.classList.remove('nav-open');
    };

    navToggle.addEventListener('click', () => {
      const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navLinks.classList.toggle('open', willOpen);
      body.classList.toggle('nav-open', willOpen);
    });

    navLinks.addEventListener('click', event => {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeNav();
    }, { passive: true });
  }

  // Progressive reveal
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Active navigation state
  const observedSections = ['mission', 'research', 'work', 'capabilities', 'projects', 'education', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navAnchors.forEach(link => {
        const isActive = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.18, 0.4, 0.68], rootMargin: '-20% 0px -55% 0px' });

    observedSections.forEach(section => sectionObserver.observe(section));
  }

  // Scroll state and progress
  let scrollProgress = 0;
  let ticking = false;
  const updateScrollUI = () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    if (progressBar) progressBar.style.transform = `scaleX(${scrollProgress})`;
    if (header) header.classList.toggle('scrolled', scrollY > 20);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // Soft cursor glow
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches && cursorGlow) {
    body.classList.add('has-pointer');
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;
    let glowX = pointerX;
    let glowY = pointerY;

    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    }, { passive: true });

    const animateGlow = () => {
      glowX += (pointerX - glowX) * 0.11;
      glowY += (pointerY - glowY) * 0.11;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  // Searchable/filterable project atlas
  const projectCards = [...document.querySelectorAll('.atlas-card')];
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const searchInput = document.getElementById('project-search');
  const atlasStatus = document.getElementById('atlas-status');
  let activeFilter = 'all';

  const updateProjects = () => {
    const term = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const searchable = `${card.dataset.project || ''} ${card.textContent || ''}`.toLowerCase();
      const categoryMatch = activeFilter === 'all' || categories.includes(activeFilter);
      const searchMatch = !term || searchable.includes(term);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (atlasStatus) {
      atlasStatus.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} in view${activeFilter === 'all' && !term ? ' · more work is being documented' : ''}`;
    }
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterButtons.forEach(item => item.classList.toggle('active', item === button));
      updateProjects();
    });
  });
  searchInput?.addEventListener('input', updateProjects);
  updateProjects();

  // Scroll-reactive semiconductor backdrop: crystal lattice + wafer-scan carriers + confined-state trace.
  const canvas = document.getElementById('device-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let lastTime = 0;
  let pointerBias = 0;

  const pseudo = seed => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  const particles = Array.from({ length: 34 }, (_, i) => ({
    x: pseudo(i * 2.17 + 1),
    y: pseudo(i * 4.31 + 3),
    r: 0.8 + pseudo(i * 8.23 + 5) * 1.8,
    vx: (pseudo(i * 3.91 + 7) - 0.5) * 0.000022,
    vy: (pseudo(i * 6.77 + 9) - 0.5) * 0.000018,
    a: 0.06 + pseudo(i * 9.13 + 11) * 0.16
  }));

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawParticles(dt) {
    const maxDistance = Math.min(150, width * 0.12);
    for (const p of particles) {
      p.x = (p.x + p.vx * dt + 1) % 1;
      p.y = (p.y + p.vy * dt + 1) % 1;
    }

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      const ax = a.x * width;
      const ay = a.y * height;
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const bx = b.x * width;
        const by = b.y * height;
        const dist = Math.hypot(ax - bx, ay - by);
        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.035;
          ctx.strokeStyle = `rgba(109, 93, 252, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.fillStyle = `rgba(255, 118, 72, ${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawLattice(time) {
    const mobile = width < 760;
    const spacingX = mobile ? 44 : 54;
    const spacingY = spacingX * 0.86;
    const cols = mobile ? 6 : 9;
    const rows = Math.ceil(height / spacingY) + 4;
    const baseX = width * (mobile ? 0.72 : 0.75 - scrollProgress * 0.14) + pointerBias * 10;
    const phase = reducedMotion ? 0 : time * 0.00022;
    const scrollPhase = scrollProgress * Math.PI * 5;

    ctx.save();
    ctx.translate(baseX, -spacingY * 1.2);
    ctx.rotate((mobile ? -0.08 : -0.14) + scrollProgress * 0.12);

    for (let row = 0; row < rows; row++) {
      const y = row * spacingY;
      const offset = row % 2 ? spacingX * 0.5 : 0;
      for (let col = -cols; col <= cols; col++) {
        const x = col * spacingX + offset;
        const layerMix = (Math.sin((row / rows) * Math.PI * 3 + scrollPhase) + 1) / 2;
        const wobbleX = Math.sin(phase + row * 0.18 + col * 0.4) * 1.8;
        const wobbleY = Math.cos(phase * 0.8 + row * 0.22 - col * 0.3) * 1.4;
        const nx = x + wobbleX;
        const ny = y + wobbleY;

        // Horizontal / diagonal bonds
        ctx.strokeStyle = `rgba(109, 93, 252, ${0.025 + layerMix * 0.04})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx + spacingX, ny);
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx + spacingX * 0.5, ny + spacingY);
        ctx.stroke();

        const isAlt = (row + col) % 3 === 0;
        ctx.fillStyle = isAlt
          ? `rgba(255, 118, 72, ${0.08 + layerMix * 0.11})`
          : `rgba(37, 183, 211, ${0.07 + (1 - layerMix) * 0.10})`;
        ctx.beginPath();
        ctx.arc(nx, ny, isAlt ? 2.2 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawInterface(time) {
    const y = height * (0.46 + scrollProgress * 0.08);
    const startX = width * 0.48;
    const endX = width * 1.05;

    const gradient = ctx.createLinearGradient(startX, y, endX, y);
    gradient.addColorStop(0, 'rgba(212,238,84,0)');
    gradient.addColorStop(0.35, 'rgba(212,238,84,0.15)');
    gradient.addColorStop(1, 'rgba(37,183,211,0.02)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();

    const count = width < 760 ? 6 : 10;
    for (let i = 0; i < count; i++) {
      const t = ((i / count) + (reducedMotion ? 0 : time * 0.000035)) % 1;
      const x = startX + (endX - startX) * t;
      const wave = Math.sin(t * Math.PI * 6 + scrollProgress * Math.PI * 6) * 7;
      ctx.fillStyle = `rgba(212, 238, 84, ${0.10 + 0.22 * Math.sin(Math.PI * t)})`;
      ctx.beginPath();
      ctx.arc(x, y + wave, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wavefunction-like envelope
    ctx.strokeStyle = 'rgba(109,93,252,0.12)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    const points = 120;
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      const x = startX + (endX - startX) * t;
      const envelope = Math.sin(Math.PI * t);
      const yy = y - 34 + Math.sin(t * Math.PI * 8 + scrollProgress * 8) * 17 * envelope;
      if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  function render(time) {
    const dt = Math.min(40, time - lastTime || 16);
    lastTime = time;
    ctx.clearRect(0, 0, width, height);
    drawParticles(dt);
    drawLattice(time);
    drawInterface(time);
    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      pointerBias = (event.clientX / Math.max(1, width) - 0.5) * 2;
    }, { passive: true });
  }

  resizeCanvas();
  requestAnimationFrame(render);
})();
