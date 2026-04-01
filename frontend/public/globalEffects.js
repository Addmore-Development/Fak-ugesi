/**
 * Fak'ugesi Global Effects v3 — ULTRA EDITION
 * - Arrow crashes into standing lightning bolt
 * - MEGA water ripples
 * - Hilarious noodle text on hover
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

    /* ── ARROW BUTTON — wider for bolt ── */
    .arrow-btn {
      display:inline-flex!important;align-items:center;justify-content:center;
      position:relative;overflow:visible!important;
      width:140px!important;height:52px!important;
      background:rgba(255,255,255,.06);
      border:1.5px solid rgba(255,255,255,.3);
      cursor:pointer;text-decoration:none;
      transition:border-color .2s,background .2s;
      clip-path:none!important;
    }
    .arrow-btn.dark{background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.25);}
    .arrow-btn canvas.kikk-canvas{
      position:absolute;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:1;
    }
    .arrow-btn .arr-icon{
      position:relative;z-index:2;
      width:26px;height:16px;
      fill:none;stroke:#fff;stroke-width:2;
      stroke-linecap:round;stroke-linejoin:round;
      transition:opacity .15s;
    }
    .arrow-btn.dark .arr-icon{stroke:#111;}

    /* ── RIPPLE CANVAS ── */
    #global-ripple-canvas{
      position:fixed;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:99990;
      mix-blend-mode:screen;
    }

    /* ── NOODLE TEXT ── */
    .noodle-active {
      display:inline-block;
    }
    .noodle-char {
      display:inline-block;
      transition:transform 0.08s ease;
      will-change:transform;
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
     ARROW BUTTON — arrow zooms right, CRASHES into standing bolt, explosion, new arrow enters
  ───────────────────────────────────────────── */
  function initArrowBtn(btn) {
    if(btn.dataset.arrowDone) return;
    btn.dataset.arrowDone='1';

    const isDark = btn.classList.contains('dark');
    const arrowColor = isDark ? '#111' : '#fff';
    const boltColor = isDark ? '#333' : 'rgba(255,255,255,0.75)';
    const accentYellow = '#d4e600';
    const accentOrange = '#ff7700';
    const W_BTN = 140, H_BTN = 52;

    /* canvas covers the full button */
    const canvas = document.createElement('canvas');
    canvas.className = 'kikk-canvas';
    canvas.width = W_BTN; canvas.height = H_BTN;
    btn.insertBefore(canvas, btn.firstChild);

    /* hide original SVG icon — we draw it ourselves */
    const origIcon = btn.querySelector('.arr-icon');
    if(origIcon) origIcon.style.display = 'none';

    const ctx = canvas.getContext('2d');

    /* ── draw bolt at X position ── */
    function drawBolt(x, alpha, scale=1, color=boltColor) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, H_BTN/2);
      ctx.scale(scale, scale);
      // chunky bolt path
      ctx.beginPath();
      ctx.moveTo(4, -14);
      ctx.lineTo(-4, 0);
      ctx.lineTo(2, 0);
      ctx.lineTo(-4, 14);
      ctx.lineTo(4, 0);
      ctx.lineTo(-2, 0);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowColor = accentYellow;
      ctx.shadowBlur = 10 * scale;
      ctx.fill();
      ctx.restore();
    }

    /* ── draw arrow at X ── */
    function drawArrow(x, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = arrowColor;
      ctx.shadowBlur = 3;
      const y = H_BTN/2;
      ctx.beginPath();
      ctx.moveTo(x - 11, y);
      ctx.lineTo(x + 5, y);
      ctx.moveTo(x - 1, y - 6);
      ctx.lineTo(x + 6, y);
      ctx.lineTo(x - 1, y + 6);
      ctx.stroke();
      ctx.restore();
    }

    /* ── explosion particles ── */
    let particles = [];
    const COLORS_EXP = ['#ff2200','#ff7700','#ffee00','#d4e600','#ffffff','#ff44cc','#44ffff'];
    function spawnExplosion(x) {
      for(let i=0;i<30;i++) {
        const angle = Math.random()*Math.PI*2;
        const speed = 2 + Math.random()*5;
        particles.push({
          x, y: H_BTN/2,
          vx: Math.cos(angle)*speed,
          vy: Math.sin(angle)*speed,
          life: 1,
          size: 2 + Math.random()*5,
          color: COLORS_EXP[Math.floor(Math.random()*COLORS_EXP.length)]
        });
      }
    }

    function updateParticles() {
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.88; p.vy *= 0.88;
        p.life -= 0.04;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
    }

    /* ── shockwave rings ── */
    let shockwaves = [];
    function spawnShockwave(x) {
      shockwaves.push({ x, y: H_BTN/2, r: 4, life: 1 });
      shockwaves.push({ x, y: H_BTN/2, r: 2, life: 1 });
    }
    function updateShockwaves() {
      shockwaves = shockwaves.filter(s => s.life > 0);
      shockwaves.forEach(s => {
        s.r += 4; s.life -= 0.07;
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.life * 0.8);
        ctx.strokeStyle = accentYellow;
        ctx.lineWidth = 2;
        ctx.shadowColor = accentYellow;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      });
    }

    /* ── flash overlay ── */
    let flashAlpha = 0;
    function triggerFlash() { flashAlpha = 1; }

    /* ── STATE MACHINE ── */
    // States: idle, travel, crash, settle, exit
    let state = 'idle';
    let arrowX = W_BTN * 0.35;   // arrow position
    const BOLT_X = W_BTN * 0.75; // standing bolt position
    let boltShake = 0;
    let boltVisible = true;
    let newArrowX = -20;
    let raf = null;
    let crashed = false;

    function idle() {
      canvas.width = W_BTN; canvas.height = H_BTN;
      ctx.clearRect(0,0,W_BTN,H_BTN);
      drawArrow(W_BTN*0.35, 1);
      drawBolt(BOLT_X, 0.7, 1);
    }

    function tick() {
      canvas.width = W_BTN; canvas.height = H_BTN;
      ctx.clearRect(0,0,W_BTN,H_BTN);

      /* flash */
      if(flashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = flashAlpha * 0.5;
        ctx.fillStyle = '#ffee00';
        ctx.fillRect(0,0,W_BTN,H_BTN);
        ctx.restore();
        flashAlpha = Math.max(0, flashAlpha - 0.12);
      }

      updateParticles();
      updateShockwaves();

      if(state === 'travel') {
        arrowX += 6;
        drawArrow(arrowX, 1);
        /* bolt pulses slightly */
        drawBolt(BOLT_X + Math.sin(Date.now()*0.03)*1.5, 0.9, 1.0 + Math.sin(Date.now()*0.05)*0.08);

        if(arrowX >= BOLT_X - 8) {
          state = 'crash';
          crashed = true;
          spawnExplosion(BOLT_X);
          spawnShockwave(BOLT_X);
          triggerFlash();
          boltVisible = false;
          setTimeout(()=>{ boltVisible=true; }, 350);
        }
      } else if(state === 'crash') {
        /* bolt shatters — draw fragments flying */
        if(boltVisible) drawBolt(BOLT_X, 0.8, 1.2, '#ffee00');
        boltShake = (Math.random()-0.5)*8;
        /* after crash, bring in new arrow from left */
        setTimeout(()=>{
          state = 'enter';
          newArrowX = -20;
        }, 180);
        state = 'wait'; // prevent repeated timeout
      } else if(state === 'wait') {
        // just update particles
      } else if(state === 'enter') {
        newArrowX += 5.5;
        drawArrow(newArrowX, Math.min(1, newArrowX/30));
        /* bolt reassembles */
        drawBolt(BOLT_X, Math.min(0.8, (newArrowX - 20)/80));
        if(newArrowX >= W_BTN*0.35) {
          arrowX = W_BTN*0.35;
          state = 'settled';
        }
      } else if(state === 'settled') {
        drawArrow(arrowX, 1);
        drawBolt(BOLT_X, 0.8);
        if(particles.length === 0 && shockwaves.length === 0) {
          /* idle animation - subtle bolt flicker */
        }
      }

      raf = requestAnimationFrame(tick);
    }

    btn.addEventListener('mouseenter', () => {
      if(state === 'idle' || state === 'settled') {
        state = 'travel';
        arrowX = W_BTN*0.35;
        crashedOnce = false;
        if(!raf) raf = requestAnimationFrame(tick);
      }
    });

    btn.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf); raf = null;
      particles = []; shockwaves = []; flashAlpha = 0;
      state = 'idle';
      boltVisible = true;
      idle();
    });

    idle();
  }

  function initAllArrows() {
    document.querySelectorAll('.arrow-btn').forEach(initArrowBtn);
  }

  /* ─────────────────────────────────────────────
     MEGA WATER RIPPLES — extremely obvious
  ───────────────────────────────────────────── */
  function initMegaRipples() {
    const canvas = document.createElement('canvas');
    canvas.id = 'global-ripple-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const drops = [];

    function addDrop(x, y, big=false) {
      const count = big ? 5 : 3;
      for(let i=0;i<count;i++) {
        drops.push({
          x: x + (Math.random()-0.5)*(big?30:10),
          y: y + (Math.random()-0.5)*(big?10:4),
          r: 0,
          a: big ? 0.9 : 0.75,
          speed: big ? (1.5+Math.random()*2) : (1+Math.random()*1.5),
          delay: i*80,
          born: Date.now()
        });
      }
    }

    (function loop() {
      ctx.clearRect(0,0,W,H);
      const now = Date.now();
      for(let i=drops.length-1;i>=0;i--) {
        const d=drops[i];
        const age = now - d.born - d.delay;
        if(age < 0) continue;
        d.r += d.speed * 1.8;
        d.a -= 0.018;
        if(d.a<=0){drops.splice(i,1);continue;}

        /* Main big elliptical ripple */
        ctx.save();
        ctx.globalAlpha = d.a * 0.85;
        ctx.strokeStyle = `rgba(0,180,255,0.9)`;
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(0,200,255,1)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 1.5, d.r * 0.4, 0, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();

        /* Second ring */
        ctx.save();
        ctx.globalAlpha = d.a * 0.5;
        ctx.strokeStyle = `rgba(100,220,255,0.8)`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(100,220,255,1)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 2.2, d.r * 0.6, 0, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();

        /* Bright splash highlight */
        ctx.save();
        ctx.globalAlpha = d.a * 0.3;
        ctx.strokeStyle = `rgba(255,255,255,0.9)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 0.6, d.r * 0.15, 0, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    })();

    /* Trigger on hover of text elements */
    function attachRipple(el) {
      if(el.dataset.ripple) return;
      el.dataset.ripple = '1';
      el.addEventListener('mouseenter', () => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        addDrop(cx, cy, true);
        /* cascade drops along the element width */
        for(let i=0;i<4;i++) {
          setTimeout(()=>{
            addDrop(rect.left + (rect.width*(i+1)/5), cy + (Math.random()-0.5)*rect.height*0.5);
          }, i*60+30);
        }
      });
    }

    function scanRippleTargets() {
      document.querySelectorAll('h1,h2,h3,h4,.section-title,.faq-q,.gi-card-title,.cat-name,.ticket-title,.spotlight-heading,.theme-heading,.happening-title,.partners-title,.venue-title,.oc-title,.premiere-title,.ia-intro-title,.team-name,.edition-name,nav .nav-links a,.ticker-item,.winner-card,.flip-card,.cat-card,.hero-title').forEach(attachRipple);
    }
    scanRippleTargets();
    setInterval(scanRippleTargets, 2000);
  }

  /* ─────────────────────────────────────────────
     NOODLE TEXT — words wriggle like wet noodles on hover
  ───────────────────────────────────────────── */
  function initNoodleText() {
    const NOODLE_SELECTORS = 'h1,h2,h3,h4,.gi-card-title,.cat-name,.ticket-title,.spotlight-heading,.theme-heading,.happening-title,.partners-title,.winner-card .wc-name,.cat-card .cat-name,.flip-front .gi-card-title,nav .nav-links a';

    function wrapChars(el) {
      if(el.dataset.noodled || el.querySelector('.noodle-char')) return;
      el.dataset.noodled = '1';
      const text = el.textContent;
      if(!text.trim() || el.children.length > 2) return; // skip complex elements

      const html = text.split('').map(ch =>
        ch === ' ' ? ' ' : `<span class="noodle-char">${ch}</span>`
      ).join('');

      // preserve child elements like links by only wrapping text nodes
      el.classList.add('noodle-active');
      // For simple text elements only
      if(el.tagName === 'A' || el.childElementCount === 0) {
        el.innerHTML = html;
      }
    }

    function noodleify(el) {
      if(!el.dataset.noodled) wrapChars(el);
      const chars = el.querySelectorAll('.noodle-char');
      if(!chars.length) return;

      let frame = 0;
      let raf;

      function wobble() {
        frame++;
        chars.forEach((ch, i) => {
          const t = frame * 0.18 + i * 0.6;
          const tx = Math.sin(t * 1.3) * 6;
          const ty = Math.cos(t * 0.9 + i) * 8;
          const rot = Math.sin(t + i * 0.4) * 18;
          const scaleX = 1 + Math.sin(t * 2 + i) * 0.25;
          const scaleY = 1 + Math.cos(t * 1.5 + i * 0.7) * 0.3;
          ch.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
          ch.style.color = `hsl(${(frame * 3 + i * 25) % 360}, 100%, 60%)`;
          ch.style.textShadow = `0 0 12px hsl(${(frame*5+i*30)%360},100%,70%)`;
        });
        raf = requestAnimationFrame(wobble);
      }

      el.addEventListener('mouseenter', () => {
        wobble();
      });

      el.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        chars.forEach(ch => {
          ch.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), color 0.4s, text-shadow 0.4s';
          ch.style.transform = '';
          ch.style.color = '';
          ch.style.textShadow = '';
          setTimeout(()=>{ ch.style.transition=''; }, 450);
        });
      });
    }

    function scanNoodles() {
      document.querySelectorAll(NOODLE_SELECTORS).forEach(el => {
        if(!el.dataset.noodleListened) {
          el.dataset.noodleListened = '1';
          noodleify(el);
        }
      });
    }

    scanNoodles();
    setInterval(scanNoodles, 2500);
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
     INIT
  ───────────────────────────────────────────── */
  function init() {
    convertPluses();
    initAllArrows();
    initMegaRipples();
    initNoodleText();
    addDividers();
    setInterval(() => { convertPluses(); initAllArrows(); }, 1500);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();