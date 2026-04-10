/**
 * Fak'ugesi Shared Nav v9
 * - 4-pointed star indicator (diamond/cross shape) floats above active tab, top-right corner
 * - Float + triple-bounce on click
 * - GET TICKETS: 3D lightning effect INSIDE button on hover (no external sparks)
 * - Plus spinner + baby pluses on left icon
 * - Dropdowns preserved
 */
(function() {
  const path = window.location.pathname;
  const page = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';

  function isActive(href) {
    const h = href.replace(/^\//, '').replace(/\.html$/, '');
    if (h === 'index' && (page === '' || page === 'index')) return true;
    if (h !== 'index' && page === h) return true;
    return false;
  }

  const sigPages = ['immersiveAfrica','awards','sig-awards','sig-immersive','sig-fakugesipro','sig-jamz','sig-pitchathon','sig-dalakhona'];

  // 4-pointed star SVG (clean diamond/cross shape, 4 points only)
  const STAR_SVG = `<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" fill="rgba(255,255,255,0.95)"/>
  </svg>`;

  const navCSS = `
    #fug-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: grid; grid-template-columns: auto 1fr auto;
      align-items: center; padding: 0 32px; height: 58px;
      background: transparent; border-bottom: 1px solid transparent;
      font-family: 'InterDisplay', sans-serif;
      transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
      overflow: visible;
    }
    #fug-nav.scrolled {
      background: rgba(26, 55, 120, 0.18);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255,255,255,0.10);
      box-shadow: 0 2px 32px rgba(0,0,0,0.12);
    }
    #fug-nav .nav-left { display:flex; align-items:center; }
    #fug-nav .nav-plus-sym {
      color: rgba(255,255,255,0.85); font-size: 24px; font-weight: 300; line-height:1;
      cursor: pointer; display:inline-block; user-select:none; margin-right: 4px;
      transition: color 0.2s;
    }
    #fug-nav .nav-plus-sym:hover { color: #e05a1e; }
    @keyframes nav-plusSpin {
      0%   { transform:rotate(0deg) scale(1); }
      45%  { transform:rotate(210deg) scale(1.5); }
      100% { transform:rotate(360deg) scale(1); }
    }
    .plus-spinning { animation: nav-plusSpin 0.55s cubic-bezier(.4,0,.2,1) forwards !important; }

    /* 4-pointed star indicator */
    #fug-nav-indicator {
      position: absolute;
      top: 5px;
      pointer-events: none;
      z-index: 20;
      transition: left 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-origin: center center;
    }
    #fug-nav-indicator svg { display: block; }

    @keyframes navStarFloat {
      0%   { transform: translateY(0px) rotate(0deg) scale(1); }
      25%  { transform: translateY(-5px) rotate(45deg) scale(1.2); }
      50%  { transform: translateY(0px) rotate(90deg) scale(1); }
      75%  { transform: translateY(-3px) rotate(135deg) scale(1.1); }
      100% { transform: translateY(0px) rotate(180deg) scale(1); }
    }
    @keyframes navStarBounce {
      0%   { transform: translateY(0) rotate(0deg) scale(1); }
      15%  { transform: translateY(-10px) rotate(90deg) scale(1.7); }
      30%  { transform: translateY(0) rotate(180deg) scale(1); }
      45%  { transform: translateY(-7px) rotate(270deg) scale(1.4); }
      60%  { transform: translateY(0) rotate(360deg) scale(1); }
      75%  { transform: translateY(-4px) rotate(405deg) scale(1.2); }
      100% { transform: translateY(0) rotate(450deg) scale(1); }
    }
    #fug-nav-indicator.floating {
      animation: navStarFloat 2.4s ease-in-out infinite;
    }
    #fug-nav-indicator.jumping {
      animation: navStarBounce 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
    }

    #fug-nav .nav-centre { display:flex; align-items:center; justify-content:center; position:relative; }
    #fug-nav .nav-links { display:flex; gap:26px; list-style:none; margin:0; padding:0; }
    #fug-nav .nav-links > li { position:relative; }
    #fug-nav .nav-links a, #fug-nav .nav-links .nav-drop-trigger {
      color:rgba(255,255,255,0.82); text-decoration:none;
      font-size:13px; font-weight:500; letter-spacing:0.01em;
      transition:color 0.2s; cursor:pointer;
      display:flex; align-items:center; gap:4px;
      background:none; border:none; padding:0; font-family:inherit;
      line-height:58px; white-space:nowrap;
    }
    #fug-nav .nav-links a:hover,
    #fug-nav .nav-links .nav-drop-trigger:hover,
    #fug-nav .nav-links a.active,
    #fug-nav .nav-links .nav-drop-trigger.active { color:#ffffff; }
    #fug-nav .nav-drop-trigger .chevron {
      display:inline-block; width:7px; height:7px;
      border-right:1.5px solid currentColor; border-bottom:1.5px solid currentColor;
      transform:rotate(45deg) translateY(-1px); transition:transform 0.2s;
    }
    #fug-nav .nav-links li.open .nav-drop-trigger .chevron { transform:rotate(-135deg) translateY(-1px); }
    #fug-nav .nav-dropdown {
      position:absolute; top:100%; left:50%;
      transform:translateX(-50%) translateY(-6px);
      background:rgba(255,255,255,0.96); border:1px solid rgba(0,0,0,0.09);
      box-shadow:0 8px 32px rgba(0,0,0,0.12);
      min-width:190px; padding:8px 0;
      opacity:0; pointer-events:none;
      transition:opacity 0.18s, transform 0.18s; z-index:200;
      backdrop-filter: blur(12px);
    }
    #fug-nav .nav-links li.open .nav-dropdown {
      opacity:1; pointer-events:auto; transform:translateX(-50%) translateY(0);
    }
    #fug-nav .nav-dropdown a {
      display:block; padding:10px 20px; font-size:13px; color:rgba(13,27,62,0.75);
      text-decoration:none; font-weight:500; transition:color 0.15s, background 0.15s;
      line-height:1.4; white-space:nowrap;
    }
    #fug-nav .nav-dropdown a:hover { color:#0d1b3e; background:rgba(0,0,0,0.04); }
    #fug-nav .nav-dropdown a.active { color:#0d1b3e; font-weight:600; }
    #fug-nav .nav-right { display:flex; align-items:center; gap:12px; justify-content:flex-end; }

    /* GET TICKETS — 3D lightning INSIDE on hover */
    #fug-nav .nav-tickets-btn {
      background: rgba(26, 55, 120, 0.85); color: #ffffff;
      border: 1.5px solid rgba(255,255,255,0.35);
      cursor: pointer; padding: 9px 20px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; font-family: 'InterDisplay', sans-serif;
      transition: background 0.22s, color 0.22s, border-color 0.22s, transform 0.15s;
      white-space: nowrap; text-decoration: none;
      display: inline-flex; align-items: center; gap: 5px;
      border-radius: 100px;
      position: relative;
      overflow: hidden;
    }
    #fug-nav .nav-tickets-btn:hover {
      background: #0d1b3e;
      border-color: rgba(255,220,60,0.8);
      transform: translateY(-1px);
    }
    #fug-nav .nav-tickets-btn .btn-lightning-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      border-radius: 100px;
      overflow: hidden;
    }
    #fug-nav .nav-tickets-btn .btn-label {
      position: relative;
      z-index: 1;
    }

    .fug-baby-plus {
      position:fixed; pointer-events:none; z-index:99999;
      font-weight:700; line-height:1; transform:translate(-50%,-50%);
      transition:transform 0.52s ease-out, opacity 0.52s ease-out;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = navCSS;
  document.head.appendChild(styleEl);

  const currentIsActive = sigPages.includes(page);

  const navHTML = `
  <nav id="fug-nav">
    <div class="nav-left">
      <span class="nav-plus-sym" id="nav-plus-main">+</span>
    </div>
    <div class="nav-centre">
      <div id="fug-nav-indicator">${STAR_SVG}</div>
      <ul class="nav-links" id="fug-nav-links">
        <li><a href="/index.html" ${isActive('index') ? 'class="active"' : ''}>Home</a></li>
        <li><a href="/programme.html" ${isActive('programme') ? 'class="active"' : ''}>Festival Programme</a></li>
        <li class="drop-li">
          <button class="nav-drop-trigger ${currentIsActive ? 'active' : ''}">Signature Programmes <span class="chevron"></span></button>
          <div class="nav-dropdown">
            <a href="/sig-awards.html"      ${isActive('sig-awards')      ? 'class="active"' : ''}>Awards</a>
            <a href="/sig-immersive.html"   ${isActive('sig-immersive')   ? 'class="active"' : ''}>Immersive Africa</a>
            <a href="/sig-fakugesipro.html" ${isActive('sig-fakugesipro') ? 'class="active"' : ''}>Fak'ugesiPRO</a>
            <a href="/sig-jamz.html"        ${isActive('sig-jamz')        ? 'class="active"' : ''}>Jamz</a>
            <a href="/sig-pitchathon.html"  ${isActive('sig-pitchathon')  ? 'class="active"' : ''}>Pitchathon</a>
            <a href="/sig-dalakhona.html"   ${isActive('sig-dalakhona')   ? 'class="active"' : ''}>Dala Khona</a>
          </div>
        </li>
        <li class="drop-li">
          <button class="nav-drop-trigger ${page === 'about' ? 'active' : ''}">Discover <span class="chevron"></span></button>
          <div class="nav-dropdown">
            <a href="/about.html" ${isActive('about') ? 'class="active"' : ''}>About Us</a>
          </div>
        </li>
      </ul>
    </div>
    <div class="nav-right">
      <a class="nav-tickets-btn" id="nav-tickets-btn" href="/tickets.html">
        <canvas class="btn-lightning-canvas" id="nav-lightning-canvas"></canvas>
        <span class="btn-label"> GET TICKETS</span>
      </a>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  const nav       = document.getElementById('fug-nav');
  const indicator = document.getElementById('fug-nav-indicator');
  const navLinks  = document.getElementById('fug-nav-links');

  function positionIndicator(el) {
    const navRect = nav.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    const rightEdgeX = elRect.right - navRect.left - 7;
    indicator.style.left = rightEdgeX + 'px';
  }

  function startFloat() {
    indicator.classList.remove('jumping');
    indicator.classList.add('floating');
  }
  function pauseFloat() {
    indicator.classList.remove('floating', 'jumping');
  }
  function jumpIndicator() {
    indicator.classList.remove('floating', 'jumping');
    void indicator.offsetWidth;
    indicator.classList.add('jumping');
    indicator.addEventListener('animationend', () => {
      indicator.classList.remove('jumping');
      startFloat();
    }, { once: true });
  }

  function initIndicator() {
    const activeEl = navLinks.querySelector('a.active, .nav-drop-trigger.active');
    const targetEl = activeEl || navLinks.querySelector('a');
    if (targetEl) { positionIndicator(targetEl); startFloat(); }
  }

  navLinks.querySelectorAll('li').forEach(li => {
    const trigger = li.querySelector('a, .nav-drop-trigger');
    if (!trigger) return;
    li.addEventListener('mouseenter', () => { pauseFloat(); positionIndicator(trigger); });
    li.addEventListener('mouseleave', () => {
      const activeEl = navLinks.querySelector('a.active, .nav-drop-trigger.active');
      const fallback = activeEl || navLinks.querySelector('a');
      if (fallback) { positionIndicator(fallback); startFloat(); }
    });
    li.addEventListener('click', () => {
      if (trigger.tagName === 'A' && trigger.getAttribute('href')) {
        navLinks.querySelectorAll('a, .nav-drop-trigger').forEach(x => x.classList.remove('active'));
        trigger.classList.add('active');
        positionIndicator(trigger);
        jumpIndicator();
      }
    });
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 40);

  document.querySelectorAll('#fug-nav .drop-li').forEach(li => {
    li.querySelector('.nav-drop-trigger').addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = li.classList.contains('open');
      document.querySelectorAll('#fug-nav .drop-li.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) li.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('#fug-nav .drop-li.open').forEach(o => o.classList.remove('open'));
  });

  // Plus: spin + shoot baby pluses
  const plusEl = document.getElementById('nav-plus-main');
  if (plusEl) {
    plusEl.addEventListener('mouseenter', () => {
      plusEl.classList.remove('plus-spinning');
      void plusEl.offsetWidth;
      plusEl.classList.add('plus-spinning');
      shootBabyPluses(plusEl);
    });
    plusEl.addEventListener('animationend', () => plusEl.classList.remove('plus-spinning'));
  }

  function shootBabyPluses(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const colours = ['#e05a1e','#1a2744','#4a6fa5','#ff8c42','#2a3f72'];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
      const dist = 32 + Math.random() * 30, size = 11 + Math.random() * 9;
      const baby = document.createElement('span');
      baby.className = 'fug-baby-plus';
      baby.textContent = '+';
      baby.style.cssText = `left:${cx}px;top:${cy}px;font-size:${size}px;color:${colours[i%colours.length]};`;
      document.body.appendChild(baby);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        baby.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) rotate(${Math.random()*360}deg) scale(0.3)`;
        baby.style.opacity = '0';
      }));
      setTimeout(() => baby.remove(), 600);
    }
  }

  // ── 3D LIGHTNING inside GET TICKETS button ──
  (function() {
    const btn = document.getElementById('nav-tickets-btn');
    const canvas = document.getElementById('nav-lightning-canvas');
    if (!btn || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame = null;
    let hovering = false;
    let bolts = [];
    let frameCount = 0;

    function resizeCanvas() {
      canvas.width = btn.offsetWidth;
      canvas.height = btn.offsetHeight;
    }

    // Generate a jagged lightning bolt path (recursive midpoint displacement)
    function buildSegments(x1, y1, x2, y2, roughness, depth) {
      if (depth <= 0) return [[x1, y1], [x2, y2]];
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 0.5;
      return [
        ...buildSegments(x1, y1, mx, my, roughness * 0.55, depth - 1),
        ...buildSegments(mx, my, x2, y2, roughness * 0.55, depth - 1).slice(1)
      ];
    }

    function spawnBolt() {
      const W = canvas.width, H = canvas.height;
      // Start top, end bottom — travels through the button interior
      const sx = W * (0.2 + Math.random() * 0.6);
      const ex = W * (0.2 + Math.random() * 0.6);
      const pts = buildSegments(sx, 0, ex, H, W * 0.25, 4);
      return {
        pts,
        life: 1.0,
        decay: 0.06 + Math.random() * 0.08,
        width: 1.2 + Math.random() * 1.4,
        // 3D effect: core white, mid electric blue, outer glow
        coreColor: 'rgba(255,255,255,',
        midColor: 'rgba(140,200,255,',
        glowColor: 'rgba(80,120,255,',
      };
    }

    function drawBolt(b) {
      if (b.pts.length < 2) return;
      const alpha = Math.max(0, b.life);

      // Outer glow (3D depth illusion)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(b.pts[0][0], b.pts[0][1]);
      for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i][0], b.pts[i][1]);
      ctx.strokeStyle = b.glowColor + (alpha * 0.3) + ')';
      ctx.lineWidth = b.width * 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(80,140,255,0.8)';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Mid electric layer
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(b.pts[0][0], b.pts[0][1]);
      for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i][0], b.pts[i][1]);
      ctx.strokeStyle = b.midColor + (alpha * 0.75) + ')';
      ctx.lineWidth = b.width * 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(160,210,255,0.9)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      // Core bright white
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(b.pts[0][0], b.pts[0][1]);
      for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i][0], b.pts[i][1]);
      ctx.strokeStyle = b.coreColor + alpha + ')';
      ctx.lineWidth = b.width * 0.7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    }

    function tick() {
      if (!hovering) return;
      resizeCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;
      // Spawn new bolt every ~8 frames
      if (frameCount % 8 === 0) {
        bolts.push(spawnBolt());
        // occasionally spawn a branch
        if (Math.random() > 0.5) bolts.push(spawnBolt());
      }

      bolts = bolts.filter(b => b.life > 0);
      bolts.forEach(b => {
        drawBolt(b);
        b.life -= b.decay;
      });

      animFrame = requestAnimationFrame(tick);
    }

    btn.addEventListener('mouseenter', () => {
      hovering = true;
      resizeCanvas();
      bolts = [];
      frameCount = 0;
      if (!animFrame) animFrame = requestAnimationFrame(tick);
    });

    btn.addEventListener('mouseleave', () => {
      hovering = false;
      if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  })();

  requestAnimationFrame(() => requestAnimationFrame(initIndicator));
  window.addEventListener('resize', () => {
    const activeEl = navLinks.querySelector('a.active, .nav-drop-trigger.active');
    const targetEl = activeEl || navLinks.querySelector('a');
    if (targetEl) positionIndicator(targetEl);
  });
})();