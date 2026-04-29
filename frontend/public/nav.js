(function () {
  const path = window.location.pathname;
  const page = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';
  function isActive(href) {
    return page === href.replace(/^\//, '').replace(/\.html$/, '');
  }

  document.head.insertAdjacentHTML('beforeend', `<style>
    #main-nav {
      position:fixed; top:0; left:0; right:0; z-index:1000;
      display:flex; align-items:center; height:58px;
      background:transparent; border-bottom:1px solid transparent;
      font-family:'InterDisplay',sans-serif;
      transition:border-color .35s;
      overflow:visible;
    }

    #main-nav::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(10,18,50,0.98) 0%,
        rgba(15,24,60,0.92) 35%,
        rgba(20,32,72,0.72) 70%,
        rgba(26,40,80,0.35) 100%
      );
      opacity: 0;
      transition: opacity 0.45s ease;
      pointer-events: none;
      z-index: 0;
    }
    #main-nav.scrolled::before { opacity: 1; }
    #main-nav.scrolled { box-shadow: 0 4px 32px rgba(0,0,0,0.18); }

    /* ── Desktop nav links ── */
    #main-nav .nav-links-wrap {
      flex:1;
      display:flex;
      align-items:center;
      padding-left: 248px;
      position:relative;
      z-index:1;
      overflow:visible;
    }
    #main-nav .nav-links {
      display:flex; align-items:center; list-style:none; margin:0; padding:0;
      overflow:visible;
    }
    #main-nav .nav-links>li { position:relative; overflow:visible; }
    #main-nav .nav-links>li>a,
    #main-nav .nav-links>li>span {
      color:rgba(255,255,255,0.82); font-size:13px; font-weight:500;
      letter-spacing:.01em; text-decoration:none; line-height:58px;
      white-space:nowrap; display:block;
      padding:0 18px 0 0;
      cursor:pointer;
    }
    #main-nav .nav-links>li:first-child>a,
    #main-nav .nav-links>li:first-child>span { padding-left:0; }
    #main-nav .nav-links>li:not(:first-child)>a,
    #main-nav .nav-links>li:not(:first-child)>span { padding:0 20px; }
    #main-nav .nav-links>li>a.active,
    #main-nav .nav-links>li>span.active { color:#fff; font-weight:400; }

    /* Standard dropdown */
    #main-nav .nav-dd {
      position:absolute; top:57px; left:0; min-width:200px;
      background:rgba(8,15,44,0.97); border:1px solid rgba(255,255,255,0.1);
      backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
      padding:8px 0;
      opacity:0; pointer-events:none; transform:translateY(-8px);
      transition:opacity .22s,transform .22s; z-index:200;
    }
    #main-nav .nav-links>li:hover .nav-dd { opacity:1;pointer-events:auto;transform:translateY(0); }
    #main-nav .nav-dd a {
      display:block; padding:9px 20px;
      color:rgba(255,255,255,0.75);
      font-size:12.5px; font-weight:500; text-decoration:none;
      transition:background .18s, padding-left .2s ease; line-height:1.4;
    }
    #main-nav .nav-dd a:hover { background:rgba(255,255,255,0.07); padding-left:28px; }

    /* Right-side controls */
    #main-nav .nav-right {
      display:flex; align-items:center; gap:24px; padding-right:32px;
      flex-shrink:0; position:relative; z-index:1;
    }
    #main-nav .nav-search {
      background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.78);
      display:flex; align-items:center; padding:6px;
      margin-left:32px;
    }
    #main-nav .nav-search svg{width:18px;height:18px;}

    /* GET TICKETS */
    #main-nav .nav-tickets {
      position:relative; overflow:hidden;
      background:#1a2744; color:#fff;
      border:1.5px solid rgba(255,255,255,0.38); border-radius:0;
      cursor:pointer; padding:9px 22px;
      font-size:11.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
      font-family:'InterDisplay',sans-serif; text-decoration:none;
      display:inline-flex; align-items:center; white-space:nowrap;
      transition:background .22s,border-color .22s,transform .15s;
    }
    #main-nav .nav-tickets:hover{background:#0d1b3e;border-color:rgba(255,220,60,.75);transform:translateY(-1px);}
    #main-nav .nav-tickets canvas{position:absolute;inset:0;pointer-events:none;z-index:0;}
    #main-nav .nav-tickets span{position:relative;z-index:1;}

    /* ── HAMBURGER BUTTON (mobile only) ── */
    #nav-hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 40px; height: 40px;
      background: none; border: none;
      cursor: pointer;
      position: relative; z-index: 1001;
      padding: 8px;
      margin-right: 12px;
    }
    #nav-hamburger span {
      display: block;
      width: 22px; height: 1.5px;
      background: #fff;
      transition: transform 0.3s ease, opacity 0.3s ease;
      transform-origin: center;
    }
    #nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    #nav-hamburger.open span:nth-child(2) { opacity: 0; }
    #nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    /* ── MOBILE LOGO (left side, mobile only) ── */
    #nav-mobile-logo {
      display: none;
      position: relative; z-index: 1;
      padding-left: 20px;
      flex: 1;
    }
    #nav-mobile-logo img {
      height: 28px; width: auto;
      display: block;
      filter: brightness(0) invert(1);
    }

    /* ── MOBILE MENU OVERLAY ── */
    #nav-mobile-menu {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(10,18,48,0.98);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 999;
      flex-direction: column;
      justify-content: center;
      padding: 80px 28px 48px;
      overflow-y: auto;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    #nav-mobile-menu.open {
      display: flex;
      opacity: 1;
      pointer-events: auto;
    }

    #nav-mobile-menu .mob-nav-list {
      list-style: none; margin: 0; padding: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    #nav-mobile-menu .mob-nav-list li {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    #nav-mobile-menu .mob-nav-list > li > a,
    #nav-mobile-menu .mob-nav-list > li > span {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 0;
      color: #fff; text-decoration: none;
      font-size: 22px; font-weight: 700;
      letter-spacing: -0.01em;
      font-family: 'InterDisplay', sans-serif;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    #nav-mobile-menu .mob-nav-list > li > a:hover,
    #nav-mobile-menu .mob-nav-list > li > span:hover { opacity: 0.65; }
    #nav-mobile-menu .mob-nav-list > li > a.active { opacity: 0.5; }

    /* Mobile sub-menu */
    #nav-mobile-menu .mob-sub {
      list-style: none; margin: 0; padding: 0 0 12px 12px;
      display: none;
    }
    #nav-mobile-menu .mob-sub.open { display: block; }
    #nav-mobile-menu .mob-sub li a {
      display: block; padding: 9px 0;
      color: rgba(255,255,255,0.65);
      font-size: 14px; font-weight: 500;
      font-family: 'InterDisplay', sans-serif;
      text-decoration: none;
      transition: color 0.2s;
    }
    #nav-mobile-menu .mob-sub li a:hover { color: #fff; }

    /* Mobile chevron */
    .mob-chevron {
      display: inline-block;
      width: 20px; height: 20px;
      border-right: 2px solid rgba(255,255,255,0.5);
      border-bottom: 2px solid rgba(255,255,255,0.5);
      transform: rotate(45deg);
      transition: transform 0.25s;
      flex-shrink: 0;
      margin-left: 12px;
      position: relative; top: -3px;
    }
    .mob-chevron.open { transform: rotate(-135deg); top: 3px; }

    /* Mobile GET TICKETS button */
    #nav-mobile-menu .mob-tickets {
      display: block; margin-top: 32px;
      padding: 16px 28px;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.4);
      color: #fff;
      font-size: 13px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; text-decoration: none;
      font-family: 'InterDisplay', sans-serif;
      text-align: center;
      transition: background 0.2s, border-color 0.2s;
    }
    #nav-mobile-menu .mob-tickets:hover {
      background: rgba(255,255,255,0.07);
      border-color: rgba(255,220,60,0.6);
    }

    /* Mobile social icons in menu */
    #nav-mobile-menu .mob-socials {
      display: flex; gap: 20px; align-items: center;
      margin-top: 28px;
    }
    #nav-mobile-menu .mob-socials a {
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      display: flex; align-items: center;
      transition: color 0.2s;
    }
    #nav-mobile-menu .mob-socials a:hover { color: #fff; }

    /* ── Global electric button effects ── */
    .btn-primary, .btn-outline-dark, .btn-outline-white,
    .btn-apply, .btn-cta-white, .btn-cta-filled, .btn-learn,
    .hero-cta, .intro-cta, .network-cta, .section-cta,
    .challenge-cta, a.btn-tickets, button.btn-tickets, .btn-get-pass,
    .showcase-cta-btn, .day-card, .more-card,
    [class*="btn-"]:not(.req-btn):not(.faq-q-btn):not(.nav-tickets):not(.nav-search):not(.showcase-detail-back):not(.speaker-detail-back) {
      position:relative !important;
      overflow:hidden !important;
      transition: background 0.28s ease, color 0.22s ease,
                  border-color 0.28s ease, transform 0.18s ease !important;
    }
    .btn-apply:hover, .btn-cta-white:hover, .btn-cta-filled:hover, .btn-learn:hover,
 /* Each button handles its own hover via JS — no grouped CSS hover */
.btn-primary:hover { background: #0d1b3e; color: #fff; border-color: rgba(100,160,255,0.65); transform: translateY(-1px); }
.btn-outline-dark:hover { background: #0d1b3e; color: #fff; border-color: rgba(100,160,255,0.65); transform: translateY(-1px); }
.btn-outline-white:hover { background: #0d1b3e; color: #fff; border-color: rgba(100,160,255,0.65); transform: translateY(-1px); }
    .btn-primary canvas, .btn-outline-dark canvas, .btn-outline-white canvas,
    .btn-apply canvas, .btn-cta-white canvas, .btn-cta-filled canvas,
    .btn-learn canvas, .hero-cta canvas, .intro-cta canvas,
    .network-cta canvas, .section-cta canvas, .challenge-cta canvas,
    a.btn-tickets canvas, button.btn-tickets canvas, .btn-get-pass canvas,
    .showcase-cta-btn canvas,
    [class*="btn-"] canvas {
      position:absolute !important; inset:0 !important;
      pointer-events:none !important; z-index:0 !important;
    }
    .btn-primary > *, .btn-outline-dark > *, .btn-outline-white > *,
    .btn-apply > *, .btn-cta-white > *, .btn-cta-filled > *,
    .btn-learn > *, .hero-cta > *, .intro-cta > *,
    .network-cta > *, .section-cta > *, .challenge-cta > *,
    a.btn-tickets > *, button.btn-tickets > *, .btn-get-pass > *,
    .showcase-cta-btn > *,
    [class*="btn-"] > * {
      position:relative !important; z-index:1 !important;
    }

    .curatorial-view-link, .showcases-link, .showcase-card-more,
    .showcase-detail-link, .partners-link, .more-card-link,
    .sched-location, .sched-speakers a, .nav-dd a, .ticker-item,
    .carousel-logo-name, .hero-eyebrow, .showcases-header a,
    .curatorial-view-link, .more-card-top span,
    [class*="-link"]:not(#main-nav *):not(.showcase-detail-back):not(.speaker-detail-back) {
      display:inline-block;
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                  color 0.2s ease,
                  letter-spacing 0.22s ease !important;
    }
    .curatorial-view-link:hover, .showcases-link:hover, .showcase-card-more:hover,
    .showcase-detail-link:hover, .partners-link:hover, .more-card-link:hover,
    .sched-location:hover, .sched-speakers a:hover, .showcases-header a:hover,
    .more-card-top span:hover,
    [class*="-link"]:not(#main-nav *):not(.showcase-detail-back):not(.speaker-detail-back):hover {
      transform: scale(1.1);
      transform-origin: left center;
      letter-spacing: 0.07em;
    }
    #main-nav .nav-dd a {
      transition: background 0.18s, color 0.18s, padding-left 0.2s ease !important;
    }

    /* ══ RESPONSIVE BREAKPOINTS ══ */

    /* Tablet (≤1024px): shrink padding */
    @media (max-width: 1024px) {
      #main-nav .nav-links-wrap { padding-left: 48px; }
      #main-nav .nav-right { padding-right: 24px; }
      #main-nav .nav-links>li>a,
      #main-nav .nav-links>li>span { font-size: 12px; padding: 0 14px; }
      #main-nav .nav-links>li:first-child>a,
      #main-nav .nav-links>li:first-child>span { padding-left: 0; }
      #main-nav .nav-tickets { padding: 8px 16px; font-size: 10.5px; }
      #main-nav .nav-search { margin-left: 12px; }
    }

    /* Mobile (≤768px): show hamburger, hide desktop nav */
    @media (max-width: 768px) {
      #main-nav .nav-links-wrap { display: none; }
      #main-nav .nav-right { display: none; }
      #nav-hamburger { display: flex; }
      #nav-mobile-logo { display: flex; align-items: center; }

      /* nav bar always has a dark bg on mobile for readability */
      #main-nav::before { opacity: 1 !important; }
    }
  </style>`);

  const links = [
    { label:'Home',                 href:'/index.html' },
    { label:'Festival Programme',   href:'/programme.html', dd:[
      { label:'Expo',      href:'/fes-expo.html' },
      { label:'Market',    href:'/fes-market.html' },
      { label:'Schedule',  href:'/fes-schedule.html' },
    ]},
    { label:'Signature Programmes', href:'/sig-awards.html' },
    { label:'Discover', href:'#', dd:[
      { label:'About Us',   href:'/about.html' },
      { label:'Venues',     href:'/discover/venues.html' },
      { label:'Partners',   href:'/discover/partners.html' },
      { label:'Archive',    href:'/discover/archive.html' },
      { label:'Resources',  href:'/discover/resources.html' },
    ]},
  ];

  /* ── Desktop nav items ── */
  const items = links.map((l, i) => {
    const active = isActive(l.href);
    if (l.dd) {
      const ddHTML = `<div class="nav-dd">${l.dd.map(d=>`<a href="${d.href}">${d.label}</a>`).join('')}</div>`;
      return `<li data-i="${i}"><span class="${active ? 'active' : ''}">${l.label} ▾</span>${ddHTML}</li>`;
    }
    return `<li data-i="${i}"><a href="${l.href}"${active ? ' class="active"' : ''}>${l.label}</a></li>`;
  }).join('');

  /* ── Mobile menu items ── */
  const mobItems = links.map((l, i) => {
    const active = isActive(l.href);
    if (l.dd) {
      const subItems = l.dd.map(d => `<li><a href="${d.href}">${d.label}</a></li>`).join('');
      return `
        <li>
          <span class="${active ? 'active' : ''}" data-mob-toggle="${i}">
            ${l.label}
            <span class="mob-chevron" id="mob-chev-${i}"></span>
          </span>
          <ul class="mob-sub" id="mob-sub-${i}">${subItems}</ul>
        </li>`;
    }
    return `<li><a href="${l.href}"${active ? ' class="active"' : ''}>${l.label}</a></li>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav id="main-nav">
      <!-- Mobile logo (left) -->
      <div id="nav-mobile-logo">
        <img src="/images/logos/fakugesi/logo_fakugesi_light.svg" alt="Fak'ugesi Festival" />
      </div>

      <!-- Desktop links -->
      <div class="nav-links-wrap" id="nav-links-wrap">
        <ul class="nav-links" id="nav-list">${items}</ul>
        <button class="nav-search" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>

      <!-- Desktop right: tickets -->
      <div class="nav-right">
        <a class="nav-tickets" id="nav-tickets" href="/tickets.html">
          <canvas id="nav-bolt-canvas"></canvas>
          <span>GET TICKETS</span>
        </a>
      </div>

      <!-- Hamburger (mobile) -->
      <button id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- Mobile full-screen menu -->
    <div id="nav-mobile-menu" role="dialog" aria-label="Navigation menu">
      <ul class="mob-nav-list">${mobItems}</ul>
      <a class="mob-tickets" href="/tickets.html">Get Tickets →</a>
      <div class="mob-socials">
        <a href="https://www.instagram.com/fakugesi/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
        </a>
        <a href="https://x.com/fakugesi" target="_blank" rel="noopener" aria-label="X">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.facebook.com/fakugesi" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
  `);

  /* ── Scroll behaviour ── */
  window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);
  }, { passive:true });
  document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);

  /* ── Hamburger toggle ── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Mobile sub-menu toggles ── */
  mobileMenu.querySelectorAll('[data-mob-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const i = el.dataset.mobToggle;
      const sub = document.getElementById(`mob-sub-${i}`);
      const chev = document.getElementById(`mob-chev-${i}`);
      if (sub) sub.classList.toggle('open');
      if (chev) chev.classList.toggle('open');
    });
  });

  /* Close mobile menu on link click */
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Electric lightning on GET TICKETS ── */
  (function () {
    const btn = document.getElementById('nav-tickets');
    const cv  = document.getElementById('nav-bolt-canvas');
    if (!btn || !cv) return;
    const ctx = cv.getContext('2d');
    let raf = null, on = false, bolts = [], f = 0;
    function rs() { cv.width = btn.offsetWidth; cv.height = btn.offsetHeight; }
    function seg(x1,y1,x2,y2,r,d) {
      if (d <= 0) return [[x1,y1],[x2,y2]];
      const mx = (x1+x2)/2 + (Math.random()-.5)*r, my = (y1+y2)/2 + (Math.random()-.5)*r*.4;
      return [...seg(x1,y1,mx,my,r*.55,d-1), ...seg(mx,my,x2,y2,r*.55,d-1).slice(1)];
    }
    function spawn() {
      const W = cv.width, H = cv.height;
      return { pts:seg(W*(.1+Math.random()*.8),0,W*(.1+Math.random()*.8),H,W*.28,4),
               life:1, decay:.08+Math.random()*.06, w:.7+Math.random()*.9 };
    }
    function draw(b) {
      const a = Math.max(0, b.life);
      [[b.w*5,`rgba(60,120,255,${a*.28})`,'rgba(60,140,255,.7)',12],
       [b.w*.7,`rgba(200,230,255,${a*.8})`,'rgba(180,220,255,.9)',4]]
      .forEach(([lw,sc,sh,sb]) => {
        ctx.save(); ctx.beginPath(); ctx.moveTo(b.pts[0][0],b.pts[0][1]);
        b.pts.slice(1).forEach(p => ctx.lineTo(p[0],p[1]));
        ctx.strokeStyle=sc; ctx.lineWidth=lw; ctx.shadowColor=sh; ctx.shadowBlur=sb;
        ctx.stroke(); ctx.restore();
      });
    }
    function tick() {
      if (!on) return; rs(); ctx.clearRect(0,0,cv.width,cv.height); f++;
      if (f%9 === 0) { bolts.push(spawn()); if (Math.random() > .55) bolts.push(spawn()); }
      bolts = bolts.filter(b => b.life > 0);
      bolts.forEach(b => { draw(b); b.life -= b.decay; });
      raf = requestAnimationFrame(tick);
    }
    btn.addEventListener('mouseenter', () => { on=true; rs(); bolts=[]; f=0; if (!raf) raf=requestAnimationFrame(tick); });
    btn.addEventListener('mouseleave', () => { on=false; if(raf){cancelAnimationFrame(raf);raf=null;} ctx.clearRect(0,0,cv.width,cv.height); });
  })();

  /* ── Apply electric lightning to ALL site buttons ── */
  (function applyGlobalElectric() {
    const BTN_SEL = [
  '.btn-primary', '.btn-outline-dark', '.btn-outline-white',
  '.btn-apply', '.btn-cta-white', '.btn-cta-filled', '.btn-learn',
  '.hero-cta', '.intro-cta', '.network-cta', '.section-cta',
  '.challenge-cta', 'a.btn-tickets', 'button.btn-tickets', '.btn-get-pass',
  '.showcase-cta-btn',
  '[class*="btn-"]:not(.req-btn):not(.faq-q-btn):not(.nav-search):not(.showcase-detail-back):not(.speaker-detail-back)'
].join(',');

    function makeElectric(btn) {
      if (btn.dataset.electricDone) return;
      if (btn.closest('#main-nav')) return;
      btn.dataset.electricDone = '1';
      const cv = document.createElement('canvas');
      cv.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
      btn.appendChild(cv);
      const ctx = cv.getContext('2d');
      let raf = null, on = false, bolts = [], f = 0;
      function rs() { cv.width = btn.offsetWidth; cv.height = btn.offsetHeight; }
      function seg(x1,y1,x2,y2,r,d) {
        if (d<=0) return [[x1,y1],[x2,y2]];
        const mx=(x1+x2)/2+(Math.random()-.5)*r, my=(y1+y2)/2+(Math.random()-.5)*r*.4;
        return [...seg(x1,y1,mx,my,r*.55,d-1), ...seg(mx,my,x2,y2,r*.55,d-1).slice(1)];
      }
      function spawn() {
        const W=cv.width, H=cv.height;
        return { pts:seg(W*(.1+Math.random()*.8),0,W*(.1+Math.random()*.8),H,W*.28,4),
                 life:1, decay:.08+Math.random()*.06, w:.7+Math.random()*.9 };
      }
      function draw(b) {
        const a = Math.max(0,b.life);
        [[b.w*5,`rgba(60,120,255,${a*.28})`,'rgba(60,140,255,.7)',12],
         [b.w*.7,`rgba(200,230,255,${a*.8})`,'rgba(180,220,255,.9)',4]]
        .forEach(([lw,sc,sh,sb]) => {
          ctx.save(); ctx.beginPath(); ctx.moveTo(b.pts[0][0],b.pts[0][1]);
          b.pts.slice(1).forEach(p => ctx.lineTo(p[0],p[1]));
          ctx.strokeStyle=sc; ctx.lineWidth=lw; ctx.shadowColor=sh; ctx.shadowBlur=sb;
          ctx.stroke(); ctx.restore();
        });
      }
      function tick() {
        if (!on) return; rs(); ctx.clearRect(0,0,cv.width,cv.height); f++;
        if (f%9===0) { bolts.push(spawn()); if(Math.random()>.55) bolts.push(spawn()); }
        bolts = bolts.filter(b=>b.life>0);
        bolts.forEach(b=>{ draw(b); b.life-=b.decay; });
        raf = requestAnimationFrame(tick);
      }
      btn.addEventListener('mouseenter', ()=>{ on=true; rs(); bolts=[]; f=0; if(!raf) raf=requestAnimationFrame(tick); });
      btn.addEventListener('mouseleave', ()=>{ on=false; if(raf){cancelAnimationFrame(raf);raf=null;} ctx.clearRect(0,0,cv.width,cv.height); });
    }

    function attachAll() {
      try { document.querySelectorAll(BTN_SEL).forEach(makeElectric); } catch(e) {}
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachAll);
    else attachAll();
    setTimeout(attachAll, 600);
    setTimeout(attachAll, 1800);
  })();

})();