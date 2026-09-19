/* ============ Particle network background ============ */
(function () {
  const canvas = document.getElementById('tech-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles, mouse = { x: null, y: null };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 140 * dpr;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.35;
          ctx.strokeStyle = `rgba(88,166,255,${alpha})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(63,185,80,0.55)';
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  step();
})();

/* ============ Terminal typing effect ============ */
(function () {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = [
    { prompt: 'whoami', out: 'ruhil_patel — B.S. Computer Science, Rutgers University' },
    { prompt: 'cat status.txt', out: 'currently: IoT Engineer @ Cognizant' },
    { prompt: 'ls interests/', out: 'data-engineering/  cloud-infra/  ai-ml/  cybersecurity/' },
    { prompt: 'stack --primary', out: 'python · java · sql · aws · react · tensorflow' },
  ];

  let li = 0;

  function typeLine(line, cb) {
    const row = document.createElement('div');
    row.className = 'terminal-line';
    const promptSpan = document.createElement('span');
    promptSpan.innerHTML = '<span class="prompt">$</span> ';
    row.appendChild(promptSpan);
    const typed = document.createElement('span');
    row.appendChild(typed);
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    row.appendChild(cursor);
    body.appendChild(row);

    let i = 0;
    const text = line.prompt;
    const iv = setInterval(() => {
      typed.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        cursor.remove();
        const outRow = document.createElement('div');
        outRow.className = 'terminal-line out';
        outRow.textContent = line.out;
        body.appendChild(outRow);
        setTimeout(cb, 900);
      }
    }, 38);
  }

  function loop() {
    body.innerHTML = '';
    li = 0;
    function next() {
      if (li >= lines.length) {
        setTimeout(loop, 2600);
        return;
      }
      typeLine(lines[li], () => { li++; next(); });
    }
    next();
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { loop(); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(body);
})();

/* ============ Scrollspy for single-page nav ============ */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  if (!sections.length || !navLinks.length) return;

  const map = {};
  navLinks.forEach((a) => { map[a.dataset.nav] = a; });

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = map[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach((s) => spy.observe(s));
})();
