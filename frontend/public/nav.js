
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
      color:rgba(255,255,255,0.82); font-size:14px; font-weight:300;
      letter-spacing:.03em; text-decoration:none; line-height:58px;
      white-space:nowrap; transition:color .2s; display:block;
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

    /* Standard dropdown (Discover, Festival Programme) */
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
      font-size:12.5px; font-weight:400; text-decoration:none;
      transition:color .18s,background .18s; line-height:1.4;
      font-size:12.5px; font-weight:500; text-decoration:none;
      transition:background .18s; line-height:1.4;
    }
    #main-nav .nav-dd a:hover{background:rgba(255,255,255,0.07);}

    /* Right-side controls */
    #main-nav .nav-right {
      display:flex; align-items:center; gap:24px; padding-right:32px;
      flex-shrink:0; position:relative; z-index:1;
    }
    #main-nav .nav-search {
      background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.78);
      display:flex; align-items:center; padding:6px;
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

  const items = links.map((l, i) => {
    const active = isActive(l.href);
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
        <button class="nav-search" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
      <div class="nav-right">
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



})();