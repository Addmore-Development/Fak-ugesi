/**
 * Fak'ugesi Global Effects
 * - Stars (replace + signs), spin on hover, shoot baby stars
 * - Water ripple/drop effect on all text (except hero)
 * - Arrow boxes: clockwise loop animation + lightning on hover
 */

(function() {
  'use strict';

  /* ═══════════════════════════════════════════════
     1. REPLACE + / crosshair signs with STARS
  ═══════════════════════════════════════════════ */
  function convertPlusesToStars() {
    const selectors = [
      '.crosshair', '.nav-plus', '.section-crosshairs span',
      '.footer-crosshairs span', '.section-divider-star'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        upgradeStar(el);
      });
    });

    // Also find text nodes with bare "+" in known containers
    document.querySelectorAll('.footer-crosshairs, .section-crosshairs').forEach(container => {
      container.querySelectorAll('span').forEach(el => {
        if (el.textContent.trim() === '+') upgradeStar(el);
      });
    });
  }

  function upgradeStar(el) {
    el.classList.add('star-marker');
    el.innerHTML = `<svg class="star-svg" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L13.5 9.5 L21 11 L13.5 14.5 L12 22 L10.5 14.5 L3 11 L10.5 9.5 Z" fill="currentColor"/>
      <path d="M12 6 L12.8 10 L16.5 11 L12.8 12.8 L12 17 L11.2 12.8 L7.5 11 L11.2 10 Z" fill="rgba(255,255,255,0.3)"/>
    </svg>`;
    el.style.display = 'inline-flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.cursor = 'default';
    el.style.position = 'relative';

    el.addEventListener('mouseenter', () => {
      el.classList.add('star-spinning');
      shootBabyStars(el);
      setTimeout(() => el.classList.remove('star-spinning'), 700);
    });
  }

  function shootBabyStars(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + window.scrollX;
    const cy = rect.top + rect.height / 2 + window.scrollY;
    const count = 6;
    for (let i = 0; i < count; i++) {
      const baby = document.createElement('div');
      baby.className = 'baby-star';
      const angle = (i / count) * 360;
      const dist = 28 + Math.random() * 20;
      const dx = Math.cos(angle * Math.PI / 180) * dist;
      const dy = Math.sin(angle * Math.PI / 180) * dist;
      baby.style.cssText = `
        position:absolute;
        left:${cx}px;top:${cy}px;
        width:6px;height:6px;
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
        transition:transform 0.5s ease-out, opacity 0.5s ease-out;
      `;
      baby.innerHTML = `<svg viewBox="0 0 10 10" width="6" height="6"><path d="M5 1 L5.8 4 L9 5 L5.8 6.5 L5 9 L4.2 6.5 L1 5 L4.2 4 Z" fill="${el.closest('.theme-section, .get-involved, nav') ? '#d4e600' : '#d4e600'}"/></svg>`;
      document.body.appendChild(baby);
      requestAnimationFrame(() => {
        baby.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        baby.style.opacity = '0';
      });
      setTimeout(() => baby.remove(), 550);
    }
  }

  /* ═══════════════════════════════════════════════
     2. WATER RIPPLE EFFECT on non-hero text
  ═══════════════════════════════════════════════ */
  function initRippleEffect() {
    // Create canvas overlay for ripples
    const canvas = document.createElement('canvas');
    canvas.id = 'ripple-canvas';
    canvas.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:99998;
      mix-blend-mode:screen;
      opacity:0.7;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth, H = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    const ripples = [];

    function addRipple(x, y, color = 'rgba(100,180,255,0.6)') {
      ripples.push({ x, y, r: 0, maxR: 60 + Math.random() * 40, alpha: 0.8, color, speed: 2 + Math.random() });
    }

    function animateRipples() {
      ctx.clearRect(0, 0, W, H);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += rip.speed;
        rip.alpha -= 0.025;
        if (rip.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = rip.alpha;
        ctx.strokeStyle = rip.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rip.r, rip.r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        // inner highlight
        ctx.globalAlpha = rip.alpha * 0.4;
        ctx.strokeStyle = 'rgba(200,240,255,0.8)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y - rip.r * 0.15, rip.r * 0.3, rip.r * 0.1, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      requestAnimationFrame(animateRipples);
    }
    animateRipples();

    // Attach to all text elements outside hero
    function attachRippleToText() {
      const textSelectors = [
        'h2:not(.hero-title)', 'h3:not(.hero-title)', 'h4',
        'p:not(.hero-desc):not(.page-subtitle):not(.ia-intro-body)',
        '.section-title:not(.hero-title)', '.section-label',
        '.ticket-name', '.gi-card-title', '.cat-name', '.partner-desc',
        '.faq-q', '.spotlight-heading', '.theme-heading', '.happening-title',
        '.partners-title', '.spotlight-title', '.venue-title',
        'li', '.footer-links a', 'nav .nav-links a',
        '.ticker-item', '.oc-title', '.wc-name', '.wc-cat',
        '.ia-intro-title', '.premiere-title'
      ];

      const heroSection = document.querySelector('.hero, .ia-hero, .page-hero');

      textSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          // Skip if inside hero
          if (heroSection && heroSection.contains(el)) return;
          if (el.dataset.rippleInit) return;
          el.dataset.rippleInit = '1';

          el.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const cx = rect.left + rect.width * (0.2 + Math.random() * 0.6);
            const cy = rect.top + rect.height / 2;
            // blue water drop ripple
            addRipple(cx, cy, 'rgba(80,160,255,0.55)');
            setTimeout(() => addRipple(cx + (Math.random() - 0.5) * 20, cy + (Math.random() - 0.5) * 8, 'rgba(120,200,255,0.4)'), 120);
          });
        });
      });
    }

    // Run once now and again after DOM changes
    setTimeout(attachRippleToText, 100);
    setInterval(attachRippleToText, 2000);
  }

  /* ═══════════════════════════════════════════════
     3. ARROW BOX — clockwise loop + lightning
  ═══════════════════════════════════════════════ */
  function initArrowBoxes() {
    document.querySelectorAll('.arrow-btn').forEach(btn => {
      if (btn.dataset.arrowInit) return;
      btn.dataset.arrowInit = '1';

      // Make arrow longer
      const icon = btn.querySelector('.arr-icon');
      if (icon) {
        icon.setAttribute('viewBox', '0 0 28 24');
        const line = icon.querySelector('line');
        if (line) { line.setAttribute('x1', '2'); line.setAttribute('x2', '22'); }
        const poly = icon.querySelector('polyline');
        if (poly) poly.setAttribute('points', '16,6 22,12 16,18');
      }

      // Clockwise loop animation on hover
      btn.addEventListener('mouseenter', () => {
        btn.classList.add('arrow-loop-active');
        flashLightning(btn);
      });
      btn.addEventListener('mouseleave', () => {
        btn.classList.remove('arrow-loop-active');
      });
    });
  }

  function flashLightning(btn) {
    const existing = btn.querySelector('.lightning-flash-overlay');
    if (existing) existing.remove();

    const flash = document.createElement('div');
    flash.className = 'lightning-flash-overlay';
    flash.style.cssText = `
      position:absolute;inset:0;pointer-events:none;z-index:20;overflow:hidden;
    `;
    const W = btn.offsetWidth, H = btn.offsetHeight;
    const boltSvg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
      <path d="${generateBolt(W, H)}" stroke="rgba(212,230,0,0.95)" stroke-width="1.5" fill="none" filter="url(#glow-f)" opacity="0"/>
      <defs><filter id="glow-f"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    </svg>`;
    flash.innerHTML = boltSvg;
    btn.appendChild(flash);

    const path = flash.querySelector('path');
    // Animate: appear, fade
    path.animate([
      { opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 0.3, offset: 0.3 },
      { opacity: 1, offset: 0.5 }, { opacity: 0 }
    ], { duration: 500, easing: 'ease-out', fill: 'forwards' });

    setTimeout(() => flash.remove(), 550);
  }

  function generateBolt(W, H) {
    // Zigzag from top to bottom inside the box
    let d = `M ${W / 2} 2`;
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      const x = W * 0.2 + Math.random() * W * 0.6;
      const y = (i / steps) * (H - 4) + 2;
      d += ` L ${x} ${y}`;
    }
    return d;
  }

  /* ═══════════════════════════════════════════════
     4. SECTION DIVIDERS — add to sections
  ═══════════════════════════════════════════════ */
  function addSectionDividers() {
    const dividerHTML = `<div class="section-divider-line" aria-hidden="true">
      <span class="section-divider-star star-marker">+</span>
      <div class="section-divider-rule"></div>
      <span class="section-divider-star star-marker">+</span>
      <div class="section-divider-rule"></div>
      <span class="section-divider-star star-marker">+</span>
    </div>`;

    const targets = document.querySelectorAll([
      '.spotlight-section', '.happening-section', '.partners-section',
      '.faq-section', '.venue-section', '.categories-section',
      '.winners-section', '.submit-section', '.ia-intro', '.installations-section'
    ].join(','));

    targets.forEach(section => {
      if (section.dataset.dividerAdded) return;
      section.dataset.dividerAdded = '1';
      const div = document.createElement('div');
      div.innerHTML = dividerHTML;
      const firstChild = div.firstElementChild;
      section.insertBefore(firstChild, section.firstChild);
    });
  }

  /* ═══════════════════════════════════════════════
     5. INJECT GLOBAL STYLES
  ═══════════════════════════════════════════════ */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* STAR MARKERS */
      .star-marker {
        display:inline-flex;align-items:center;justify-content:center;
        position:relative;cursor:default;
        transition:transform 0.15s;
        color:rgba(255,255,255,0.25);
      }
      .star-marker .star-svg { display:block; }
      .star-spinning .star-svg {
        animation: starSpin360 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
      }
      @keyframes starSpin360 {
        from { transform: rotate(0deg) scale(1); }
        50%  { transform: rotate(180deg) scale(1.4); }
        to   { transform: rotate(360deg) scale(1); }
      }
      /* Dark sections — star lighter */
      .dark .star-marker, nav .star-marker { color:rgba(255,255,255,0.45); }
      .light-section .star-marker, .spotlight-section .star-marker,
      .happening-section .star-marker, footer .star-marker,
      .partners-section .star-marker { color:rgba(0,0,0,0.25); }

      /* SECTION DIVIDER */
      .section-divider-line {
        display:flex;align-items:center;gap:16px;padding:0 40px;
        margin-bottom:0;
        position:relative;z-index:2;
      }
      .section-divider-rule {
        flex:1;height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
      }
      .spotlight-section .section-divider-rule,
      .happening-section .section-divider-rule,
      .partners-section .section-divider-rule {
        background:linear-gradient(90deg,transparent,rgba(0,0,0,0.12),transparent);
      }

      /* ARROW BOX — clockwise loop */
      .arrow-loop-active .arr-icon {
        animation: arrowClockwiseLoop 0.6s ease-in-out infinite;
      }
      @keyframes arrowClockwiseLoop {
        0%   { transform: translateX(0) rotate(0deg); opacity:1; }
        40%  { transform: translateX(6px) rotate(0deg); opacity:0.3; }
        41%  { transform: translateX(-8px) rotate(0deg); opacity:0; }
        42%  { transform: translateX(-8px) rotate(0deg); opacity:0.7; }
        100% { transform: translateX(0) rotate(0deg); opacity:1; }
      }
      .arrow-btn {
        overflow:visible !important;
      }
      .arrow-loop-active {
        box-shadow: 0 0 14px rgba(212,230,0,0.35), inset 0 0 8px rgba(212,230,0,0.1);
      }

      /* RIPPLE TEXT HOVER */
      h2:not(.hero-title):not(.ia-title),
      h3:not(.hero-title),
      .section-title:not(.hero-title),
      .faq-q, .gi-card-title, .cat-name,
      .ticket-name, .wc-name, .wc-cat,
      .spotlight-heading, .theme-heading,
      .happening-title, .partners-title,
      .venue-title, .oc-title, .premiere-title,
      .ia-intro-title {
        position:relative;
        transition: text-shadow 0.3s ease;
      }
      h2:not(.hero-title):hover,
      h3:not(.hero-title):hover,
      .section-title:not(.hero-title):hover,
      .faq-q:hover, .gi-card-title:hover, .cat-name:hover,
      .ticket-name:hover, .wc-name:hover,
      .spotlight-heading:hover, .theme-heading:hover,
      .happening-title:hover, .partners-title:hover,
      .venue-title:hover, .oc-title:hover,
      .ia-intro-title:hover {
        text-shadow: 0 2px 16px rgba(100,180,255,0.3), 0 0 2px rgba(100,180,255,0.15);
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  function init() {
    injectStyles();
    convertPlusesToStars();
    initRippleEffect();
    initArrowBoxes();
    addSectionDividers();

    // Re-run stars/arrows for dynamic content
    setInterval(() => {
      convertPlusesToStars();
      initArrowBoxes();
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();