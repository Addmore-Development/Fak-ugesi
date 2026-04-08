/**
 * Fak'ugesi Global Effects v7
 * NEW:
 * - Card flip (inv-card, winner-card, prog-card etc) showing fun facts on back
 * - Hero title letter-by-letter drop-in + bounce
 * - Noodle/liquid text effect on section headings hover
 * - Plus signs in section dividers spin 360° + shoot baby pluses on hover
 * - Arrow buttons: crash animation loop
 * - Clear white ripples (not on index hero)
 */
(function () {
  'use strict';

  /* ─── SHARED CSS ─── */
  const CSS = `
    /* Arrow btn */
    .star-marker { display:inline-flex;align-items:center;justify-content:center;position:relative;cursor:default;line-height:1; }
    .star-marker svg{display:block;overflow:visible;}
    .star-marker:hover svg{animation:starSpin .65s cubic-bezier(.4,0,.2,1) forwards;}
    @keyframes starSpin{0%{transform:rotate(0deg) scale(1);}50%{transform:rotate(180deg) scale(1.5);}100%{transform:rotate(360deg) scale(1);}}
    .arrow-btn{display:inline-flex!important;align-items:center;justify-content:center;position:relative;overflow:hidden!important;cursor:pointer;text-decoration:none;transition:border-color .2s;}
    .arrow-btn canvas.fug-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;}
    .arrow-btn .arr-icon{opacity:0!important;}
    #global-ripple-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99990;}

    /* Section dividers */
    .zip-curtain-left,.zip-curtain-right{transition:transform 0.45s cubic-bezier(0.4,0,0.2,1)!important;}
    .winners-revealed{transition:opacity 0.3s ease 0.42s!important;}
    .section-divider-line{display:flex;align-items:center;gap:14px;padding:18px 40px;position:relative;z-index:2;}
    .section-divider-rule{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);}
    .light-section .section-divider-rule{background:linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent);}
    .divider-plus{cursor:pointer;display:inline-block;user-select:none;font-size:18px;font-weight:300;line-height:1;transition:color .2s;}
    .divider-plus:hover{color:#e05a1e!important;}
    @keyframes divPlusSpin{0%{transform:rotate(0deg) scale(1);}45%{transform:rotate(210deg) scale(1.6);}100%{transform:rotate(360deg) scale(1);}}
    .div-plus-spinning{animation:divPlusSpin .5s cubic-bezier(.4,0,.2,1) forwards!important;}
    .fug-baby-plus2{position:fixed;pointer-events:none;z-index:99999;font-weight:700;line-height:1;transform:translate(-50%,-50%);transition:transform .5s ease-out,opacity .5s ease-out;}

    /* ── CARD FLIP ── */
    .inv-card,.flip-card-outer{perspective:900px;}
    .inv-card{
      border:1px solid rgba(255,255,255,0.45);
      position:relative;backdrop-filter:blur(2px);
      aspect-ratio:1/1.05;
      cursor:default;
    }
    .inv-card-inner{
      position:relative;width:100%;height:100%;
      transform-style:preserve-3d;
      transition:transform 0.65s cubic-bezier(.4,0,.2,1);
    }
    .inv-card:hover .inv-card-inner{transform:rotateY(180deg);}
    .inv-card-front,.inv-card-back{
      position:absolute;inset:0;
      backface-visibility:hidden;-webkit-backface-visibility:hidden;
      display:flex;flex-direction:column;
      padding:22px 20px 20px;
    }
    .inv-card-back{
      transform:rotateY(180deg);
      background:rgba(255,255,255,0.12);
      backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,0.5);
      display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:12px;
    }
    .card-fact-label{font-size:9px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.6;font-family:'InterDisplay',sans-serif;}
    .card-fact-text{font-size:15px;font-weight:600;line-height:1.45;font-family:'InterDisplay',sans-serif;color:#fff;}
    .card-fact-sub{font-size:11px;line-height:1.6;opacity:0.78;font-family:'InterDisplay',sans-serif;}

    /* generic flip for other pages */
    .flip-card-outer{display:inline-block;width:100%;height:100%;}
    .flip-card-inner2{width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.65s cubic-bezier(.4,0,.2,1);position:relative;}
    .flip-card-outer:hover .flip-card-inner2{transform:rotateY(180deg);}
    .flip-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;}
    .flip-face-back{transform:rotateY(180deg);background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);display:flex;flex-direction:column;justify-content:center;padding:20px;gap:10px;}

    /* ── HERO LETTER DROP ── */
    .hero-letter{
      display:inline-block;
      opacity:0;
      transform:translateY(-40px);
      animation:letterDrop 0.45s cubic-bezier(.4,0,.2,1) forwards;
    }
    @keyframes letterDrop{
      0%{opacity:0;transform:translateY(-42px);}
      70%{opacity:1;transform:translateY(4px);}
      100%{opacity:1;transform:translateY(0);}
    }
    .hero-letter.bouncing{
      animation:letterBounce 0.55s cubic-bezier(.4,0,.2,1) forwards;
    }
    @keyframes letterBounce{
      0%{transform:translateY(0);}
      30%{transform:translateY(-12px);}
      55%{transform:translateY(3px);}
      75%{transform:translateY(-5px);}
      90%{transform:translateY(1px);}
      100%{transform:translateY(0);}
    }
    /* Bounce triggered on hover of hero-title */
    .hero-title:hover .hero-letter{animation:letterBounce 0.55s cubic-bezier(.4,0,.2,1) forwards;}

    /* ── NOODLE TEXT ── */
    .noodle-word{display:inline-block;transition:none;cursor:default;}
    .noodle-letter{display:inline-block;transition:transform 0.18s ease, filter 0.18s ease;}
    @keyframes noodleWave{
      0%  {transform:translateY(0)   rotate(0deg)   scaleX(1);}
      20% {transform:translateY(-8px) rotate(-6deg)  scaleX(1.12);}
      40% {transform:translateY(6px)  rotate(4deg)   scaleX(0.88);}
      60% {transform:translateY(-5px) rotate(-3deg)  scaleX(1.08);}
      80% {transform:translateY(3px)  rotate(2deg)   scaleX(0.95);}
      100%{transform:translateY(0)   rotate(0deg)   scaleX(1);}
    }
    .noodle-letter.noodling{
      animation:noodleWave 0.7s ease forwards;
      filter:blur(0.4px);
      color:inherit;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ═══════════════════════════════════════
     CARD FLIP — fun facts data
  ═══════════════════════════════════════ */
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
    // Grab existing children
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
    // Also wrap any winner-card, prog-card, cat-card with generic flip
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

  /* ═══════════════════════════════════════
     HERO LETTER DROP
  ═══════════════════════════════════════ */
  function initHeroLetterDrop() {
    const heroTitle = document.querySelector('.hero-title, .hero-head, .ia-hero-title, .awards-hero-title');
    if (!heroTitle || heroTitle.dataset.letterDone) return;
    heroTitle.dataset.letterDone = '1';

    // Split into letter spans, preserve <br>
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

    // After all letters land, trigger bounce on each letter
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

  /* ═══════════════════════════════════════
     NOODLE TEXT
  ═══════════════════════════════════════ */
  const NOODLE_SELECTORS = [
    '.theme-year','.theme-head',
    '.involved-title','.spotlight-title','.happening-title','.partners-title',
    '.spotlight-head','.ia-section-title','.awards-section-title',
    '.cat-name','.ticket-title','.team-name','.edition-name',
    'h2:not(.hero-title):not(.hero-head)',
    'h3:not(.hero-title):not(.hero-head)',
  ].join(',');

  function wrapNoodle(el) {
    if (el.dataset.noodle || el.closest('.hero') || el.closest('.nav-links')) return;
    // Skip if it's a hero title (already letter-split)
    if (el.classList.contains('hero-title') || el.classList.contains('hero-head')) return;
    el.dataset.noodle = '1';
    el.classList.add('noodle-word');

    // Split text nodes only
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
    try {
      document.querySelectorAll(NOODLE_SELECTORS).forEach(wrapNoodle);
    } catch(e) {}
  }

  /* ═══════════════════════════════════════
     ARROW BUTTONS
  ═══════════════════════════════════════ */
  function drawBolt(ctx, cx, cy, size, color, alpha) {
    ctx.save(); ctx.globalAlpha = Math.max(0, alpha); ctx.translate(cx, cy);
    const s = size;
    ctx.beginPath();
    ctx.moveTo( s*0.28,  -s*0.52); ctx.lineTo(-s*0.08,  -s*0.04);
    ctx.lineTo( s*0.18,  -s*0.04); ctx.lineTo(-s*0.28,   s*0.52);
    ctx.lineTo( s*0.08,   s*0.04); ctx.lineTo(-s*0.18,   s*0.04);
    ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  function drawStack(ctx, cx, cy, btnH, alpha) {
    const size = btnH * 0.36, gap = size * 0.52;
    drawBolt(ctx, cx-gap, cy, size, 'rgba(255,220,0,0.38)', alpha*0.75);
    drawBolt(ctx, cx+gap, cy, size, 'rgba(255,220,0,0.38)', alpha*0.75);
    drawBolt(ctx, cx,     cy, size, '#ffffff',              alpha);
  }
  function drawArrow(ctx, x, cy, alpha, color) {
    ctx.save(); ctx.globalAlpha = Math.max(0,alpha); ctx.strokeStyle=color; ctx.fillStyle=color;
    ctx.lineWidth=2; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(x-12,cy); ctx.lineTo(x+3,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+7,cy); ctx.lineTo(x-1,cy-6); ctx.lineTo(x-1,cy+6); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function initArrowBtn(btn) {
    if(btn.dataset.arrowDone) return; btn.dataset.arrowDone='1';
    const isDark = btn.classList.contains('dark');
    const arrowColor = isDark ? '#111' : '#fff';
    const canvas = document.createElement('canvas');
    canvas.className = 'fug-canvas'; btn.insertBefore(canvas, btn.firstChild);
    const origIcon = btn.querySelector('.arr-icon');
    if(origIcon) origIcon.style.cssText='opacity:0!important;';
    const ctx = canvas.getContext('2d');
    let W=0,H=0;
    function resize(){ W=canvas.width=btn.offsetWidth||120; H=canvas.height=btn.offsetHeight||52; }
    resize();
    const STACK_X=()=>W*0.72, ARROW_X0=()=>W*0.22+12;
    let phase='idle',arrowX=0,enterX=0,raf=null,hovering=false,flashA=0,shakeT=0,parts=[];
    function boom(x){flashA=1;shakeT=10;for(let i=0;i<22;i++){const a=(i/22)*Math.PI*2,spd=1.5+Math.random()*3.5;parts.push({x,y:H/2,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:1,r:1.5+Math.random()*3,col:['#ffe600','#fff','#d4e600','#ffaa00'][Math.floor(Math.random()*4)]});}}
    function drawIdle(){resize();ctx.clearRect(0,0,W,H);drawStack(ctx,STACK_X(),H/2,H,0.55);drawArrow(ctx,ARROW_X0(),H/2,0.9,arrowColor);}
    function tick(){
      resize();ctx.clearRect(0,0,W,H);const sx=STACK_X(),cy=H/2;
      if(flashA>0){ctx.save();ctx.globalAlpha=flashA*0.32;ctx.fillStyle='#ffe600';ctx.fillRect(0,0,W,H);ctx.restore();flashA=Math.max(0,flashA-0.11);}
      parts=parts.filter(p=>p.life>0.02);
      parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=0.84;p.vy*=0.84;p.life-=0.055;ctx.save();ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.col;ctx.shadowColor=p.col;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(0.3,p.r*p.life),0,Math.PI*2);ctx.fill();ctx.restore();});
      const shk=shakeT>0?(Math.random()-.5)*4:0;if(shakeT>0)shakeT--;
      if(phase==='idle'){drawStack(ctx,sx+shk,cy,H,0.55);drawArrow(ctx,ARROW_X0(),cy,0.9,arrowColor);raf=null;return;}
      if(phase==='travel'){arrowX+=W*0.048;drawStack(ctx,sx+shk,cy,H,0.88);drawArrow(ctx,arrowX,cy,1,arrowColor);if(arrowX>=sx-8){boom(sx);phase='crash';}}
      else if(phase==='crash'){drawStack(ctx,sx+shk,cy,H,flashA>0.4?0.1:0.88);if(parts.length===0&&flashA<=0){enterX=-W*0.08;phase='enter';}}
      else if(phase==='enter'){enterX+=W*0.048;const stackAlpha=Math.min(0.88,enterX/(W*0.28));drawStack(ctx,sx,cy,H,Math.max(0,stackAlpha));drawArrow(ctx,enterX,cy,Math.min(1,enterX/(W*0.1)),arrowColor);if(enterX>=ARROW_X0()){if(hovering){arrowX=enterX;phase='travel';}else{phase='idle';drawIdle();raf=null;return;}}}
      raf=requestAnimationFrame(tick);
    }
    btn.addEventListener('mouseenter',()=>{hovering=true;if(phase==='idle'){arrowX=ARROW_X0();phase='travel';parts=[];flashA=0;shakeT=0;if(!raf)raf=requestAnimationFrame(tick);}});
    btn.addEventListener('mouseleave',()=>{hovering=false;});
    drawIdle();
  }
  function initAllArrows(){ document.querySelectorAll('.arrow-btn').forEach(initArrowBtn); }

  /* ═══════════════════════════════════════
     RIPPLES
  ═══════════════════════════════════════ */
  function initRipples() {
    const path=window.location.pathname;
    const isIndex=path==='/'||path.endsWith('index.html');
    const canvas=document.createElement('canvas');
    canvas.id='global-ripple-canvas'; document.body.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    let W,H;
    const resize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    resize(); window.addEventListener('resize',resize);
    const drops=[];
    function addDrop(x,y,big){const n=big?3:2;for(let i=0;i<n;i++){drops.push({x:x+(Math.random()-.5)*(big?18:5),y:y+(Math.random()-.5)*(big?5:2),r:0,a:big?.62:.42,spd:big?1.5+Math.random()*1.3:1+Math.random()*.8,delay:i*50,born:Date.now()});}}
    (function loop(){
      ctx.clearRect(0,0,W,H);const now=Date.now();
      for(let i=drops.length-1;i>=0;i--){const d=drops[i];if(now-d.born<d.delay)continue;d.r+=d.spd*1.5;d.a-=0.02;if(d.a<=0){drops.splice(i,1);continue;}
        ctx.save();ctx.globalAlpha=d.a*.5;ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(d.x,d.y,d.r*1.8,d.r*.42,0,0,Math.PI*2);ctx.stroke();ctx.restore();
        ctx.save();ctx.globalAlpha=d.a*.25;ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(d.x,d.y,d.r*.85,d.r*.2,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
      requestAnimationFrame(loop);
    })();
    function attach(el){if(isIndex&&el.closest&&el.closest('.hero'))return;if(el.dataset.ripple)return;el.dataset.ripple='1';el.addEventListener('mouseenter',()=>{const r=el.getBoundingClientRect();addDrop(r.left+r.width/2,r.top+r.height/2,true);for(let i=0;i<2;i++)setTimeout(()=>addDrop(r.left+r.width*(i+1)/3,r.top+r.height/2),i*45+15);});}
    function scan(){document.querySelectorAll('h1,h2,h3,.cat-name,.ticket-title,.spotlight-heading,.team-name,.edition-name,nav .nav-links a,.winner-card,.flip-card').forEach(el=>{if(isIndex&&el.closest&&el.closest('.hero'))return;attach(el);});}
    scan(); setInterval(scan,2000);
  }

  /* ═══════════════════════════════════════
     IMAGE ERROR FIX
  ═══════════════════════════════════════ */
  function fixImageErrors(){
    function patch(img){
      if(img.dataset.ep)return;img.dataset.ep='1';
      const inlineErr=img.getAttribute('onerror');
      if(inlineErr){img.removeAttribute('onerror');img.addEventListener('error',function handler(){img.removeEventListener('error',handler);if(!img.dataset.ef){img.dataset.ef='1';try{(new Function(inlineErr)).call(img);}catch(e){}}},{once:true});}
    }
    document.querySelectorAll('img').forEach(patch);
    new MutationObserver(muts=>{muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeName==='IMG')patch(n);if(n.querySelectorAll)n.querySelectorAll('img').forEach(patch);}));}).observe(document.body,{childList:true,subtree:true});
  }

  /* ═══════════════════════════════════════
     SECTION DIVIDERS — with spinning plus
  ═══════════════════════════════════════ */
  function shootBabyPluses2(el, colour) {
    const rect=el.getBoundingClientRect();
    const cx=rect.left+rect.width/2, cy=rect.top+rect.height/2;
    const colours=['#e05a1e','#1a2744','#4a6fa5','#ff8c42'];
    for(let i=0;i<8;i++){
      const angle=(i/8)*Math.PI*2;
      const dist=28+Math.random()*22;
      const size=9+Math.random()*7;
      const baby=document.createElement('span');
      baby.className='fug-baby-plus2';
      baby.textContent='+';
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
      // Add spin + baby plus to each divider plus
      div.querySelectorAll('.divider-plus').forEach(p=>{
        p.addEventListener('mouseenter',()=>{
          p.classList.remove('div-plus-spinning');
          void p.offsetWidth;
          p.classList.add('div-plus-spinning');
          shootBabyPluses2(p, col);
        });
        p.addEventListener('animationend',()=>p.classList.remove('div-plus-spinning'));
      });
    });
  }

  /* ═══════════════════════════════════════
     KIKK FEATURED-SPEAKERS EXPAND EFFECT
     Applied to .faq-items, .faq-list, .req-list
     Items sit collapsed side-by-side (flex row);
     hovered item expands, others compress.
  ═══════════════════════════════════════ */
  const KIKK_CSS = `
    /* ── KIKK expand rows ── */
    .kikk-expand-row {
      display: flex !important;
      flex-direction: row !important;
      gap: 0 !important;
      align-items: stretch;
      overflow: hidden;
      width: 100%;
    }
    .kikk-expand-item {
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
      position: relative;
      border-right: 1px solid rgba(0,0,0,0.1);
      transition: flex 0.52s cubic-bezier(0.4,0,0.2,1);
      cursor: pointer;
    }
    .kikk-expand-row.dark-bg .kikk-expand-item {
      border-right: 1px solid rgba(255,255,255,0.1);
    }
    .kikk-expand-item:last-child { border-right: none; }
    .kikk-expand-item.kikk-active { flex: 4 1 0; }
    .kikk-expand-item.kikk-inactive { flex: 0.5 1 0; }

    /* collapsed state: show only the number/label vertically */
    .kikk-item-collapsed {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 12px;
      height: 100%;
      min-height: 110px;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.5;
      transition: opacity 0.3s;
      white-space: nowrap;
      font-family: 'InterDisplay', sans-serif;
    }
    .kikk-expand-item.kikk-active .kikk-item-collapsed { opacity: 0; pointer-events: none; position: absolute; }
    .kikk-expand-item:not(.kikk-active) .kikk-item-expanded { opacity: 0; pointer-events: none; position: absolute; top:0; left:0; }

    /* expanded state */
    .kikk-item-expanded {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 28px 24px;
      min-height: 110px;
      height: 100%;
      opacity: 1;
      transition: opacity 0.35s ease 0.15s;
      font-family: 'InterDisplay', sans-serif;
    }
    .kikk-item-q {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 10px;
      line-height: 1.35;
    }
    .kikk-item-a {
      font-size: 12px;
      line-height: 1.7;
      opacity: 0.72;
    }
    /* dark bg variant */
    .kikk-expand-row.dark-bg .kikk-item-collapsed,
    .kikk-expand-row.dark-bg .kikk-item-q { color: #fff; }
    .kikk-expand-row.dark-bg .kikk-item-a { color: rgba(255,255,255,0.65); }
    /* light bg variant */
    .kikk-expand-row:not(.dark-bg) .kikk-item-collapsed,
    .kikk-expand-row:not(.dark-bg) .kikk-item-q { color: var(--dark-text, #0d1b3e); }
    .kikk-expand-row:not(.dark-bg) .kikk-item-a { color: var(--body-gray, #3a4060); }
  `;

  const kikkStyle = document.createElement('style');
  kikkStyle.textContent = KIKK_CSS;
  document.head.appendChild(kikkStyle);

  function buildKikkRow(container, isDark) {
    if (container.dataset.kikkDone) return;
    container.dataset.kikkDone = '1';

    // Collect items — support faq-item, faq-q-row+faq-a, req-list li
    let items = [];
    const faqItems = container.querySelectorAll(':scope > .faq-item');
    const reqItems = container.tagName === 'UL' ? container.querySelectorAll(':scope > li') : [];

    if (faqItems.length >= 2) {
      faqItems.forEach((item, i) => {
        // Extract question text
        const qEl = item.querySelector('.faq-question span:first-child, .faq-q-row .faq-q, .faq-q');
        const aEl = item.querySelector('.faq-answer, .faq-a');
        const q = qEl ? qEl.textContent.trim() : `Item ${i+1}`;
        const a = aEl ? aEl.textContent.trim() : '';
        items.push({ q, a, num: String(i+1).padStart(2,'0') });
      });
    } else if (reqItems.length >= 2) {
      reqItems.forEach((li, i) => {
        items.push({ q: li.textContent.trim(), a: '', num: String(i+1).padStart(2,'0') });
      });
    }

    if (items.length < 2) return;

    // Build new KIKK row
    const row = document.createElement('div');
    row.className = 'kikk-expand-row' + (isDark ? ' dark-bg' : '');

    items.forEach((data, i) => {
      const cell = document.createElement('div');
      cell.className = 'kikk-expand-item' + (i === 0 ? ' kikk-active' : '');

      const collapsed = document.createElement('div');
      collapsed.className = 'kikk-item-collapsed';
      collapsed.textContent = data.q.length > 22 ? data.q.slice(0,22)+'…' : data.q;

      const expanded = document.createElement('div');
      expanded.className = 'kikk-item-expanded';
      expanded.innerHTML = `<div class="kikk-item-q">${data.q}</div>${data.a ? `<div class="kikk-item-a">${data.a}</div>` : ''}`;

      cell.appendChild(collapsed);
      cell.appendChild(expanded);

      cell.addEventListener('mouseenter', () => {
        row.querySelectorAll('.kikk-expand-item').forEach(c => {
          c.classList.remove('kikk-active','kikk-inactive');
          c.classList.add('kikk-inactive');
        });
        cell.classList.remove('kikk-inactive');
        cell.classList.add('kikk-active');
      });

      row.appendChild(cell);
    });

    // Add mouseleave on row to reset to first
    row.addEventListener('mouseleave', () => {
      row.querySelectorAll('.kikk-expand-item').forEach((c, i) => {
        c.classList.remove('kikk-active','kikk-inactive');
        if (i === 0) c.classList.add('kikk-active');
      });
    });

    // Replace original container content with new row
    container.innerHTML = '';
    container.appendChild(row);
  }

  function isDarkSection(el) {
    let node = el;
    while (node && node !== document.body) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        // parse rgb
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

  function initKikkEffect() {
    // Apply to .faq-items containers
    document.querySelectorAll('.faq-items:not([data-kikkDone])').forEach(el => {
      buildKikkRow(el, isDarkSection(el));
    });
    // Apply to .faq-list containers (awards/immersive pages)
    document.querySelectorAll('.faq-list:not([data-kikkDone])').forEach(el => {
      buildKikkRow(el, isDarkSection(el));
    });
    // Apply to req-list (requirements)
    document.querySelectorAll('.req-list:not([data-kikkDone])').forEach(el => {
      buildKikkRow(el, isDarkSection(el));
    });
  }

  /* ═══════════════════════════════════════
     INIT
  ═══════════════════════════════════════ */
  function init() {
    fixImageErrors();
    initAllArrows();
    initRipples();
    addDividers();
    initCardFlips();
    initHeroLetterDrop();
    initNoodleText();
    initKikkEffect();
    setInterval(()=>{
      initAllArrows();
      initCardFlips();
      initNoodleText();
      initKikkEffect();
    }, 1800);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();