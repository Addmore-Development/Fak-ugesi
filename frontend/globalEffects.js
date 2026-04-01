/**
 * Fak'ugesi Global Effects v2
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
    .fakugesi-hero-badge{
      position:absolute;top:110px;right:52px;z-index:20;
      background:#fff;padding:14px 18px;line-height:1.1;
      font-family:'DM Sans','Manrope',sans-serif;
      font-weight:900;font-size:22px;letter-spacing:-.02em;
      color:#111;max-width:180px;word-break:break-word;
    }
    .fakugesi-hero-badge .badge-sub{
      display:block;font-size:13px;font-weight:900;
      letter-spacing:.04em;margin-top:4px;text-transform:uppercase;
    }
    .fakugesi-hero-badge .badge-divider{
      height:1.5px;background:#111;margin:5px 0;
    }
    .fakugesi-hero-badge .badge-red{color:#c0392b;}
    .arrow-btn{
      display:inline-flex!important;align-items:center;justify-content:center;
      position:relative;overflow:hidden;
      width:100px!important;height:52px!important;
      background:rgba(255,255,255,.06);
      border:1.5px solid rgba(255,255,255,.3);
      cursor:pointer;text-decoration:none;
      transition:border-color .2s,background .2s;
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
    .arrow-btn.kikk-active .arr-icon{opacity:0;}
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
    #global-ripple-canvas{
      position:fixed;inset:0;width:100%;height:100%;
      pointer-events:none;z-index:99990;
      mix-blend-mode:screen;opacity:.6;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ── STAR SVG ── */
  function makeStar(color) {
    return `<svg viewBox="0 0 20 20" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1 L11.8 7.5 L18.5 9 L11.8 12 L10 19 L8.2 12 L1.5 9 L8.2 7.5 Z" fill="${color||'currentColor'}"/>
    </svg>`;
  }

  /* ── BABY STARS ── */
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
    document.querySelectorAll('.crosshair,.nav-plus,.section-crosshairs span,.footer-crosshairs span,.team-crosshairs span,.partners-crosshairs span,.footer-bottom-crosshairs span').forEach(el=>{
      if(el.textContent.trim()==='+' || el.dataset.starDone) {
        if(!el.dataset.starDone) upgradePlus(el);
      }
    });
  }

  /* ── KIKK ARROW ── */
  function initKikkArrow(btn) {
    if(btn.dataset.kikkDone) return;
    btn.dataset.kikkDone='1';
    const isDark=btn.classList.contains('dark');
    const arrowColor=isDark?'#111':'#fff';
    const accentColor='#d4e600';
    const canvas=document.createElement('canvas');
    canvas.className='kikk-canvas';
    btn.insertBefore(canvas,btn.firstChild);
    let raf=null,phase='idle',arrowX=0,lightAlpha=0,lightPts=[],t=0;

    function resize(){canvas.width=btn.offsetWidth;canvas.height=btn.offsetHeight;}
    resize();

    function genLightning(W,H){
      const pts=[];
      pts.push([W*0.1,H/2]);
      for(let i=1;i<9;i++){pts.push([W*0.1+(i/9)*W*0.8,(Math.random()-.5)*H*0.8+H/2]);}
      pts.push([W*0.9,H/2]);
      return pts;
    }

    function drawArrow(ctx,x,W,H){
      const y=H/2,aw=26,ah=7;
      ctx.save();
      ctx.strokeStyle=arrowColor;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';
      ctx.beginPath();ctx.moveTo(x-aw/2,y);ctx.lineTo(x+aw/2-8,y);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+aw/2-10,y-ah);ctx.lineTo(x+aw/2,y);ctx.lineTo(x+aw/2-10,y+ah);ctx.stroke();
      ctx.restore();
    }

    function drawLightning(ctx,pts,alpha){
      if(!pts.length||alpha<=0) return;
      ctx.save();
      ctx.globalAlpha=alpha*.5;ctx.strokeStyle=accentColor;ctx.lineWidth=3;ctx.shadowBlur=14;ctx.shadowColor=accentColor;ctx.lineCap='round';
      ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
      ctx.globalAlpha=alpha;ctx.shadowBlur=0;ctx.lineWidth=1.4;
      ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
      ctx.restore();
    }

    function tick(){
      resize();
      const W=canvas.width,H=canvas.height;
      const ctx=canvas.getContext('2d');
      ctx.clearRect(0,0,W,H);t++;
      if(phase==='idle'){drawArrow(ctx,W/2,W,H);return;}
      if(phase==='travel'){
        arrowX+=W/26;
        drawArrow(ctx,arrowX,W,H);
        if(arrowX>=W/2){phase='lightning';lightPts=genLightning(W,H);lightAlpha=1;t=0;}
      } else if(phase==='lightning'){
        lightAlpha=Math.max(0,1-t/9);
        drawLightning(ctx,lightPts,lightAlpha);
        drawArrow(ctx,W/2,W,H);
        if(t>=9){phase='exit';arrowX=W/2;t=0;}
      } else if(phase==='exit'){
        arrowX+=W/18;
        drawArrow(ctx,arrowX,W,H);
        if(arrowX>W+24){arrowX=-24;phase='travel';t=0;}
      }
      raf=requestAnimationFrame(tick);
    }

    function drawIdle(){
      resize();const W=canvas.width,H=canvas.height;
      const ctx=canvas.getContext('2d');ctx.clearRect(0,0,W,H);
      drawArrow(ctx,W/2,W,H);
    }

    btn.addEventListener('mouseenter',()=>{
      btn.classList.add('kikk-active');
      if(phase==='idle'){phase='travel';arrowX=-24;t=0;}
      if(!raf) raf=requestAnimationFrame(tick);
    });
    btn.addEventListener('mouseleave',()=>{
      btn.classList.remove('kikk-active');
      phase='idle';cancelAnimationFrame(raf);raf=null;
      drawIdle();
    });
    drawIdle();
  }

  function initAllArrows(){document.querySelectorAll('.arrow-btn').forEach(initKikkArrow);}

  /* ── RIPPLE ── */
  function initRipple(){
    const canvas=document.createElement('canvas');
    canvas.id='global-ripple-canvas';
    document.body.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    let W,H;
    const resize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    resize();window.addEventListener('resize',resize);
    const drops=[];
    function addDrop(x,y){drops.push({x,y,r:0,a:.7});}
    (function loop(){
      ctx.clearRect(0,0,W,H);
      for(let i=drops.length-1;i>=0;i--){
        const d=drops[i];d.r+=1.8;d.a-=.022;
        if(d.a<=0){drops.splice(i,1);continue;}
        ctx.save();ctx.globalAlpha=d.a;ctx.strokeStyle='rgba(90,160,255,.7)';ctx.lineWidth=1.2;
        ctx.beginPath();ctx.ellipse(d.x,d.y,d.r,d.r*.32,0,0,Math.PI*2);ctx.stroke();
        ctx.globalAlpha=d.a*.35;ctx.strokeStyle='rgba(180,220,255,.8)';ctx.lineWidth=.7;
        ctx.beginPath();ctx.ellipse(d.x,d.y-d.r*.1,d.r*.28,d.r*.09,0,0,Math.PI*2);ctx.stroke();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    })();
    function attach(el){
      if(el.dataset.ripple) return;el.dataset.ripple='1';
      el.addEventListener('mouseenter',()=>{
        if(el.closest('.hero,.page-hero,.ia-hero')) return;
        const rect=el.getBoundingClientRect();
        const x=rect.left+rect.width*(.25+Math.random()*.5),y=rect.top+rect.height/2;
        addDrop(x,y);
        setTimeout(()=>addDrop(x+(Math.random()-.5)*18,y+(Math.random()-.5)*6),100);
      });
    }
    function scan(){document.querySelectorAll('h2,h3,h4,.section-title,.faq-q,.gi-card-title,.cat-name,.ticket-name,.wc-name,.spotlight-heading,.theme-heading,.happening-title,.partners-title,.venue-title,.oc-title,.premiere-title,.ia-intro-title,.team-name,.edition-name,nav .nav-links a,.ticker-item').forEach(attach);}
    scan();setInterval(scan,1800);
  }

  /* ── HERO BADGE ── */
  function injectBadge(){
    const p=window.location.pathname.toLowerCase();
    const t=document.title.toLowerCase();
    let sub='';
    if(p.includes('awards')||t.includes('awards')) sub='AWARDS';
    else if(p.includes('ticket')||t.includes('ticket')) sub='TICKETS';
    else if(p.includes('immersive')||t.includes('immersive')) sub='IMMERSIVE<br>AFRICA';
    else if(p.includes('programme')||t.includes('programme')) sub='PROGRAMME';
    const hero=document.querySelector('.page-hero,.ia-hero');
    if(!hero||hero.querySelector('.fakugesi-hero-badge,.hero-signia')) return;
    const b=document.createElement('div');
    b.className='fakugesi-hero-badge';
    b.innerHTML=`<span>FAK'</span><div class="badge-divider"></div><span class="badge-red">UGESI</span>${sub?`<span class="badge-sub">${sub}</span>`:''}`;
    hero.style.position='relative';
    hero.appendChild(b);
  }

  /* ── SECTION DIVIDERS ── */
  function addDividers(){
    const lightSecs=new Set(['spotlight-section','happening-section','who-section','editions-section','team-section','contact-section','partners-section']);
    document.querySelectorAll('.spotlight-section,.happening-section,.partners-section,.faq-section,.venue-section,.categories-section,.winners-section,.submit-section,.ia-intro,.installations-section,.who-section,.editions-section,.team-section,.contact-section').forEach(sec=>{
      if(sec.dataset.divider) return;sec.dataset.divider='1';
      const light=[...sec.classList].some(c=>lightSecs.has(c));
      sec.classList.toggle('light-section',light);
      const col=light?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.2)';
      const div=document.createElement('div');
      div.className='section-divider-line';
      div.innerHTML=`<span class="star-marker">${makeStar(col)}</span><div class="section-divider-rule"></div><span class="star-marker">${makeStar(col)}</span><div class="section-divider-rule"></div><span class="star-marker">${makeStar(col)}</span>`;
      sec.insertBefore(div,sec.firstChild);
    });
  }

  function init(){
    convertPluses();initAllArrows();initRipple();injectBadge();addDividers();
    setInterval(()=>{convertPluses();initAllArrows();},1500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();