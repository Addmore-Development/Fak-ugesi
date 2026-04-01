/**
 * Fak'ugesi Global Effects v6
 * - Exact bolt shape from reference image (chunky, tilted, 3-point)
 * - 3 stacked bolts the arrow crashes into, loops on hover
 * - Clear white ripples, NOT on index hero
 * - Faster zipper
 * - Image infinite-error loop fix
 */
(function () {
  'use strict';

  const CSS = `
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
    .arrow-btn {
      display:inline-flex!important;align-items:center;justify-content:center;
      position:relative;overflow:hidden!important;
      cursor:pointer;text-decoration:none;
      transition:border-color .2s;
    }
    .arrow-btn canvas.fug-canvas{
      position:absolute;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:1;
    }
    .arrow-btn .arr-icon{ opacity:0!important; }
    #global-ripple-canvas{
      position:fixed;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:99990;
    }
    .zip-curtain-left,.zip-curtain-right{
      transition:transform 0.45s cubic-bezier(0.4,0,0.2,1)!important;
    }
    .winners-revealed{
      transition:opacity 0.3s ease 0.42s!important;
    }
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
     DRAW BOLT
     Traces the exact shape from the reference image:
     chunky lightning bolt, tilted top-right to bottom-left,
     with two notches (upper-right ear, lower-left ear)
  ───────────────────────────────────────────── */
  function drawBolt(ctx, cx, cy, size, color, alpha, glow) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(cx, cy);
    /* glow removed */
    const s = size;
    ctx.beginPath();
    ctx.moveTo( s*0.28,  -s*0.52);   // top-right tip
    ctx.lineTo(-s*0.08,  -s*0.04);   // diagonal to upper notch left
    ctx.lineTo( s*0.18,  -s*0.04);   // upper right ear
    ctx.lineTo(-s*0.28,   s*0.52);   // diagonal to bottom-left tip
    ctx.lineTo( s*0.08,   s*0.04);   // diagonal to lower notch right
    ctx.lineTo(-s*0.18,   s*0.04);   // lower left ear
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /* 3 stacked bolts: left-back, right-back, centre-front */
  function drawStack(ctx, cx, cy, btnH, alpha) {
    const size = btnH * 0.36;
    const gap  = size * 0.52;
    drawBolt(ctx, cx - gap, cy, size, 'rgba(255,220,0,0.38)', alpha * 0.75, 0);
    drawBolt(ctx, cx + gap, cy, size, 'rgba(255,220,0,0.38)', alpha * 0.75, 0);
    drawBolt(ctx, cx,       cy, size, '#ffffff',              alpha,        alpha * 15);
  }

  /* Arrow → at position x */
  function drawArrow(ctx, x, cy, alpha, color) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = color;
    ctx.fillStyle   = color;
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    /* no arrow glow */
    ctx.beginPath();
    ctx.moveTo(x - 12, cy);
    ctx.lineTo(x + 3,  cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 7,  cy);
    ctx.lineTo(x - 1,  cy - 6);
    ctx.lineTo(x - 1,  cy + 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /* ─────────────────────────────────────────────
     ARROW BUTTON — canvas crash animation loop
  ───────────────────────────────────────────── */
  function initArrowBtn(btn) {
    if(btn.dataset.arrowDone) return;
    btn.dataset.arrowDone = '1';

    const isDark = btn.classList.contains('dark');
    const arrowColor = isDark ? '#111' : '#fff';

    const canvas = document.createElement('canvas');
    canvas.className = 'fug-canvas';
    btn.insertBefore(canvas, btn.firstChild);

    const origIcon = btn.querySelector('.arr-icon');
    if(origIcon) origIcon.style.cssText = 'opacity:0!important;';

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;

    function resize() {
      W = canvas.width  = btn.offsetWidth  || 120;
      H = canvas.height = btn.offsetHeight || 52;
    }
    resize();

    const STACK_X  = () => W * 0.72;
    const ARROW_X0 = () => W * 0.22 + 12;

    let phase    = 'idle';
    let arrowX   = 0;
    let enterX   = 0;
    let raf      = null;
    let hovering = false;
    let flashA   = 0;
    let shakeT   = 0;
    let parts    = [];

    function boom(x) {
      flashA = 1;
      shakeT = 10;
      for(let i = 0; i < 22; i++) {
        const a = (i/22)*Math.PI*2;
        const spd = 1.5 + Math.random()*3.5;
        parts.push({
          x, y: H/2,
          vx: Math.cos(a)*spd, vy: Math.sin(a)*spd,
          life: 1,
          r: 1.5 + Math.random()*3,
          col: ['#ffe600','#fff','#d4e600','#ffaa00'][Math.floor(Math.random()*4)]
        });
      }
    }

    function drawIdle() {
      resize();
      ctx.clearRect(0, 0, W, H);
      drawStack(ctx, STACK_X(), H/2, H, 0.55);
      drawArrow(ctx, ARROW_X0(), H/2, 0.9, arrowColor);
    }

    function tick() {
      resize();
      ctx.clearRect(0, 0, W, H);
      const sx = STACK_X();
      const cy = H/2;

      // Flash overlay
      if(flashA > 0) {
        ctx.save();
        ctx.globalAlpha = flashA * 0.32;
        ctx.fillStyle = '#ffe600';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
        flashA = Math.max(0, flashA - 0.11);
      }

      // Particles
      parts = parts.filter(p => p.life > 0.02);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.84; p.vy *= 0.84;
        p.life -= 0.055;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle   = p.col;
        ctx.shadowColor = p.col;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.3, p.r * p.life), 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });

      const shk = shakeT > 0 ? (Math.random()-0.5)*4 : 0;
      if(shakeT > 0) shakeT--;

      if(phase === 'idle') {
        drawStack(ctx, sx + shk, cy, H, 0.55);
        drawArrow(ctx, ARROW_X0(), cy, 0.9, arrowColor);
        raf = null; return;
      }

      if(phase === 'travel') {
        arrowX += W * 0.048;
        drawStack(ctx, sx + shk, cy, H, 0.88);
        drawArrow(ctx, arrowX, cy, 1, arrowColor);
        if(arrowX >= sx - 8) { boom(sx); phase = 'crash'; }

      } else if(phase === 'crash') {
        drawStack(ctx, sx + shk, cy, H, flashA > 0.4 ? 0.1 : 0.88);
        if(parts.length === 0 && flashA <= 0) {
          enterX = -W * 0.08;
          phase  = 'enter';
        }

      } else if(phase === 'enter') {
        enterX += W * 0.048;
        const stackAlpha = Math.min(0.88, enterX / (W * 0.28));
        drawStack(ctx, sx, cy, H, Math.max(0, stackAlpha));
        drawArrow(ctx, enterX, cy, Math.min(1, enterX/(W*0.1)), arrowColor);
        if(enterX >= ARROW_X0()) {
          if(hovering) { arrowX = enterX; phase = 'travel'; }
          else         { phase = 'idle'; drawIdle(); raf = null; return; }
        }
      }

      raf = requestAnimationFrame(tick);
    }

    btn.addEventListener('mouseenter', () => {
      hovering = true;
      if(phase === 'idle') {
        arrowX = ARROW_X0();
        phase  = 'travel';
        parts  = []; flashA = 0; shakeT = 0;
        if(!raf) raf = requestAnimationFrame(tick);
      }
    });
    btn.addEventListener('mouseleave', () => { hovering = false; });

    drawIdle();
  }

  function initAllArrows() {
    document.querySelectorAll('.arrow-btn').forEach(initArrowBtn);
  }

  /* ─────────────────────────────────────────────
     STARS
  ───────────────────────────────────────────── */
  function makeStar(color) {
    return `<svg viewBox="0 0 20 20" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M10 1 L11.8 7.5 L18.5 9 L11.8 12 L10 19 L8.2 12 L1.5 9 L8.2 7.5 Z" fill="${color||'currentColor'}"/></svg>`;
  }

  function shootBabyStars(hostEl, color) {
    const rect = hostEl.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    for(let i = 0; i < 7; i++) {
      const angle = (i/7)*2*Math.PI;
      const dist  = 28+Math.random()*20;
      const size  = 4+Math.random()*4;
      const baby  = document.createElement('div');
      baby.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform .55s ease-out,opacity .55s ease-out;`;
      baby.innerHTML = `<svg viewBox="0 0 10 10" width="${size}" height="${size}"><path d="M5 1 L5.7 3.8 L8.5 5 L5.7 6.3 L5 9 L4.3 6.3 L1.5 5 L4.3 3.8 Z" fill="${color}"/></svg>`;
      document.body.appendChild(baby);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        baby.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px))`;
        baby.style.opacity   = '0';
      }));
      setTimeout(()=>baby.remove(), 620);
    }
  }

  function upgradePlus(el) {
    if(el.dataset.starDone) return;
    el.dataset.starDone = '1';
    const dark   = el.closest('nav,.get-involved,footer,.hero,.page-hero,.ia-hero,.faq-section,.winners-section,.categories-section,.premiere,.ongoing,.installations-section,.theme-section');
    const color  = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)';
    const accent = dark ? '#d4e600' : '#1a2332';
    el.classList.add('star-marker');
    el.innerHTML = makeStar(color);
    el.addEventListener('mouseenter', () => shootBabyStars(el, accent));
  }

  function convertPluses() {
    document.querySelectorAll('.crosshair,.nav-plus,.section-crosshairs span,.footer-crosshairs span,.team-crosshairs span,.partners-crosshairs span,.footer-bottom-crosshairs span,.passes-crosshairs span,.passes-crosshairs-bot span').forEach(el => {
      if(el.textContent.trim() === '+' && !el.dataset.starDone) upgradePlus(el);
    });
  }

  /* ─────────────────────────────────────────────
     CLEAR RIPPLES — white only, skip index hero
  ───────────────────────────────────────────── */
  function initRipples() {
    const path    = window.location.pathname;
    const isIndex = path === '/' || path.endsWith('index.html');

    const canvas = document.createElement('canvas');
    canvas.id    = 'global-ripple-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const drops = [];

    function addDrop(x, y, big) {
      const n = big ? 3 : 2;
      for(let i = 0; i < n; i++) {
        drops.push({ x: x+(Math.random()-.5)*(big?18:5), y: y+(Math.random()-.5)*(big?5:2),
          r:0, a: big?.62:.42, spd: big?1.5+Math.random()*1.3:1+Math.random()*.8,
          delay:i*50, born:Date.now() });
      }
    }

    (function loop() {
      ctx.clearRect(0,0,W,H);
      const now = Date.now();
      for(let i = drops.length-1; i >= 0; i--) {
        const d = drops[i];
        if(now - d.born < d.delay) continue;
        d.r += d.spd * 1.5; d.a -= 0.02;
        if(d.a <= 0) { drops.splice(i,1); continue; }
        ctx.save(); ctx.globalAlpha = d.a*.5; ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.ellipse(d.x,d.y,d.r*1.8,d.r*.42,0,0,Math.PI*2); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha = d.a*.25; ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=.7;
        ctx.beginPath(); ctx.ellipse(d.x,d.y,d.r*.85,d.r*.2,0,0,Math.PI*2); ctx.stroke(); ctx.restore();
      }
      requestAnimationFrame(loop);
    })();

    function attach(el) {
      if(isIndex && el.closest && el.closest('.hero')) return;
      if(el.dataset.ripple) return;
      el.dataset.ripple = '1';
      el.addEventListener('mouseenter', () => {
        const r = el.getBoundingClientRect();
        addDrop(r.left+r.width/2, r.top+r.height/2, true);
        for(let i=0;i<2;i++) setTimeout(()=>addDrop(r.left+r.width*(i+1)/3, r.top+r.height/2), i*45+15);
      });
    }

    function scan() {
      document.querySelectorAll('h1,h2,h3,.cat-name,.ticket-title,.spotlight-heading,.team-name,.edition-name,nav .nav-links a,.winner-card,.flip-card').forEach(el=>{
        if(isIndex && el.closest && el.closest('.hero')) return;
        attach(el);
      });
    }
    scan(); setInterval(scan, 2000);
  }

  /* ─────────────────────────────────────────────
     IMAGE INFINITE 404 LOOP FIX
  ───────────────────────────────────────────── */
  function fixImageErrors() {
    function patch(img) {
      if(img.dataset.ep) return;
      img.dataset.ep = '1';
      const inlineErr = img.getAttribute('onerror');
      if(inlineErr) {
        img.removeAttribute('onerror');
        img.addEventListener('error', function handler() {
          img.removeEventListener('error', handler);
          if(!img.dataset.ef) {
            img.dataset.ef = '1';
            try { (new Function(inlineErr)).call(img); } catch(e) {}
          }
        }, {once:true});
      }
    }
    document.querySelectorAll('img').forEach(patch);
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if(n.nodeName==='IMG') patch(n);
        if(n.querySelectorAll) n.querySelectorAll('img').forEach(patch);
      }));
    }).observe(document.body, {childList:true, subtree:true});
  }

  /* patchZipper removed — zipper replaced with direct grid */

  /* ─────────────────────────────────────────────
     SECTION DIVIDERS
  ───────────────────────────────────────────── */
  function addDividers() {
    const light = new Set(['spotlight-section','happening-section','who-section','editions-section','team-section','contact-section','partners-section']);
    document.querySelectorAll('.spotlight-section,.happening-section,.partners-section,.faq-section,.categories-section,.winners-section,.ia-intro,.installations-section,.who-section,.editions-section,.team-section,.contact-section,.requirements-section').forEach(sec=>{
      if(sec.dataset.divider) return; sec.dataset.divider='1';
      const isLight = [...sec.classList].some(c=>light.has(c));
      sec.classList.toggle('light-section', isLight);
      const col = isLight?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.2)';
      const div = document.createElement('div');
      div.className = 'section-divider-line';
      div.innerHTML = `<span class="star-marker">${makeStar(col)}</span><div class="section-divider-rule"></div><span class="star-marker">${makeStar(col)}</span><div class="section-divider-rule"></div><span class="star-marker">${makeStar(col)}</span>`;
      sec.insertBefore(div, sec.firstChild);
    });
  }

  /* INIT */
  function init() {
    fixImageErrors();
    convertPluses();
    initAllArrows();
    initRipples();
    addDividers();
    /* patchZipper() removed */
    setInterval(()=>{ convertPluses(); initAllArrows(); }, 1500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();