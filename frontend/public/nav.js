/**
 * Fak'ugesi Main Navigation v8
 * – Nav links centred in page
 * – Search icon before GET TICKETS (right side)
 * – GET TICKETS: square corners, electric effect
 * – Sets --home-left CSS var = left edge of "Home" text, used by page sections
 */
(function () {
  const path = window.location.pathname;
  const page = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';
  function isActive(href) {
    return page === href.replace(/^\//, '').replace(/\.html$/, '');
  }

  const STAR = `<svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" fill="rgba(255,255,255,0.9)"/></svg>`;

  document.head.insertAdjacentHTML('beforeend', `<style>
    #main-nav {
      position:fixed; top:0; left:0; right:0; z-index:1000;
      display:flex; align-items:center; height:58px;
      background:transparent; border-bottom:1px solid transparent;
      font-family:'InterDisplay',sans-serif;
      transition:background .35s,box-shadow .35s,border-color .35s;
    }
    #main-nav.scrolled {
      background:rgba(10,18,48,0.93);
      backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
      border-bottom:1px solid rgba(255,255,255,0.07);
      box-shadow:0 2px 32px rgba(0,0,0,0.18);
    }
    #main-nav .nav-centre {
      flex:1; display:flex; justify-content:center; align-items:center; position:relative;
    }
    #main-nav .nav-links {
      display:flex; align-items:center; list-style:none; margin:0; padding:0;
    }
    #main-nav .nav-links>li { position:relative; }
    #main-nav .nav-links>li>a,
    #main-nav .nav-links>li>span {
      color:rgba(255,255,255,0.82); font-size:13px; font-weight:500;
      letter-spacing:.01em; text-decoration:none; line-height:58px;
      white-space:nowrap; transition:color .2s; display:block; padding:0 20px; cursor:pointer;
    }
    #main-nav .nav-links>li>a:hover,
    #main-nav .nav-links>li>span:hover { color:#fff; }
    #main-nav .nav-links>li>a.active,
    #main-nav .nav-links>li>span.active { color:#fff; font-weight:600; }

    /* Star */
    #main-nav-star {
      position:absolute; top:6px; pointer-events:none; z-index:20;
      transition:left .42s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes nStarFloat {
      0%,100%{transform:translateY(0) rotate(0deg) scale(1);}
      25%{transform:translateY(-4px) rotate(45deg) scale(1.2);}
      50%{transform:translateY(0) rotate(90deg) scale(1);}
      75%{transform:translateY(-3px) rotate(135deg) scale(1.1);}
    }
    @keyframes nStarBounce {
      0%{transform:translateY(0) rotate(0deg) scale(1);}
      15%{transform:translateY(-10px) rotate(90deg) scale(1.7);}
      30%{transform:translateY(0) rotate(180deg) scale(1);}
      45%{transform:translateY(-7px) rotate(270deg) scale(1.4);}
      60%{transform:translateY(0) rotate(360deg) scale(1);}
      100%{transform:translateY(0) rotate(450deg) scale(1);}
    }
    #main-nav-star.floating{animation:nStarFloat 2.4s ease-in-out infinite;}
    #main-nav-star.jumping{animation:nStarBounce .7s cubic-bezier(.4,0,.2,1) forwards!important;}

    /* Dropdown */
    #main-nav .nav-dd {
      position:absolute; top:57px; left:0; min-width:220px;
      background:rgba(10,18,48,0.97); border:1px solid rgba(255,255,255,0.1);
      backdrop-filter:blur(20px); padding:8px 0;
      opacity:0; pointer-events:none; transform:translateY(-8px);
      transition:opacity .22s,transform .22s; z-index:100;
    }
    #main-nav .nav-links>li:hover .nav-dd { opacity:1;pointer-events:auto;transform:translateY(0); }
    #main-nav .nav-dd a {
      display:block; padding:9px 20px; color:rgba(255,255,255,0.75);
      font-size:12.5px; font-weight:500; text-decoration:none;
      transition:color .18s,background .18s; line-height:1.4;
    }
    #main-nav .nav-dd a:hover{color:#fff;background:rgba(255,255,255,0.07);}

    /* Right */
    #main-nav .nav-right {
      display:flex; align-items:center; gap:16px; padding-right:32px; flex-shrink:0;
    }
    #main-nav .nav-search {
      background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.78);
      display:flex; align-items:center; padding:6px; transition:color .2s;
    }
    #main-nav .nav-search:hover{color:#fff;}
    #main-nav .nav-search svg{width:18px;height:18px;}

    /* GET TICKETS — square */
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
  </style>`);

  const links = [
    { label:'Home', href:'/index.html' },
    { label:'Festival Programme', href:'/programme.html' },
    { label:'Signature Programmes', href:'#', dd:[
      {label:'Awards',href:'/sig-awards.html'},
      {label:'Immersive Africa',href:'/sig-immersive.html'},
      {label:"Fak'ugesiPRO",href:'/sig-fakugesipro.html'},
      {label:'Jamz',href:'/sig-jamz.html'},
      {label:'Pitchathon',href:'/sig-pitchathon.html'},
      {label:'Dala Khona',href:'/sig-dalakhona.html'},
    ]},
    { label:'Discover', href:'#', dd:[{label:'About Us',href:'/about.html'}] },
  ];

  const items = links.map((l,i)=>{
    const active = isActive(l.href);
    const dd = l.dd ? `<div class="nav-dd">${l.dd.map(d=>`<a href="${d.href}">${d.label}</a>`).join('')}</div>` : '';
    if (l.dd) return `<li data-i="${i}"><span class="${active?'active':''}">${l.label} ▾</span>${dd}</li>`;
    return `<li data-i="${i}"><a href="${l.href}"${active?' class="active"':''}>${l.label}</a></li>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav id="main-nav">
      <div class="nav-centre">
        <div id="main-nav-star">${STAR}</div>
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

  const nav    = document.getElementById('main-nav');
  const star   = document.getElementById('main-nav-star');
  const list   = document.getElementById('nav-list');
  const centre = nav.querySelector('.nav-centre');

  function setHomeLeft() {
    const homeEl = list.querySelector('li:first-child a, li:first-child span');
    if (!homeEl) return;
    const r = homeEl.getBoundingClientRect();
    // text starts at r.left + 20px padding
    document.documentElement.style.setProperty('--home-left', (r.left + 20) + 'px');
  }

  function posStar(el) {
    const cr = centre.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    star.style.left = (er.right - cr.left - 6) + 'px';
  }
  function floatStar() { star.classList.remove('jumping'); star.classList.add('floating'); }
  function pauseStar() { star.classList.remove('floating','jumping'); }
  function bounceStar() {
    star.classList.remove('floating','jumping'); void star.offsetWidth;
    star.classList.add('jumping');
    star.addEventListener('animationend',()=>{ star.classList.remove('jumping'); floatStar(); },{once:true});
  }
  function init() {
    const a = list.querySelector('a.active,span.active') || list.querySelector('a,span');
    if (a) { posStar(a); floatStar(); }
    setHomeLeft();
  }

  list.querySelectorAll('li').forEach(li=>{
    const el = li.querySelector('a')||li.querySelector('span');
    if (!el) return;
    li.addEventListener('mouseenter',()=>{ pauseStar(); posStar(el); });
    li.addEventListener('mouseleave',()=>{
      const a=list.querySelector('a.active,span.active')||list.querySelector('a,span');
      if(a){posStar(a);floatStar();}
    });
    li.addEventListener('click',()=>{
      if(el.tagName==='A'){
        list.querySelectorAll('a,span').forEach(x=>x.classList.remove('active'));
        el.classList.add('active'); posStar(el); bounceStar();
      }
    });
  });

  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
  nav.classList.toggle('scrolled',scrollY>40);
  requestAnimationFrame(()=>requestAnimationFrame(init));
  window.addEventListener('resize',init);

  // Electric on GET TICKETS
  (function(){
    const btn=document.getElementById('nav-tickets');
    const cv=document.getElementById('nav-bolt-canvas');
    if(!btn||!cv) return;
    const ctx=cv.getContext('2d');
    let raf=null,on=false,bolts=[],f=0;
    function rs(){cv.width=btn.offsetWidth;cv.height=btn.offsetHeight;}
    function seg(x1,y1,x2,y2,r,d){
      if(d<=0)return[[x1,y1],[x2,y2]];
      const mx=(x1+x2)/2+(Math.random()-.5)*r, my=(y1+y2)/2+(Math.random()-.5)*r*.4;
      return[...seg(x1,y1,mx,my,r*.55,d-1),...seg(mx,my,x2,y2,r*.55,d-1).slice(1)];
    }
    function spawn(){
      const W=cv.width,H=cv.height;
      return{pts:seg(W*(.1+Math.random()*.8),0,W*(.1+Math.random()*.8),H,W*.28,4),
             life:1,decay:.08+Math.random()*.06,w:.7+Math.random()*.9};
    }
    function draw(b){
      const a=Math.max(0,b.life);
      [
        [b.w*5,`rgba(60,120,255,${a*.28})`,'rgba(60,140,255,.7)',12],
        [b.w*.7,`rgba(200,230,255,${a*.8})`,'rgba(180,220,255,.9)',4]
      ].forEach(([lw,sc,sh,sb])=>{
        ctx.save();ctx.beginPath();ctx.moveTo(b.pts[0][0],b.pts[0][1]);
        b.pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));
        ctx.strokeStyle=sc;ctx.lineWidth=lw;ctx.shadowColor=sh;ctx.shadowBlur=sb;
        ctx.stroke();ctx.restore();
      });
    }
    function tick(){
      if(!on)return;rs();ctx.clearRect(0,0,cv.width,cv.height);f++;
      if(f%9===0){bolts.push(spawn());if(Math.random()>.55)bolts.push(spawn());}
      bolts=bolts.filter(b=>b.life>0);bolts.forEach(b=>{draw(b);b.life-=b.decay;});
      raf=requestAnimationFrame(tick);
    }
    btn.addEventListener('mouseenter',()=>{on=true;rs();bolts=[];f=0;if(!raf)raf=requestAnimationFrame(tick);});
    btn.addEventListener('mouseleave',()=>{on=false;if(raf){cancelAnimationFrame(raf);raf=null;}ctx.clearRect(0,0,cv.width,cv.height);});
  })();
})();