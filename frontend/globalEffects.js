/**
 * Fak'ugesi Global Effects v5
 * - Arrow moves right, crashes into stacked triple lightning bolt, explosion, new arrow enters from left — loops on hover
 * - Clear/white water ripples (no color) — NOT on index.html hero
 * - Star markers on crosshairs
 * - Zipper effect improvements handled in awards.html
 */
(function () {
  'use strict';

  const CSS = `
    /* ── STAR MARKERS ── */
    .star-marker {
      display:inline-flex;align-items:center;justify-content:center;
      position:relative;cursor:default;line-height:1;
    }
    .star-marker svg{display:block;overflow:visible;}
    .star-marker:hover svg{animation:starSpin .65s cubic-bezier(.4,0,.2,1) forwards;}
    @keyframes starSpin{
      0%{transform:rotate(0deg) scale(1);}
      50%{transform:rotate(180deg) scale(1.5);}
      100%{transform:rotate(360deg) scale(1);}
    }

    /* ── ARROW BUTTON ── */
    .arrow-btn {
      display:inline-flex!important;align-items:center;justify-content:center;
      position:relative;overflow:hidden!important;
      cursor:pointer;text-decoration:none;
      transition:border-color .2s,background .2s;
    }
    .arrow-btn canvas.fug-canvas{
      position:absolute;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:1;
    }
    .arrow-btn .arr-icon{
      position:relative;z-index:2;
      fill:none;stroke-width:2;
      stroke-linecap:round;stroke-linejoin:round;
      opacity:0;/* hidden — canvas draws it */
    }

    /* ── RIPPLE CANVAS ── */
    #global-ripple-canvas{
      position:fixed;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:99990;
    }

    /* ── ZIPPER — faster ── */
    .zip-curtain-left, .zip-curtain-right {
      transition: transform 0.45s cubic-bezier(0.4,0,0.2,1) !important;
    }
    .winners-revealed {
      transition: opacity 0.3s ease 0.42s !important;
    }

    /* ── SECTION DIVIDER ── */
    .section-divider-line{
      display:flex;align-items:center;gap:14px;
      padding:18px 40px;position:relative;z-index:2;
    }
    .section-divider-rule{
      flex:1;height:1px;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);
    }
    .light-section .section-divider-rule{
      background:linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent);
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ─────────────────────────────────────────────
     STAR HELPERS
  ───────────────────────────────────────────── */
  function makeStar(color) {
    return `<svg viewBox="0 0 20 20" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1 L11.8 7.5 L18.5 9 L11.8 12 L10 19 L8.2 12 L1.5 9 L8.2 7.5 Z" fill="${color||'currentColor'}"/>
    </svg>`;
  }

  function shootBabyStars(hostEl, color) {
    const rect = hostEl.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    for (let i=0;i<7;i++) {
      const angle = (i/7)*2*Math.PI;
      const dist = 28+Math.random()*20;
      const size = 4+Math.random()*4;
      const baby = document.createElement('div');
      baby.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform .55s ease-out,opacity .55s ease-out;`;
      baby.innerHTML = `<svg viewBox="0 0 10 10" width="${size}" height="${size}"><path d="M5 1 L5.7 3.8 L8.5 5 L5.7 6.3 L5 9 L4.3 6.3 L1.5 5 L4.3 3.8 Z" fill="${color||'#d4e600'}"/></svg>`;
      document.body.appendChild(baby);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const dx=Math.cos(angle)*dist, dy=Math.sin(angle)*dist;
        baby.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
        baby.style.opacity='0';
      }));
      setTimeout(()=>baby.remove(),620);
    }
  }

  function upgradePlus(el) {
    if(el.dataset.starDone) return;
    el.dataset.starDone='1';
    const dark=el.closest('.theme-section,nav,.get-involved,footer,.hero,.page-hero,.ia-hero,.faq-section,.winners-section,.categories-section,.tickets-section,.premiere,.ongoing,.installations-section,.happening-section');
    const color=dark?'rgba(255,255,255,0.35)':'rgba(0,0,0,0.25)';
    const accent=dark?'#d4e600':'#1a2332';
    el.classList.add('star-marker');
    el.innerHTML=makeStar(color);
    el.addEventListener('mouseenter',()=>shootBabyStars(el,accent));
  }

  function convertPluses() {
    document.querySelectorAll('.crosshair,.nav-plus,.section-crosshairs span,.footer-crosshairs span,.team-crosshairs span,.partners-crosshairs span,.footer-bottom-crosshairs span,.passes-crosshairs span,.passes-crosshairs-bot span').forEach(el=>{
      if(el.textContent.trim()==='+' || el.dataset.starDone) {
        if(!el.dataset.starDone) upgradePlus(el);
      }
    });
  }

  /* ─────────────────────────────────────────────
     LIGHTNING BOLT SVG PATH (matches reference image)
     Chunky 3-point bolt, tilted
  ───────────────────────────────────────────── */
  function drawBoltShape(ctx, cx, cy, w, h, color, alpha, glowSize) {
    // The bolt from the image: top-right, notch left, notch right, bottom-left point
    const s = Math.min(w, h);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(cx, cy);

    // Glow
    if(glowSize > 0) {
      ctx.shadowColor = '#ffee00';
      ctx.shadowBlur = glowSize;
    }

    ctx.beginPath();
    // Scaled bolt path matching the reference image shape
    // Top right corner → notch left → right ear → middle notch → right → bottom point
    const W = s * 0.55, H = s * 1.0;
    ctx.moveTo(W*0.15,  -H*0.5);       // top right
    ctx.lineTo(-W*0.6,   H*0.02);      // notch left top
    ctx.lineTo(-W*0.1,   H*0.02);      // notch inner
    ctx.lineTo(-W*0.7,   H*0.5);       // bottom left
    ctx.lineTo(W*0.6,   -H*0.05);      // notch right bottom  
    ctx.lineTo(W*0.05,  -H*0.05);      // inner right
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /* Draw three stacked bolts (the "stack" that the arrow crashes into) */
  function drawBoltStack(ctx, cx, cy, btnW, btnH, alpha) {
    const boltH = btnH * 0.55;
    const offsets = [-6, 0, 6];
    const colors = ['rgba(255,238,0,0.3)', '#ffffff', 'rgba(255,238,0,0.5)'];
    offsets.forEach((ox, i) => {
      drawBoltShape(ctx, cx + ox, cy, btnW * 0.25, boltH, colors[i], alpha * (i===1?1:0.6), i===1?12:0);
    });
  }

  /* Draw arrow pointing right at position x */
  function drawArrow(ctx, x, cy, alpha, color) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, cy);
    ctx.lineTo(x + 6, cy);
    ctx.moveTo(x, cy - 6);
    ctx.lineTo(x + 7, cy);
    ctx.lineTo(x, cy + 6);
    ctx.stroke();
    ctx.restore();
  }

  /* ─────────────────────────────────────────────
     ARROW BUTTON — canvas-based crash animation
     Arrow moves right → crashes into triple bolt stack →
     explosion → new arrow enters from left → loops
  ───────────────────────────────────────────── */
  function initArrowBtn(btn) {
    if(btn.dataset.arrowDone) return;
    btn.dataset.arrowDone='1';

    const isDark = btn.classList.contains('dark');
    const arrowColor = isDark ? '#111111' : '#ffffff';
    const accentYellow = '#d4e600';

    const canvas = document.createElement('canvas');
    canvas.className = 'fug-canvas';
    btn.insertBefore(canvas, btn.firstChild);

    // Hide original SVG icon
    const origIcon = btn.querySelector('.arr-icon');
    if(origIcon) origIcon.style.opacity = '0';

    let W, H;
    function resizeCanvas() {
      W = canvas.width = btn.offsetWidth || 140;
      H = canvas.height = btn.offsetHeight || 52;
    }
    resizeCanvas();

    const ctx = canvas.getContext('2d');
    const BOLT_X_RATIO = 0.72; // bolt stack position (right side)
    const ARROW_START_X = 0.25; // arrow starts here (ratio of W)

    let raf = null;
    let hovering = false;
    let phase = 'idle'; // idle | travel | crash | explode | enter
    let arrowX = 0;
    let newArrowX = 0;
    let crashTimer = 0;
    let particles = [];
    let flashAlpha = 0;
    let boltVisible = true;
    let boltShakeX = 0;

    function spawnExplosion(x, y) {
      for(let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 1.5 + Math.random() * 3.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1.5 + Math.random() * 3,
          color: Math.random() < 0.5 ? '#ffee00' : Math.random() < 0.5 ? '#ffffff' : accentYellow
        });
      }
      flashAlpha = 0.8;
      boltVisible = false;
      setTimeout(() => { boltVisible = true; }, 200);
    }

    function updateParticles() {
      particles = particles.filter(p => p.life > 0.02);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.life -= 0.06;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    function drawFrame() {
      resizeCanvas();
      ctx.clearRect(0, 0, W, H);
      const cy = H / 2;
      const boltX = W * BOLT_X_RATIO + boltShakeX;

      // Flash overlay
      if(flashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = flashAlpha * 0.4;
        ctx.fillStyle = '#ffee00';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
        flashAlpha = Math.max(0, flashAlpha - 0.1);
      }

      updateParticles();

      // Draw bolt stack (always visible unless just crashed)
      if(boltVisible) {
        drawBoltStack(ctx, boltX, cy, W, H, phase === 'idle' ? 0.5 : 0.85);
      }

      if(phase === 'idle') {
        // Static arrow at start position, bolt visible dimly
        drawArrow(ctx, W * ARROW_START_X, cy, 0.9, arrowColor);

      } else if(phase === 'travel') {
        // Arrow moves right
        arrowX += W * 0.045; // speed
        drawArrow(ctx, arrowX, cy, 1, arrowColor);

        if(arrowX >= boltX - 6) {
          // CRASH
          spawnExplosion(boltX, cy);
          phase = 'explode';
          crashTimer = 0;
        }

      } else if(phase === 'explode') {
        crashTimer++;
        boltShakeX = (Math.random() - 0.5) * 5;
        if(crashTimer > 8) {
          boltShakeX = 0;
          // Start new arrow entering from left
          newArrowX = -W * 0.1;
          phase = 'enter';
        }

      } else if(phase === 'enter') {
        newArrowX += W * 0.045;
        drawArrow(ctx, newArrowX, cy, Math.min(1, newArrowX / (W * 0.15)), arrowColor);

        if(newArrowX >= W * ARROW_START_X) {
          arrowX = W * ARROW_START_X;
          // If still hovering, loop again
          if(hovering) {
            phase = 'travel';
          } else {
            phase = 'idle';
          }
        }
      }

      if(phase !== 'idle' || particles.length > 0 || flashAlpha > 0) {
        raf = requestAnimationFrame(drawFrame);
      } else {
        raf = null;
        // Draw idle state once
        ctx.clearRect(0, 0, W, H);
        const bx = W * BOLT_X_RATIO;
        drawBoltStack(ctx, bx, H/2, W, H, 0.5);
        drawArrow(ctx, W * ARROW_START_X, H/2, 0.9, arrowColor);
      }
    }

    function startIdle() {
      ctx.clearRect(0, 0, W, H);
      drawBoltStack(ctx, W * BOLT_X_RATIO, H/2, W, H, 0.5);
      drawArrow(ctx, W * ARROW_START_X, H/2, 0.9, arrowColor);
    }

    btn.addEventListener('mouseenter', () => {
      hovering = true;
      if(phase === 'idle') {
        arrowX = W * ARROW_START_X;
        phase = 'travel';
        particles = [];
        flashAlpha = 0;
        boltShakeX = 0;
        boltVisible = true;
        if(!raf) raf = requestAnimationFrame(drawFrame);
      }
    });

    btn.addEventListener('mouseleave', () => {
      hovering = false;
      // Let current animation finish, then return to idle
    });

    startIdle();
  }

  function initAllArrows() {
    document.querySelectorAll('.arrow-btn').forEach(initArrowBtn);
  }

  /* ─────────────────────────────────────────────
     CLEAR WATER RIPPLES — white/transparent only
     NOT applied to index.html hero section
  ───────────────────────────────────────────── */
  function initRipples() {
    const isIndex = document.body.dataset.page === 'index' ||
                    window.location.pathname === '/' ||
                    window.location.pathname.endsWith('index.html');

    const canvas = document.createElement('canvas');
    canvas.id = 'global-ripple-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const drops = [];

    function addDrop(x, y, big = false) {
      const count = big ? 4 : 2;
      for(let i = 0; i < count; i++) {
        drops.push({
          x: x + (Math.random() - 0.5) * (big ? 20 : 8),
          y: y + (Math.random() - 0.5) * (big ? 8 : 3),
          r: 0,
          a: big ? 0.7 : 0.5,
          speed: big ? 1.8 + Math.random() * 1.5 : 1.2 + Math.random() * 1,
          delay: i * 60,
          born: Date.now()
        });
      }
    }

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      const now = Date.now();
      for(let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const age = now - d.born - d.delay;
        if(age < 0) continue;
        d.r += d.speed * 1.6;
        d.a -= 0.022;
        if(d.a <= 0) { drops.splice(i, 1); continue; }

        // Outer ring
        ctx.save();
        ctx.globalAlpha = d.a * 0.6;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 1.8, d.r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Inner ring
        ctx.save();
        ctx.globalAlpha = d.a * 0.35;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 0.9, d.r * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    })();

    function attachRipple(el) {
      // Skip if this element is inside the hero of index.html
      if(isIndex && el.closest('.hero')) return;
      if(el.dataset.ripple) return;
      el.dataset.ripple = '1';

      el.addEventListener('mouseenter', () => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        addDrop(cx, cy, true);
        for(let i = 0; i < 3; i++) {
          setTimeout(() => {
            addDrop(rect.left + (rect.width * (i + 1) / 4), cy + (Math.random() - 0.5) * rect.height * 0.4);
          }, i * 50 + 20);
        }
      });
    }

    function scanRippleTargets() {
      document.querySelectorAll('h1,h2,h3,.cat-name,.ticket-title,.spotlight-heading,.team-name,.edition-name,nav .nav-links a,.winner-card,.flip-card').forEach(el => {
        if(isIndex && el.closest('.hero')) return;
        attachRipple(el);
      });
    }
    scanRippleTargets();
    setInterval(scanRippleTargets, 2000);
  }

  /* ─────────────────────────────────────────────
     SECTION DIVIDERS
  ───────────────────────────────────────────── */
  function addDividers() {
    const lightSecs = new Set(['spotlight-section','happening-section','who-section','editions-section','team-section','contact-section','partners-section']);
    document.querySelectorAll('.spotlight-section,.happening-section,.partners-section,.faq-section,.venue-section,.categories-section,.winners-section,.submit-section,.ia-intro,.installations-section,.who-section,.editions-section,.team-section,.contact-section,.requirements-section').forEach(sec => {
      if(sec.dataset.divider) return; sec.dataset.divider='1';
      const light = [...sec.classList].some(c => lightSecs.has(c));
      sec.classList.toggle('light-section', light);
      const col = light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
      const div = document.createElement('div');
      div.className = 'section-divider-line';
      div.innerHTML = `<span class="star-marker">${makeStar(col)}</span><div class="section-divider-rule"></div><span class="star-marker">${makeStar(col)}</span><div class="section-divider-rule"></div><span class="star-marker">${makeStar(col)}</span>`;
      sec.insertBefore(div, sec.firstChild);
    });
  }

  /* ─────────────────────────────────────────────
     IMAGE ERROR INFINITE LOOP FIX
     Prevents images with broken onerror handlers
     from retrying thousands of times
  ───────────────────────────────────────────── */
  function fixImageErrors() {
    function patchImg(img) {
      if(img.dataset.errPatched) return;
      img.dataset.errPatched = '1';
      img.addEventListener('error', function onErr() {
        if(img.dataset.errFired) {
          // Already errored once — stop everything
          img.removeEventListener('error', onErr);
          img.removeAttribute('onerror');
          img.src = '';
          img.style.background = '#1a2332';
          return;
        }
        img.dataset.errFired = '1';
        // Remove inline onerror to prevent it re-firing
        const inlineErr = img.getAttribute('onerror');
        if(inlineErr) {
          img.removeAttribute('onerror');
          // Run inline handler once safely
          try { (new Function(inlineErr)).call(img); } catch(e) {}
        }
      });
    }

    // Patch all current images
    document.querySelectorAll('img').forEach(patchImg);

    // Patch future images
    const obs = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if(n.tagName === 'IMG') patchImg(n);
        if(n.querySelectorAll) n.querySelectorAll('img').forEach(patchImg);
      }));
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  /* ─────────────────────────────────────────────
     FASTER ZIPPER (awards page)
  ───────────────────────────────────────────── */
  function patchZipper() {
    const zipLeft = document.getElementById('zipLeft');
    const zipRight = document.getElementById('zipRight');
    if(!zipLeft || !zipRight) return;

    // Override the transition to be faster
    zipLeft.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
    zipRight.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';

    // Also patch the openZipper timing
    const origOpen = window.openZipper;
    if(typeof origOpen === 'function') {
      window.openZipper = function() {
        if(window._zipOpen) return;
        if(typeof window.renderWinners === 'function') window.renderWinners();
        zipLeft.classList.add('open');
        zipRight.classList.add('open');
        const pull = document.getElementById('zipPull');
        if(pull) pull.style.display = 'none';
        window._zipOpen = true;
        // Faster reveal — 500ms instead of 850ms
        setTimeout(() => {
          const wr = document.getElementById('winnersRevealed');
          if(wr) {
            wr.classList.add('visible');
            document.querySelectorAll('.winner-card').forEach((card, i) => {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(() => {
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, i * 80 + 50);
            });
          }
        }, 480);
      };
    }
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    fixImageErrors();
    convertPluses();
    initAllArrows();
    initRipples();
    addDividers();
    patchZipper();
    setInterval(() => { convertPluses(); initAllArrows(); }, 1500);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();