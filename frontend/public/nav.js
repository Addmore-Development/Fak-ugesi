/**
 * Fak'ugesi Main Navigation v11
 * – Nav gradient: dark navy at top, fades lighter toward bottom (blends with page)
 * – Removed jumping star indicator entirely
 * – Signature Programmes hover → diagonal logo strip dropdown
 * – GET TICKETS: square corners, electric effect
 */
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

    /* Scroll gradient — dark navy top, lighter/transparent bottom */
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
    #main-nav.scrolled::before {
      opacity: 1;
    }
    #main-nav.scrolled {
      box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    }

    #main-nav .nav-links-wrap {
      flex:1;
      display:flex;
      align-items:center;
      padding-left: var(--band, 248px);
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
      white-space:nowrap; transition:color .2s; display:block;
      padding:0 18px 0 0;
      cursor:pointer;
    }
    #main-nav .nav-links>li:first-child>a,
    #main-nav .nav-links>li:first-child>span { padding-left:0; }
    #main-nav .nav-links>li:not(:first-child)>a,
    #main-nav .nav-links>li:not(:first-child)>span { padding:0 20px; }
    #main-nav .nav-links>li>a:hover,
    #main-nav .nav-links>li>span:hover { color:#fff; }
    #main-nav .nav-links>li>a.active,
    #main-nav .nav-links>li>span.active { color:#fff; font-weight:600; }

    /* Standard dropdown (Discover) */
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
      display:block; padding:9px 20px; color:rgba(255,255,255,0.75);
      font-size:12.5px; font-weight:500; text-decoration:none;
      transition:color .18s,background .18s; line-height:1.4;
    }
    #main-nav .nav-dd a:hover{color:#fff;background:rgba(255,255,255,0.07);}

    /* ── SIGNATURE PROGRAMMES LOGO HOVER PANEL ── */
    .sig-logo-panel {
      position:absolute; top:57px; left:-80px;
      width:520px;
      background:transparent;
      border:none;
      padding:16px 20px 14px;
      opacity:0; pointer-events:none; transform:translateY(-10px);
      transition:opacity .25s,transform .25s; z-index:200;
    }
    #main-nav .nav-links>li:hover .sig-logo-panel {
      opacity:1; pointer-events:auto; transform:translateY(0);
    }
    .sig-logo-panel-label {
      font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
      color:rgba(255,255,255,0.35); margin-bottom:12px; display:block;
    }
    .sig-logo-grid {
      display:flex;
      flex-direction:row;
      align-items:center;
      justify-content:space-between;
      gap:6px;
    }
    .sig-logo-tile {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:6px; padding:8px 6px 6px;
      background:transparent;
      border:none;
      text-decoration:none;
      transition:transform .2s;
      flex:1;
      min-width:0;
    }
    .sig-logo-tile:hover {
      transform:translateY(-2px);
    }
    .sig-logo-tile img {
      height:20px; width:auto; max-width:70px; object-fit:contain; display:block;
    }
    .sig-logo-tile-name {
      font-size:9px; font-weight:600; color:rgba(255,255,255,0.7);
      letter-spacing:0.03em; text-align:center; line-height:1.2;
      transition:color .2s;
    }
    .sig-logo-tile:hover .sig-logo-tile-name { color:#fff; }

    /* Right-side controls */
    #main-nav .nav-right {
      display:flex; align-items:center; gap:70px; padding-right:32px;
      flex-shrink:0; position:relative; z-index:1;
    }
    #main-nav .nav-search {
      background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.78);
      display:flex; align-items:center; padding:6px; transition:color .2s;
    }
    #main-nav .nav-search:hover{color:#fff;}
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

    /* Global button electric canvas */
    .btn-primary, .btn-outline-dark, .btn-outline-white,
    .btn-apply, .btn-cta-white, .btn-cta-filled, .btn-learn,
    .hero-cta, .intro-cta, .network-cta, .section-cta,
    .challenge-cta, a.btn-tickets, button.btn-tickets, .btn-get-pass {
      position:relative !important; overflow:hidden !important;
    }
    .btn-primary canvas, .btn-outline-dark canvas, .btn-outline-white canvas,
    .btn-apply canvas, .btn-cta-white canvas, .btn-cta-filled canvas,
    .btn-learn canvas, .hero-cta canvas, .intro-cta canvas,
    .network-cta canvas, .section-cta canvas, .challenge-cta canvas,
    a.btn-tickets canvas, button.btn-tickets canvas, .btn-get-pass canvas {
      position:absolute !important; inset:0 !important;
      pointer-events:none !important; z-index:0 !important;
    }
    .btn-primary > *, .btn-outline-dark > *, .btn-outline-white > *,
    .btn-apply > *, .btn-cta-white > *, .btn-cta-filled > *,
    .btn-learn > *, .hero-cta > *, .intro-cta > *,
    .network-cta > *, .section-cta > *, .challenge-cta > *,
    a.btn-tickets > *, button.btn-tickets > *, .btn-get-pass > * {
      position:relative !important; z-index:1 !important;
    }
  </style>`);

  const links = [
    { label:'Home',                 href:'/index.html' },
    { label:'Festival Programme',   href:'/programme.html' },
    { label:'Signature Programmes', href:'#', isSig:true },
    { label:'Discover', href:'#', dd:[
      { label:'About Us', href:'/about.html' }
    ]},
  ];

  // Signature programme pages for logo hover panel
  const sigPages = [
    { label:'Awards',           href:'/sig-awards.html',      img:'images/logos/signatureProgrammes/awards_logo_light.svg',      imgStyle:'filter:brightness(0) invert(1);' },
    { label:'Dala Khona',       href:'/sig-dalakhona.html',   img:'images/logos/signatureProgrammes/dalakhona_logo_colour.svg',  imgStyle:'' },
    { label:"Fak'ugesi PRO",    href:'/sig-fakugesipro.html', img:'images/logos/signatureProgrammes/pro_logo_logo_light.svg',    imgStyle:'filter:brightness(0) invert(1);' },
    { label:'Immersive Africa', href:'/sig-immersive.html',   img:'images/logos/immersiveAfrica/digitaldome.svg',               imgStyle:'filter:brightness(0) invert(1);' },
    { label:'JAMZ',             href:'/sig-jamz.html',        img:'images/logos/signatureProgrammes/jamz_logo_colour.svg',      imgStyle:'' },
    { label:'Pitchathon',       href:'/sig-pitchathon.html',  img:'images/logos/signatureProgrammes/pitchathon_logo_light.svg', imgStyle:'filter:brightness(0) invert(1);' },
  ];

  // Build 3-column logo grid
  const logoTilesHTML = sigPages.map(p =>
    `<a class="sig-logo-tile" href="${p.href}">
      <img src="${p.img}" alt="${p.label}" style="${p.imgStyle}"/>
      <span class="sig-logo-tile-name">${p.label}</span>
    </a>`
  ).join('');

  const logoPanel = `<div class="sig-logo-panel">
    <span class="sig-logo-panel-label">Signature Programmes</span>
    <div class="sig-logo-grid">${logoTilesHTML}</div>
  </div>`;

  const items = links.map((l, i) => {
    const active = isActive(l.href);
    if (l.isSig) {
      return `<li data-i="${i}"><a href="/sig-programmes.html" class="${active ? 'active' : ''}">${l.label}</a>${logoPanel}</li>`;
    }
    if (l.dd) {
      const ddHTML = `<div class="nav-dd">${l.dd.map(d=>`<a href="${d.href}">${d.label}</a>`).join('')}</div>`;
      return `<li data-i="${i}"><span class="${active ? 'active' : ''}">${l.label} ▾</span>${ddHTML}</li>`;
    }
    return `<li data-i="${i}"><a href="${l.href}"${active ? ' class="active"' : ''}>${l.label}</a></li>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav id="main-nav">
      <div class="nav-links-wrap" id="nav-links-wrap">
        <ul class="nav-links" id="nav-list">${items}</ul>
      </div>
      <div class="nav-right">
        <button class="nav-search" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <a class="nav-tickets" id="nav-tickets" href="/tickets.html">
          <canvas id="nav-bolt-canvas"></canvas>
          <span>GET TICKETS</span>
        </a>
      </div>
    </nav>
  `);

  window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);
  }, { passive:true });
  document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);

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

  /* ── Apply electric effect to ALL site buttons ── */
  (function applyGlobalElectric() {
    const BTN_SEL = [
      '.btn-primary','.btn-outline-dark','.btn-outline-white',
      '.btn-apply','.btn-cta-white','.btn-cta-filled','.btn-learn',
      '.hero-cta','.intro-cta','.network-cta','.section-cta',
      '.challenge-cta','a.btn-tickets','button.btn-tickets','.btn-get-pass'
    ].join(',');
    function attachElectric(btn) {
      if (btn.dataset.electricDone) return;
      btn.dataset.electricDone = '1';
      const cv = document.createElement('canvas');
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
        bolts = bolts.filter(b => b.life > 0);
        bolts.forEach(b => { draw(b); b.life -= b.decay; });
        raf = requestAnimationFrame(tick);
      }
      btn.addEventListener('mouseenter', () => { on=true; rs(); bolts=[]; f=0; if(!raf) raf=requestAnimationFrame(tick); });
      btn.addEventListener('mouseleave', () => { on=false; if(raf){cancelAnimationFrame(raf);raf=null;} ctx.clearRect(0,0,cv.width,cv.height); });
    }
    function attachAll() { document.querySelectorAll(BTN_SEL).forEach(attachElectric); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachAll);
    else attachAll();
    setTimeout(attachAll, 600);
  })();

  /* ── Scroll-driven cross spin ── */
  (function () {
    let totalRotation = 0, lastScrollY = window.scrollY, rafPending = false;
    let burstScale = 1, bursting = false, scrollTimeout = null;
    const DEGREES_PER_PX = 0.45, BURST_SCALE = 2.2, BURST_DECAY = 0.07;
    function applyRotation() {
      const crosses = document.querySelectorAll('.cross-icon');
      const transform = `translateY(-50%) rotate(${totalRotation}deg) scale(${burstScale.toFixed(3)})`;
      crosses.forEach(el => { el.style.transform = transform; el.style.transition = 'none'; });
      if (burstScale > 1) { burstScale = Math.max(1, burstScale - BURST_DECAY); requestAnimationFrame(applyRotation); }
      else rafPending = false;
    }
    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      totalRotation += delta * DEGREES_PER_PX;
      if (!bursting) { burstScale = BURST_SCALE; bursting = true; }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { bursting = false; }, 150);
      if (!rafPending) { rafPending = true; requestAnimationFrame(applyRotation); }
    }, { passive:true });
  })();

})();