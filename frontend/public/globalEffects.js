/**
 * Fak'ugesi Global Effects v10
 * Changes from v9:
 *  - REMOVED: water/ripple/droplet canvas effect entirely
 *  - REMOVED: lightning text effect on body text
 *  - ADDED: Invisible box on ALL headings (background matching section color)
 *    On hover: box reveals dark/navy 3D depth effect behind heading text
 *    Text does NOT move — only the background behind it changes
 *  - KEPT: all other v9 effects
 *    A. KIKK FAQ horizontal-expand
 *    B. Arrow conveyor (winners-nav buttons)
 *    C. Hero simultaneous word-drop
 *    - Card flip
 *    - Hero letter-by-letter drop-in
 *    - Noodle/liquid text on section headings
 *    - Section divider plus-spin + baby plus burst
 *    - Arrow crash canvas animation
 *    - Image onerror fix
 */
(function () {
  'use strict';

  const CSS = `
    /* ── Arrow btn canvas ── */
    .star-marker{display:inline-flex;align-items:center;justify-content:center;position:relative;cursor:default;line-height:1;}
    .star-marker svg{display:block;overflow:visible;}
    .star-marker:hover svg{animation:starSpin .65s cubic-bezier(.4,0,.2,1) forwards;}
    @keyframes starSpin{0%{transform:rotate(0deg) scale(1);}50%{transform:rotate(180deg) scale(1.5);}100%{transform:rotate(360deg) scale(1);}}
    .arrow-btn{display:inline-flex!important;align-items:center;justify-content:center;position:relative;overflow:hidden!important;cursor:pointer;text-decoration:none;transition:border-color .2s;}
    .arrow-btn canvas.fug-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;}
    .arrow-btn .arr-icon{opacity:0!important;}

    /* ── Section dividers ── */
    .section-divider-line{display:flex;align-items:center;gap:14px;padding:18px 40px;position:relative;z-index:2;}
    .section-divider-rule{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);}
    .light-section .section-divider-rule{background:linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent);}
    .divider-plus{cursor:pointer;display:inline-block;user-select:none;font-size:18px;font-weight:300;line-height:1;transition:color .2s;}
    .divider-plus:hover{color:#e05a1e!important;}
    @keyframes divPlusSpin{0%{transform:rotate(0deg) scale(1);}45%{transform:rotate(210deg) scale(1.6);}100%{transform:rotate(360deg) scale(1);}}
    .div-plus-spinning{animation:divPlusSpin .5s cubic-bezier(.4,0,.2,1) forwards!important;}
    .fug-baby-plus2{position:fixed;pointer-events:none;z-index:99999;font-weight:700;line-height:1;transform:translate(-50%,-50%);transition:transform .5s ease-out,opacity .5s ease-out;}

    /* ── Card flip ── */
    .inv-card,.flip-card-outer{perspective:900px;}
    .inv-card{border:1px solid rgba(255,255,255,0.45);position:relative;backdrop-filter:blur(2px);aspect-ratio:1/1.05;cursor:default;}
    .inv-card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.65s cubic-bezier(.4,0,.2,1);}
    .inv-card:hover .inv-card-inner{transform:rotateY(180deg);}
    .inv-card-front,.inv-card-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;padding:22px 20px 20px;}
    .inv-card-back{transform:rotateY(180deg);background:rgba(255,255,255,0.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.5);display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:12px;}
    .card-fact-label{font-size:9px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.6;font-family:'InterDisplay',sans-serif;}
    .card-fact-text{font-size:15px;font-weight:600;line-height:1.45;font-family:'InterDisplay',sans-serif;color:#fff;}
    .card-fact-sub{font-size:11px;line-height:1.6;opacity:0.78;font-family:'InterDisplay',sans-serif;}
    .flip-card-outer{display:inline-block;width:100%;height:100%;}
    .flip-card-inner2{width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.65s cubic-bezier(.4,0,.2,1);position:relative;}
    .flip-card-outer:hover .flip-card-inner2{transform:rotateY(180deg);}
    .flip-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;}
    .flip-face-back{transform:rotateY(180deg);background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);display:flex;flex-direction:column;justify-content:center;padding:20px;gap:10px;}

    /* ── Hero letter drop (index) ── */
    .hero-letter{display:inline-block;opacity:0;transform:translateY(-40px);animation:letterDrop 0.45s cubic-bezier(.4,0,.2,1) forwards;}
    @keyframes letterDrop{0%{opacity:0;transform:translateY(-42px);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
    .hero-letter.bouncing{animation:letterBounce 0.55s cubic-bezier(.4,0,.2,1) forwards;}
    @keyframes letterBounce{0%{transform:translateY(0);}30%{transform:translateY(-12px);}55%{transform:translateY(3px);}75%{transform:translateY(-5px);}90%{transform:translateY(1px);}100%{transform:translateY(0);}}
    .hero-title:hover .hero-letter{animation:letterBounce 0.55s cubic-bezier(.4,0,.2,1) forwards;}

    /* ── Noodle text ── */
    .noodle-word{display:inline-block;transition:none;cursor:default;}
    .noodle-letter{display:inline-block;transition:transform 0.18s ease, filter 0.18s ease;}
    @keyframes noodleWave{0%{transform:translateY(0) rotate(0deg) scaleX(1);}20%{transform:translateY(-8px) rotate(-6deg) scaleX(1.12);}40%{transform:translateY(6px) rotate(4deg) scaleX(0.88);}60%{transform:translateY(-5px) rotate(-3deg) scaleX(1.08);}80%{transform:translateY(3px) rotate(2deg) scaleX(0.95);}100%{transform:translateY(0) rotate(0deg) scaleX(1);}}
    .noodle-letter.noodling{animation:noodleWave 0.7s ease forwards;filter:blur(0.4px);color:inherit;}

    /* ══════════════════════════════════════════════════════
       HEADING BOX EFFECT
       All headings get an invisible box behind them.
       On hover: box reveals a deep 3D dark/navy/black layered
       background behind the text. Text itself does NOT move.
       The box blends with the section background when idle.
    ══════════════════════════════════════════════════════ */
    .fug-heading-wrap {
      position: relative;
      display: inline-block;
    }

    /* The invisible bg box — same color as section bg at rest */
    .fug-heading-box {
      position: absolute;
      inset: -8px -14px;
      border-radius: 3px;
      pointer-events: none;
      z-index: 0;
      /* At rest: transparent — matches whatever background it sits on */
      background: transparent;
      /* 3D depth layers via box-shadow — hidden at rest */
      box-shadow: none;
      transition:
        background 0.28s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* The text sits above the box */
    .fug-heading-text {
      position: relative;
      z-index: 1;
      transition: text-shadow 0.28s ease;
    }

    /* HOVER STATE: reveal 3D dark depth behind heading */
    .fug-heading-wrap:hover .fug-heading-box {
      background: linear-gradient(
        135deg,
        rgba(5, 8, 28, 0.92) 0%,
        rgba(15, 25, 65, 0.88) 35%,
        rgba(8, 12, 40, 0.94) 65%,
        rgba(2, 4, 18, 0.96) 100%
      );
      /* 3D illusion: multiple shadow layers simulating depth */
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.08),
        inset 0 -1px 0 rgba(0,0,0,0.6),
        inset 2px 0 8px rgba(0,0,0,0.4),
        inset -2px 0 8px rgba(0,0,0,0.4),
        0 4px 24px rgba(0,0,0,0.5),
        0 8px 40px rgba(5,10,40,0.4),
        0 0 0 1px rgba(80,100,180,0.15);
    }

    /* On dark sections (navy/dark bg): use lighter reveal */
    .fug-heading-wrap.on-dark:hover .fug-heading-box {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(200, 215, 255, 0.04) 35%,
        rgba(255, 255, 255, 0.08) 65%,
        rgba(180, 200, 255, 0.05) 100%
      );
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.15),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        inset 2px 0 8px rgba(255,255,255,0.04),
        inset -2px 0 8px rgba(255,255,255,0.04),
        0 4px 24px rgba(0,0,0,0.4),
        0 0 0 1px rgba(255,255,255,0.06);
    }

    /* Heading text subtle glow on hover for depth emphasis */
    .fug-heading-wrap:hover .fug-heading-text {
      text-shadow:
        0 1px 0 rgba(0,0,0,0.8),
        0 2px 4px rgba(0,0,0,0.4),
        0 0 20px rgba(100,140,255,0.15);
    }
    .fug-heading-wrap.on-dark:hover .fug-heading-text {
      text-shadow:
        0 1px 2px rgba(0,0,0,0.5),
        0 0 16px rgba(200,220,255,0.2);
    }

    /* ══════════════════════════════════════════════════════
       A. KIKK FAQ / REQUIREMENTS HORIZONTAL EXPAND
    ══════════════════════════════════════════════════════ */
    .faq-kikk-row {
      display: flex !important;
      flex-direction: row !important;
      align-items: stretch;
      width: 100%;
      overflow: hidden;
      border: 1px solid rgba(26,39,68,0.15);
    }

    .faq-kikk-cell {
      flex: 1 1 0;
      min-width: 0;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border-right: 1px solid rgba(26,39,68,0.1);
      transition:
        flex 0.5s cubic-bezier(0.4,0,0.2,1),
        background 0.38s ease,
        color 0.38s ease;
    }
    .faq-kikk-cell:last-child { border-right: none; }

    .faq-kikk-cell.fkk-active  { flex: 5 1 0; }
    .faq-kikk-cell.fkk-inactive { flex: 0.4 1 0; }

    .faq-kikk-cell::before {
      content: '';
      position: absolute; left: 0; top: 0;
      width: 3px; height: 100%;
      transform: scaleY(0);
      transform-origin: top;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .faq-kikk-cell.fkk-active::before { transform: scaleY(1); }

    .fkk-collapsed {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.13em; text-transform: uppercase;
      opacity: 0.45;
      white-space: nowrap;
      padding: 14px 8px;
      font-family: 'InterDisplay', sans-serif;
      transition: opacity 0.25s;
      pointer-events: none;
    }
    .faq-kikk-cell.fkk-active .fkk-collapsed { opacity: 0; }

    .fkk-expanded {
      padding: 24px 20px 28px 22px;
      display: flex; flex-direction: column; justify-content: flex-end;
      min-height: 120px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.24s ease 0.1s;
      font-family: 'InterDisplay', sans-serif;
    }
    .faq-kikk-cell.fkk-active .fkk-expanded {
      opacity: 1;
      pointer-events: auto;
    }
    .fkk-num {
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      opacity: 0.4; margin-bottom: 8px;
    }
    .fkk-q {
      font-size: 13px; font-weight: 600; line-height: 1.38;
      margin-bottom: 10px;
    }
    .fkk-a {
      font-size: 11.5px; line-height: 1.7;
      opacity: 0.78;
    }

    /* FAQ theme: light/blue bg → navy on hover */
    .faq-kikk-row.faq-theme { border-color: rgba(26,39,68,0.15); }
    .faq-kikk-row.faq-theme .faq-kikk-cell { background: #f0f3f9; color: #0d1b3e; border-right-color: rgba(26,39,68,0.1); }
    .faq-kikk-row.faq-theme .faq-kikk-cell.fkk-active { background: #1a2744; color: #ffffff; }
    .faq-kikk-row.faq-theme .faq-kikk-cell::before { background: #1a2744; }
    .faq-kikk-row.faq-theme .faq-kikk-cell.fkk-active::before { background: rgba(255,255,255,0.4); }
    .faq-kikk-row.faq-theme .fkk-collapsed { color: #0d1b3e; }
    .faq-kikk-row.faq-theme .faq-kikk-cell.fkk-active .fkk-collapsed { color: #fff; }
    .faq-kikk-row.faq-theme .fkk-q { color: inherit; }
    .faq-kikk-row.faq-theme .fkk-a { color: inherit; }
    .faq-kikk-row.faq-theme .fkk-num { color: inherit; }

    /* Requirements theme: navy bg → light on hover */
    .faq-kikk-row.req-theme { border-color: rgba(255,255,255,0.12); }
    .faq-kikk-row.req-theme .faq-kikk-cell { background: #1a2744; color: rgba(255,255,255,0.82); border-right-color: rgba(255,255,255,0.08); }
    .faq-kikk-row.req-theme .faq-kikk-cell.fkk-active { background: #f0f3f9; color: #0d1b3e; }
    .faq-kikk-row.req-theme .faq-kikk-cell::before { background: rgba(255,255,255,0.4); }
    .faq-kikk-row.req-theme .faq-kikk-cell.fkk-active::before { background: #1a2744; }
    .faq-kikk-row.req-theme .fkk-collapsed { color: rgba(255,255,255,0.7); }
    .faq-kikk-row.req-theme .faq-kikk-cell.fkk-active .fkk-collapsed { color: #0d1b3e; }
    .faq-kikk-row.req-theme .fkk-q { color: inherit; }
    .faq-kikk-row.req-theme .fkk-a { color: inherit; }
    .faq-kikk-row.req-theme .fkk-num { color: inherit; }

    /* ══════════════════════════════════════════════════════
       B. ARROW CONVEYOR
    ══════════════════════════════════════════════════════ */
    .fug-conveyor-btn {
      position: relative;
      overflow: hidden !important;
      cursor: pointer;
    }
    .fug-conveyor-btn .fug-conv-track {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      white-space: nowrap;
      will-change: transform;
    }

    /* ══════════════════════════════════════════════════════
       C. HERO SIMULTANEOUS WORD-DROP
    ══════════════════════════════════════════════════════ */
    @keyframes heroSimDrop {
      0%   { opacity: 0; transform: translateY(-22px); }
      65%  { opacity: 1; transform: translateY(3px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .hero-sim-drop {
      animation: heroSimDrop 0.2s cubic-bezier(0.22, 1, 0.36, 1) both !important;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ═══════════════════════════════════════════════════════════════
     CARD FLIP — fun facts
  ═══════════════════════════════════════════════════════════════ */
  const FACTS = [
    { label:'Did you know?', text:'Fak\'ugesi has showcased over 300 African digital artists since its launch.', sub:'Africa\'s creativity knows no bounds.' },
    { label:'Festival fact', text:'The festival attracts visitors from 30+ countries across every continent.', sub:'A truly global celebration of African innovation.' },
    { label:'Innovation stat', text:'Over 60% of Fak\'ugesi alumni have gone on to found their own tech startups.', sub:'The festival is a launchpad for the future.' },
    { label:'Heritage note', text:'Fak\'ugesi means "wonder" or "amazement" in Zulu — a fitting name for Africa\'s boldest digital festival.', sub:'Rooted in culture, reaching for tomorrow.' },
    { label:'Community pulse', text:'More than 500 volunteers have contributed their skills to Fak\'ugesi over the years.', sub:'Built by the community, for the community.' },
    { label:'Creative fact', text:'Immersive Africa has premiered 40+ original XR works created by African artists.', sub:'Pushing the boundaries of immersive storytelling.' },
    { label:'Awards insight', text:'Fak\'ugesi Awards receive applications from over 15 African countries every year.', sub:'Celebrating excellence across the continent.' },
    { label:'Economic impact', text:'The festival generates R12M+ in economic activity for the Johannesburg creative economy annually.', sub:'Culture and commerce, hand in hand.' },
    { label:'Tech milestone', text:'Fak\'ugesi PRO has connected 200+ African tech entrepreneurs with global investors.', sub:'Bridging the funding gap for African innovation.' },
  ];
  let factIdx = 0;
  function nextFact() { return FACTS[factIdx++ % FACTS.length]; }

  function wrapInvCard(card) {
    if (card.dataset.flipped) return;
    card.dataset.flipped = '1';
    const fact = nextFact();
    const frontContent = card.innerHTML;
    card.innerHTML = `
      <div class="inv-card-inner">
        <div class="inv-card-front">${frontContent}</div>
        <div class="inv-card-back">
          <span class="card-fact-label">${fact.label}</span>
          <span class="card-fact-text">${fact.text}</span>
          <span class="card-fact-sub">${fact.sub}</span>
        </div>
      </div>`;
  }

  function initCardFlips() {
    document.querySelectorAll('.inv-card').forEach(wrapInvCard);
    document.querySelectorAll('.winner-card:not([data-flipped]), .prog-card:not([data-flipped]), .cat-card:not([data-flipped])').forEach(card => {
      card.dataset.flipped = '1';
      const fact = nextFact();
      const orig = card.innerHTML;
      card.style.perspective = '900px';
      card.innerHTML = `
        <div class="flip-card-inner2">
          <div class="flip-face">${orig}</div>
          <div class="flip-face flip-face-back">
            <span class="card-fact-label">${fact.label}</span>
            <span class="card-fact-text">${fact.text}</span>
            <span class="card-fact-sub">${fact.sub}</span>
          </div>
        </div>`;
      card.classList.add('flip-card-outer');
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     HERO LETTER DROP (index page — per-letter staggered)
  ═══════════════════════════════════════════════════════════════ */
  function initHeroLetterDrop() {
    const heroTitle = document.querySelector('.hero-title, .hero-head, .ia-hero-title, .awards-hero-title');
    if (!heroTitle || heroTitle.dataset.letterDone) return;
    heroTitle.dataset.letterDone = '1';
    const html = heroTitle.innerHTML;
    const parts = html.split(/(<br\s*\/?>)/gi);
    let newHtml = '';
    let delay = 0;
    parts.forEach(part => {
      if (/^<br/i.test(part)) { newHtml += part; return; }
      for (const ch of part) {
        if (ch === ' ') { newHtml += ' '; continue; }
        newHtml += `<span class="hero-letter" style="animation-delay:${delay}ms">${ch}</span>`;
        delay += 55;
      }
    });
    heroTitle.innerHTML = newHtml;
    const totalDrop = delay + 450;
    setTimeout(() => {
      heroTitle.querySelectorAll('.hero-letter').forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('bouncing');
          el.addEventListener('animationend', () => el.classList.remove('bouncing'), { once: true });
        }, i * 38);
      });
    }, totalDrop);
  }

  /* ═══════════════════════════════════════════════════════════════
     C. HERO SIMULTANEOUS DROP (signature programme pages)
  ═══════════════════════════════════════════════════════════════ */
  function initHeroSimDrop() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent || heroContent.dataset.simDrop) return;
    heroContent.dataset.simDrop = '1';
    heroContent.style.animation = 'none';
    const children = Array.from(heroContent.children);
    children.forEach(child => { child.style.animation = 'none'; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      children.forEach(child => {
        child.style.animation = '';
        child.classList.add('hero-sim-drop');
      });
      const logo = document.querySelector('.hero-awards-logo, .hero-signia');
      if (logo) logo.classList.add('hero-sim-drop');
    }));
  }

  /* ═══════════════════════════════════════════════════════════════
     NOODLE TEXT
  ═══════════════════════════════════════════════════════════════ */
  const NOODLE_SELECTORS = [
    '.theme-year','.theme-head',
    '.involved-title','.spotlight-title','.happening-title','.partners-title',
    '.spotlight-head','.ia-section-title','.awards-section-title',
    '.cat-name','.ticket-title','.team-name','.edition-name',
    'h2:not(.hero-title):not(.hero-head)',
    'h3:not(.hero-title):not(.hero-head)',
  ].join(',');

  function wrapNoodle(el) {
    if (el.dataset.noodle || el.closest('.hero') || el.closest('.nav-links') || el.closest('.faq-kikk-row')) return;
    if (el.classList.contains('hero-title') || el.classList.contains('hero-head')) return;
    el.dataset.noodle = '1';
    el.classList.add('noodle-word');
    function splitNode(node) {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of node.textContent) {
          if (ch === ' ' || ch === '\n') { frag.appendChild(document.createTextNode(ch)); continue; }
          const span = document.createElement('span');
          span.className = 'noodle-letter';
          span.textContent = ch;
          frag.appendChild(span);
        }
        return frag;
      } else if (node.nodeType === 1 && node.tagName !== 'SPAN') {
        const clone = node.cloneNode(false);
        node.childNodes.forEach(c => clone.appendChild(splitNode(c)));
        return clone;
      }
      return node.cloneNode(true);
    }
    const frag = document.createDocumentFragment();
    el.childNodes.forEach(n => frag.appendChild(splitNode(n)));
    el.innerHTML = '';
    el.appendChild(frag);
    el.addEventListener('mouseenter', () => {
      el.querySelectorAll('.noodle-letter').forEach((letter, i) => {
        letter.classList.remove('noodling');
        void letter.offsetWidth;
        setTimeout(() => {
          letter.classList.add('noodling');
          letter.addEventListener('animationend', () => letter.classList.remove('noodling'), { once: true });
        }, i * 28);
      });
    });
  }

  function initNoodleText() {
    try { document.querySelectorAll(NOODLE_SELECTORS).forEach(wrapNoodle); } catch(e) {}
  }

  /* ═══════════════════════════════════════════════════════════════
     HEADING BOX 3D EFFECT
     Wraps all headings (h1, h2, h3) outside .hero and nav in an
     invisible box. On hover: reveals 3D dark depth behind text.
     Text does NOT move — only background changes.
  ═══════════════════════════════════════════════════════════════ */
  const HEADING_SELECTORS = [
    'h1', 'h2', 'h3',
    '.winners-title', '.cat-title', '.jury-title', '.req-title', '.faq-title',
    '.partners-title', '.what-title', '.highlights-title', '.network-title',
    '.section-header-label', '.premiere-title',
  ].join(',');

  function isDarkSection(el) {
    let node = el.parentElement;
    while (node && node !== document.body) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/[\d.]+/g);
        if (m && m.length >= 3) {
          const brightness = parseInt(m[0]) * 0.299 + parseInt(m[1]) * 0.587 + parseInt(m[2]) * 0.114;
          return brightness < 128;
        }
      }
      // check class names
      const cls = node.className || '';
      if (cls.includes('navy') || cls.includes('requirements') || cls.includes('categories') ||
          cls.includes('network') || cls.includes('hero')) return true;
      node = node.parentElement;
    }
    return false;
  }

  function wrapHeadingBox(el) {
    if (el.dataset.hbox) return;
    if (el.closest('.hero')) return;
    if (el.closest('#fug-nav, #sig-nav, .nav-links')) return;
    if (el.closest('.faq-kikk-row')) return;
    el.dataset.hbox = '1';

    const dark = isDarkSection(el);
    const wrap = document.createElement('span');
    wrap.className = 'fug-heading-wrap' + (dark ? ' on-dark' : '');
    wrap.style.display = 'block';

    const box = document.createElement('span');
    box.className = 'fug-heading-box';

    const textSpan = document.createElement('span');
    textSpan.className = 'fug-heading-text';

    while (el.firstChild) textSpan.appendChild(el.firstChild);
    wrap.appendChild(box);
    wrap.appendChild(textSpan);
    el.appendChild(wrap);
  }

  function initHeadingBoxes() {
    try {
      document.querySelectorAll(HEADING_SELECTORS).forEach(el => {
        if (!el.closest('.hero')) wrapHeadingBox(el);
      });
    } catch(e) {}
  }

  /* ═══════════════════════════════════════════════════════════════
     ARROW CRASH CANVAS (.arrow-btn)
  ═══════════════════════════════════════════════════════════════ */
  function drawBolt(ctx, cx, cy, size, color, alpha) {
    // Classic lightning bolt matching reference: wide top-right, zig-zag middle, tapered bottom-left point
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(cx, cy);
    const s = size;
    ctx.beginPath();
    ctx.moveTo( s*0.18, -s*0.55);   // top-left of upper half
    ctx.lineTo( s*0.42, -s*0.55);   // top-right of upper half
    ctx.lineTo( s*0.10,  s*0.00);   // notch right-middle
    ctx.lineTo( s*0.30,  s*0.00);   // inner notch right
    ctx.lineTo(-s*0.18,  s*0.55);   // bottom point (left)
    ctx.lineTo(-s*0.42,  s*0.55);   // bottom-left
    ctx.lineTo(-s*0.10,  s*0.00);   // notch left-middle
    ctx.lineTo(-s*0.30,  s*0.00);   // inner notch left
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = size * 0.8;
    ctx.fill();
    ctx.restore();
  }

  function drawBoltTarget(ctx, cx, cy, H, alpha) {
    if (alpha <= 0) return;
    ctx.save();
    const bw = H * 0.55, bh = H * 0.72;
    ctx.globalAlpha = alpha * 0.18;
    ctx.fillStyle = '#ffe600';
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 18;
    ctx.fillRect(cx - bw/2, cy - bh/2, bw, bh);
    ctx.restore();
    drawBolt(ctx, cx, cy, H * 0.44, '#ffffff', alpha);
    drawBolt(ctx, cx - H*0.24, cy, H * 0.22, 'rgba(255,220,0,0.55)', alpha * 0.7);
    drawBolt(ctx, cx + H*0.24, cy, H * 0.22, 'rgba(255,220,0,0.55)', alpha * 0.7);
  }

  function drawArrow(ctx, x, cy, alpha, color) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x - 14, cy); ctx.lineTo(x + 2, cy); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 8, cy);
    ctx.lineTo(x, cy - 7);
    ctx.lineTo(x, cy + 7);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function initArrowBtn(btn) {
    if (btn.dataset.arrowDone) return;
    btn.dataset.arrowDone = '1';
    const isDark = btn.classList.contains('dark');
    const arrowColor = isDark ? '#111' : '#fff';

    const canvas = document.createElement('canvas');
    canvas.className = 'fug-canvas';
    btn.insertBefore(canvas, btn.firstChild);
    const origIcon = btn.querySelector('.arr-icon');
    if (origIcon) origIcon.style.cssText = 'opacity:0!important;';
    // Also hide conveyor-style spans (used in winners nav)
    const arrowInner = btn.querySelector('.arrow-inner');
    if (arrowInner) arrowInner.style.cssText = 'opacity:0!important;position:absolute;';

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    function resize() { W = canvas.width = btn.offsetWidth || 120; H = canvas.height = btn.offsetHeight || 52; }
    resize();

    const BOLT_X  = () => W * 0.72;
    const ARROW_X0 = () => W * 0.22 + 12;

    let phase = 'idle', arrowX = 0, enterX = 0, raf = null;
    let hovering = false, flashA = 0, shakeT = 0, parts = [];

    function boom(x) {
      flashA = 1; shakeT = 12;
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        const spd = 1.8 + Math.random() * 4.2;
        parts.push({
          x, y: H / 2,
          vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          life: 1, r: 1.8 + Math.random() * 3.5,
          col: ['#ffe600','#fff','#ffcc00','#ffaa00','#ff8c00','rgba(255,255,255,0.9)'][Math.floor(Math.random() * 6)]
        });
      }
    }

    function drawIdle() {
      resize(); ctx.clearRect(0, 0, W, H);
      drawBoltTarget(ctx, BOLT_X(), H / 2, H, 0.75);
      drawArrow(ctx, ARROW_X0(), H / 2, 0.9, arrowColor);
    }

    function tick() {
      resize(); ctx.clearRect(0, 0, W, H);
      const bx = BOLT_X(), cy = H / 2;

      if (flashA > 0) {
        ctx.save(); ctx.globalAlpha = flashA * 0.45; ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600'; ctx.shadowBlur = 30;
        ctx.fillRect(0, 0, W, H); ctx.restore();
        flashA = Math.max(0, flashA - 0.09);
      }

      parts = parts.filter(p => p.life > 0.02);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.82; p.vy *= 0.82;
        p.life -= 0.048;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.3, p.r * p.life), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      const shk = shakeT > 0 ? (Math.random() - 0.5) * 5 : 0;
      if (shakeT > 0) shakeT--;

      if (phase === 'idle') {
        drawBoltTarget(ctx, bx + shk, cy, H, 0.75);
        drawArrow(ctx, ARROW_X0(), cy, 0.9, arrowColor);
        raf = null; return;
      }
      if (phase === 'travel') {
        arrowX += W * 0.052;
        drawBoltTarget(ctx, bx + shk, cy, H, 0.88);
        drawArrow(ctx, arrowX, cy, 1, arrowColor);
        if (arrowX >= bx - 8) { boom(bx); phase = 'crash'; }
      } else if (phase === 'crash') {
        const boltAlpha = flashA > 0.3 ? 0 : Math.max(0, 0.88 - (1 - flashA) * 2);
        drawBoltTarget(ctx, bx + shk, cy, H, boltAlpha);
        if (parts.length === 0 && flashA <= 0) { enterX = -W * 0.08; phase = 'enter'; }
      } else if (phase === 'enter') {
        enterX += W * 0.052;
        const boltAlpha = Math.min(0.75, enterX / (W * 0.28));
        drawBoltTarget(ctx, bx, cy, H, Math.max(0, boltAlpha));
        drawArrow(ctx, enterX, cy, Math.min(1, enterX / (W * 0.12)), arrowColor);
        if (enterX >= ARROW_X0()) {
          if (hovering) { arrowX = enterX; phase = 'travel'; }
          else { phase = 'idle'; drawIdle(); raf = null; return; }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    btn.addEventListener('mouseenter', () => {
      hovering = true;
      if (phase === 'idle') {
        arrowX = ARROW_X0(); phase = 'travel';
        parts = []; flashA = 0; shakeT = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      }
    });
    btn.addEventListener('mouseleave', () => { hovering = false; });
    drawIdle();
  }

  function initAllArrows() {
    document.querySelectorAll('.arrow-btn, #prev-winner, #next-winner').forEach(initArrowBtn);
  }

  /* ═══════════════════════════════════════════════════════════════
     B. ARROW CONVEYOR (winners-nav ← / → plain buttons)
  ═══════════════════════════════════════════════════════════════ */
  function initArrowConveyor() {
    // #prev-winner and #next-winner are handled by initArrowBtn (crash animation) — skip them here
    const SEL = '#winners-prev, #winners-next';
    document.querySelectorAll(SEL).forEach(btn => {
      if (btn.classList.contains('arrow-btn') || btn.dataset.conveyorDone) return;
      btn.dataset.conveyorDone = '1';

      const char = btn.textContent.trim();
      if (!char) return;

      const isRight = char === '→' || char.charCodeAt(0) === 8594;
      const btnSize = btn.offsetWidth || btn.offsetHeight || 52;

      const kfId = 'kf-conv-' + (isRight ? 'fwd' : 'rev') + '-' + btnSize;
      if (!document.getElementById(kfId)) {
        const kfEl = document.createElement('style');
        kfEl.id = kfId;
        if (isRight) {
          kfEl.textContent = `@keyframes convFwd_${btnSize}{0%{transform:translateX(-${btnSize}px)}100%{transform:translateX(${btnSize}px)}}`;
        } else {
          kfEl.textContent = `@keyframes convRev_${btnSize}{0%{transform:translateX(${btnSize}px)}100%{transform:translateX(-${btnSize}px)}}`;
        }
        document.head.appendChild(kfEl);
      }

      const track = document.createElement('span');
      track.className = 'fug-conv-track';
      track.style.cssText = `
        position: absolute;
        display: flex; align-items: center; justify-content: center;
        width: 100%; height: 100%;
        font-size: inherit; color: inherit;
        pointer-events: none;
      `;
      track.textContent = char;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.textContent = '';
      btn.appendChild(track);
      btn.classList.add('fug-conveyor-btn');

      const animName = isRight ? `convFwd_${btnSize}` : `convRev_${btnSize}`;

      btn.addEventListener('mouseenter', () => {
        track.style.animation = `${animName} 0.42s linear infinite`;
      });
      btn.addEventListener('mouseleave', () => {
        track.style.animation = 'none';
        void track.offsetWidth;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     IMAGE ERROR FIX
  ═══════════════════════════════════════════════════════════════ */
  function fixImageErrors() {
    function patch(img) {
      if(img.dataset.ep)return;img.dataset.ep='1';
      const inlineErr=img.getAttribute('onerror');
      if(inlineErr){img.removeAttribute('onerror');img.addEventListener('error',function handler(){img.removeEventListener('error',handler);if(!img.dataset.ef){img.dataset.ef='1';try{(new Function(inlineErr)).call(img);}catch(e){}}},{once:true});}
    }
    document.querySelectorAll('img').forEach(patch);
    new MutationObserver(muts=>{muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeName==='IMG')patch(n);if(n.querySelectorAll)n.querySelectorAll('img').forEach(patch);}));}).observe(document.body,{childList:true,subtree:true});
  }

  /* ═══════════════════════════════════════════════════════════════
     SECTION DIVIDERS
  ═══════════════════════════════════════════════════════════════ */
  function shootBabyPluses(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left+rect.width/2, cy = rect.top+rect.height/2;
    const colours = ['#e05a1e','#1a2744','#4a6fa5','#ff8c42'];
    for (let i = 0; i < 8; i++) {
      const angle=(i/8)*Math.PI*2, dist=28+Math.random()*22, size=9+Math.random()*7;
      const baby = document.createElement('span');
      baby.className = 'fug-baby-plus2';
      baby.textContent = '+';
      baby.style.cssText=`left:${cx}px;top:${cy}px;font-size:${size}px;color:${colours[i%colours.length]};`;
      document.body.appendChild(baby);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        baby.style.transform=`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) rotate(${Math.random()*360}deg) scale(0.3)`;
        baby.style.opacity='0';
      }));
      setTimeout(()=>baby.remove(),580);
    }
  }

  function addDividers() {
    const light=new Set(['spotlight-section','happening-section','who-section','editions-section','team-section','contact-section','partners-section']);
    document.querySelectorAll('.spotlight-section,.happening-section,.partners-section,.faq-section,.categories-section,.winners-section,.ia-intro,.installations-section,.who-section,.editions-section,.team-section,.contact-section,.requirements-section').forEach(sec=>{
      if(sec.dataset.divider)return;sec.dataset.divider='1';
      const isLight=[...sec.classList].some(c=>light.has(c));
      sec.classList.toggle('light-section',isLight);
      const col=isLight?'rgba(0,0,0,0.25)':'rgba(255,255,255,0.25)';
      const div=document.createElement('div');
      div.className='section-divider-line';
      div.innerHTML=`<span class="divider-plus" style="color:${col}">+</span><div class="section-divider-rule"></div><span class="divider-plus" style="color:${col}">+</span><div class="section-divider-rule"></div><span class="divider-plus" style="color:${col}">+</span>`;
      sec.insertBefore(div,sec.firstChild);
      div.querySelectorAll('.divider-plus').forEach(p=>{
        p.addEventListener('mouseenter',()=>{
          p.classList.remove('div-plus-spinning');void p.offsetWidth;p.classList.add('div-plus-spinning');
          shootBabyPluses(p);
        });
        p.addEventListener('animationend',()=>p.classList.remove('div-plus-spinning'));
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     A. KIKK HORIZONTAL EXPAND
  ═══════════════════════════════════════════════════════════════ */
  function isDarkBg(el) {
    let node = el;
    while (node && node !== document.body) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/\d+/g);
        if (m) {
          const brightness = (parseInt(m[0])*299 + parseInt(m[1])*587 + parseInt(m[2])*114) / 1000;
          return brightness < 100;
        }
      }
      node = node.parentElement;
    }
    return false;
  }

  function buildKikkRow(container, theme) {
    if (container.dataset.kikkDone) return;

    const items = container.querySelectorAll(':scope > .faq-item');
    if (items.length < 2) return;
    container.dataset.kikkDone = '1';

    let resolvedTheme = theme;
    if (!resolvedTheme || resolvedTheme === 'auto') {
      resolvedTheme = isDarkBg(container) ? 'req' : 'faq';
    }
    const themeClass = resolvedTheme === 'req' ? 'req-theme' : 'faq-theme';

    const data = [];
    items.forEach((item, i) => {
      const qEl = item.querySelector(
        '.faq-question-text, .faq-question span:first-child, .faq-btn span:first-child, .faq-q, button span:first-child'
      );
      const aEl = item.querySelector('.faq-answer, .faq-a, .faq-body');
      const rawQ = qEl
        ? qEl.textContent.trim()
        : (item.querySelector('button, .faq-question, .faq-btn')?.textContent?.trim() ?? `Item ${i+1}`);
      const rawA = aEl ? aEl.innerHTML.trim() : '';
      const shortLabel = rawQ.length > 16 ? rawQ.slice(0, 16) + '…' : rawQ;
      data.push({ q: rawQ, a: rawA, shortLabel, num: String(i+1).padStart(2,'0') });
    });

    const row = document.createElement('div');
    row.className = `faq-kikk-row ${themeClass}`;

    data.forEach((d, i) => {
      const cell = document.createElement('div');
      cell.className = 'faq-kikk-cell' + (i === 0 ? ' fkk-active' : '');

      cell.innerHTML = `
        <div class="fkk-collapsed">${d.shortLabel}</div>
        <div class="fkk-expanded">
          <div class="fkk-num">${d.num}</div>
          <div class="fkk-q">${d.q}</div>
          ${d.a ? `<div class="fkk-a">${d.a}</div>` : ''}
        </div>`;

      cell.addEventListener('mouseenter', () => {
        row.querySelectorAll('.faq-kikk-cell').forEach(c => {
          c.classList.remove('fkk-active');
          c.classList.add('fkk-inactive');
        });
        cell.classList.remove('fkk-inactive');
        cell.classList.add('fkk-active');
      });

      row.appendChild(cell);
    });

    row.addEventListener('mouseleave', () => {
      row.querySelectorAll('.faq-kikk-cell').forEach((c, i) => {
        c.classList.remove('fkk-active', 'fkk-inactive');
        if (i === 0) c.classList.add('fkk-active');
      });
    });

    container.innerHTML = '';
    container.appendChild(row);
  }

  function initKikkFaq() {
    const FAQ_SEL = [
      '#faq-items', '.faq-items',
      '#faq-list',  '.faq-list',
      '#faqList',
      '.faq-right > div',
    ].join(', ');
    document.querySelectorAll(FAQ_SEL).forEach(el => {
      if (!el.dataset.kikkDone) buildKikkRow(el, 'faq');
    });

    const REQ_SEL = [
      '#req-items', '.req-items',
      '#requirements-items', '.requirements-items',
    ].join(', ');
    document.querySelectorAll(REQ_SEL).forEach(el => {
      if (!el.dataset.kikkDone) buildKikkRow(el, 'req');
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     MASTER INIT
  ═══════════════════════════════════════════════════════════════ */
  function init() {
    fixImageErrors();
    initAllArrows();
    initArrowConveyor();
    addDividers();
    initCardFlips();
    initHeroLetterDrop();
    initHeroSimDrop();
    initNoodleText();
    initKikkFaq();
    // Heading boxes run after DOM settles
    setTimeout(initHeadingBoxes, 200);

    setInterval(() => {
      initAllArrows();
      initArrowConveyor();
      initCardFlips();
      initNoodleText();
      initKikkFaq();
      initHeadingBoxes();
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();