/**
 * Fak'ugesi Signature Programmes Sub-Navigation v8
 * – Square/rectangle corners on GET TICKETS button
 * – Electric hover effect on GET TICKETS
 * – No star indicator, no bottom border
 */
(function () {
  const path = window.location.pathname;
  const page = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';

  function isActive(href) {
    const h = href.replace(/^\//, '').replace(/\.html$/, '');
    return page === h;
  }

  const sigCSS = `
    #sig-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 160px 0 32px;
      height: 58px;
      background: transparent;
      border-bottom: 1px solid transparent;
      font-family: 'InterDisplay', sans-serif;
      transition: background 0.35s ease, box-shadow 0.35s ease;
      overflow: visible;
    }
    #sig-nav.scrolled {
      background: rgba(26, 39, 68, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid transparent;
      box-shadow: 0 2px 32px rgba(0, 0, 0, 0.12);
    }

    #sig-nav .sig-links {
      display: flex; align-items: center; gap: 28px;
      list-style: none; margin: 0; padding: 0; position: relative;
    }
    #sig-nav .sig-links li { position: relative; }
    #sig-nav .sig-links a {
      color: rgba(255, 255, 255, 0.72);
      font-size: 12.5px; font-weight: 500; letter-spacing: 0.01em;
      text-decoration: none; line-height: 58px; white-space: nowrap;
      transition: color 0.2s; display: block; padding: 0 4px;
    }
    #sig-nav .sig-links a:hover { color: #ffffff; }
    #sig-nav .sig-links a.active { color: #ffffff; font-weight: 600; }

    /* GET TICKETS — SQUARE corners */
    #sig-nav .sig-tickets {
      position: fixed; right: 32px; top: 12px;
      background: rgba(26, 55, 120, 0.85);
      color: #ffffff;
      border: 1.5px solid rgba(255,255,255,0.35);
      cursor: pointer; padding: 8px 18px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; font-family: 'InterDisplay', sans-serif;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
      border-radius: 0;
      white-space: nowrap;
      transition: background 0.22s, border-color 0.22s, transform 0.15s;
      overflow: hidden;
    }
    #sig-nav .sig-tickets:hover {
      background: #0d1b3e;
      border-color: rgba(255,220,60,0.8);
      transform: translateY(-1px);
    }
    #sig-nav .sig-tickets .sig-btn-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      border-radius: 0;
    }
    #sig-nav .sig-tickets .sig-btn-label {
      position: relative;
      z-index: 1;
    }
  `;

  const style = document.createElement('style');
  style.textContent = sigCSS;
  document.head.appendChild(style);

  const links = [
    { label: 'Home',             href: '/index.html' },
    { label: 'Awards',           href: '/sig-awards.html' },
    { label: 'Immersive Africa', href: '/sig-immersive.html' },
    { label: "Fak'ugesiPRO",     href: '/sig-fakugesipro.html' },
    { label: 'Jamz',             href: '/sig-jamz.html' },
    { label: 'Pitchathon',       href: '/sig-pitchathon.html' },
    { label: 'Dala Khona',       href: '/sig-dalakhona.html' },
  ];

  const listItems = links.map((link, i) => {
    const active = isActive(link.href);
    return `<li data-idx="${i}">
      <a href="${link.href}" ${active ? 'class="active"' : ''}>${link.label}</a>
    </li>`;
  }).join('');

  const navHTML = `
    <nav id="sig-nav">
      <ul class="sig-links" id="sig-links-list">${listItems}</ul>
      <a class="sig-tickets" id="sig-tickets-btn" href="/tickets.html">
        <canvas class="sig-btn-canvas" id="sig-lightning-canvas"></canvas>
        <span class="sig-btn-label">GET TICKETS</span>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  const sigNav       = document.getElementById('sig-nav');
  const sigLinksList = document.getElementById('sig-links-list');

  window.addEventListener('scroll',()=>{ sigNav.classList.toggle('scrolled',window.scrollY>40); },{passive:true});
  sigNav.classList.toggle('scrolled',window.scrollY>40);

  // ── Electric lightning INSIDE GET TICKETS ──
  (function(){
    const btn=document.getElementById('sig-tickets-btn');
    const canvas=document.getElementById('sig-lightning-canvas');
    if(!btn||!canvas) return;
    const ctx=canvas.getContext('2d');
    let raf=null,hovering=false,bolts=[],frameCount=0;

    function resizeCanvas(){ canvas.width=btn.offsetWidth; canvas.height=btn.offsetHeight; }
    function buildSegments(x1,y1,x2,y2,roughness,depth){
      if(depth<=0) return[[x1,y1],[x2,y2]];
      const mx=(x1+x2)/2+(Math.random()-0.5)*roughness;
      const my=(y1+y2)/2+(Math.random()-0.5)*roughness*0.5;
      return[...buildSegments(x1,y1,mx,my,roughness*0.55,depth-1),
             ...buildSegments(mx,my,x2,y2,roughness*0.55,depth-1).slice(1)];
    }
    function spawnBolt(){
      const W=canvas.width,H=canvas.height;
      const sx=W*(0.15+Math.random()*0.7),ex=W*(0.15+Math.random()*0.7);
      const pts=buildSegments(sx,0,ex,H,W*0.3,4);
      return{pts,life:1.0,decay:0.065+Math.random()*0.075,width:1.0+Math.random()*1.2};
    }
    function drawBolt(b){
      if(b.pts.length<2) return;
      const alpha=Math.max(0,b.life);
      ctx.save();ctx.beginPath();ctx.moveTo(b.pts[0][0],b.pts[0][1]);
      for(let i=1;i<b.pts.length;i++) ctx.lineTo(b.pts[i][0],b.pts[i][1]);
      ctx.strokeStyle=`rgba(80,120,255,${alpha*0.3})`;ctx.lineWidth=b.width*5;
      ctx.shadowColor='rgba(80,140,255,0.8)';ctx.shadowBlur=10;ctx.stroke();ctx.restore();
      ctx.save();ctx.beginPath();ctx.moveTo(b.pts[0][0],b.pts[0][1]);
      for(let i=1;i<b.pts.length;i++) ctx.lineTo(b.pts[i][0],b.pts[i][1]);
      ctx.strokeStyle=`rgba(140,200,255,${alpha*0.75})`;ctx.lineWidth=b.width*2;
      ctx.shadowColor='rgba(160,210,255,0.9)';ctx.shadowBlur=6;ctx.stroke();ctx.restore();
      ctx.save();ctx.beginPath();ctx.moveTo(b.pts[0][0],b.pts[0][1]);
      for(let i=1;i<b.pts.length;i++) ctx.lineTo(b.pts[i][0],b.pts[i][1]);
      ctx.strokeStyle=`rgba(255,255,255,${alpha})`;ctx.lineWidth=b.width*0.6;ctx.stroke();ctx.restore();
    }
    function tick(){
      if(!hovering) return;
      resizeCanvas();ctx.clearRect(0,0,canvas.width,canvas.height);
      frameCount++;
      if(frameCount%8===0){bolts.push(spawnBolt());if(Math.random()>0.5)bolts.push(spawnBolt());}
      bolts=bolts.filter(b=>b.life>0);
      bolts.forEach(b=>{drawBolt(b);b.life-=b.decay;});
      raf=requestAnimationFrame(tick);
    }
    btn.addEventListener('mouseenter',()=>{hovering=true;resizeCanvas();bolts=[];frameCount=0;if(!raf)raf=requestAnimationFrame(tick);});
    btn.addEventListener('mouseleave',()=>{hovering=false;if(raf){cancelAnimationFrame(raf);raf=null;}ctx.clearRect(0,0,canvas.width,canvas.height);});
  })();
})();