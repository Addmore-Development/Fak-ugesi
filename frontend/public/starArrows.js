/* starArrows.js — v4 */
(function(){

var css = `
@keyframes starSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

@keyframes babyFly {
  0%   { transform:translate(-50%,-50%) translate(0,0) scale(1.2); opacity:1; }
  100% { transform:translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(0); opacity:0; }
}

@keyframes arrExit {
  0%   { transform:translate(-50%,-50%); opacity:1; }
  100% { transform:translate(200%,-50%); opacity:0; }
}

@keyframes arrEnter {
  0%   { transform:translate(-200%,-50%); opacity:0; }
  100% { transform:translate(-50%,-50%);  opacity:1; }
}

@keyframes boltAppear {
  0%   { opacity:0; transform:scale(0.5) rotate(-10deg); }
  30%  { opacity:1; transform:scale(1.15) rotate(2deg); }
  55%  { opacity:1; transform:scale(1) rotate(0deg); }
  100% { opacity:0; transform:scale(1.3) rotate(0deg); }
}

@keyframes btnFlash {
  0%   { opacity:0; }
  25%  { opacity:1; }
  100% { opacity:0; }
}

@keyframes sparkFly {
  0%   { transform:translate(-50%,-50%) translate(0,0) scale(1); opacity:1; }
  100% { transform:translate(-50%,-50%) translate(var(--tx),var(--ty)) scale(0); opacity:0; }
}

.fug-star { display:inline-block; position:absolute; pointer-events:auto !important; cursor:pointer; }
.fug-star svg { display:block; animation:starSpin 12s linear infinite; transform-origin:center; overflow:visible; }
.fug-star:hover svg { animation-duration:0.5s !important; }
.fug-baby { position:absolute; border-radius:50%; pointer-events:none; animation:babyFly 0.6s ease-out forwards; }

.arrow-btn { position:relative !important; overflow:visible !important; }
.arrow-btn .arr-icon {
  position:absolute !important; top:50% !important; left:50% !important;
  transform:translate(-50%,-50%); z-index:3; fill:none; stroke-width:2; transition:none !important;
}
.arrow-btn.fug-exit .arr-icon  { animation:arrExit  0.3s cubic-bezier(0.77,0,0.175,1) forwards; }
.fug-arr-clone {
  position:absolute; top:50%; left:50%;
  transform:translate(-200%,-50%); opacity:0;
  z-index:3; pointer-events:none; fill:none; stroke-width:2; transition:none;
}
.arrow-btn.fug-enter .fug-arr-clone { animation:arrEnter 0.3s cubic-bezier(0.77,0,0.175,1) forwards; }
.arrow-btn.fug-resting .arr-icon    { opacity:0 !important; }
.arrow-btn.fug-resting .fug-arr-clone { transform:translate(-50%,-50%); opacity:1; }

.fug-bolt-stand {
  position:absolute; top:50%; right:8px;
  transform:translateY(-50%);
  z-index:2; pointer-events:none;
  opacity:0.9;
}

.fug-bolt-boom {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  z-index:5; pointer-events:none; opacity:0;
}
.fug-bolt-boom.active { animation:boltAppear 0.5s ease-out forwards; }

.fug-flash { position:absolute; inset:-2px; z-index:1; pointer-events:none; opacity:0; border-radius:3px; }
.fug-flash.active { animation:btnFlash 0.45s ease-out forwards; }

.fug-spark {
  position:absolute; border-radius:50%; pointer-events:none; z-index:10;
  animation:sparkFly var(--dur,0.5s) ease-out forwards;
}
`;

var st=document.createElement('style');
st.textContent=css;
document.head.appendChild(st);

var COLORS=['#ff2200','#ff7700','#ffee00','#d4e600','#00ff88','#00aaff','#cc00ff','#ffffff','#ff44cc','#44ffff'];

/* ── BOLT SVG — matches the chunky image shape ── */
function makeBoltSVG(w, h, color, glowColor) {
  color = color || '#ffffff';
  glowColor = glowColor || '#d4e600';
  var ns='http://www.w3.org/2000/svg';
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('width',w);
  svg.setAttribute('height',h);
  svg.setAttribute('viewBox','0 0 40 60');
  svg.style.overflow='visible';
  svg.style.display='block';

  var defs=document.createElementNS(ns,'defs');
  defs.innerHTML=`
    <filter id="bgl_${w}" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
  svg.appendChild(defs);

  // Chunky lightning bolt path — top-right corner, notch left, notch right, bottom point
  // Matches the bold filled bolt in the reference image
  var path = 'M28,2 L10,26 L18,26 L12,58 L30,30 L22,30 Z';

  // glow
  var glow=document.createElementNS(ns,'path');
  glow.setAttribute('d',path);
  glow.setAttribute('fill',glowColor);
  glow.setAttribute('opacity','0.4');
  glow.setAttribute('filter','url(#bgl_'+w+')');
  svg.appendChild(glow);

  // main fill
  var main=document.createElementNS(ns,'path');
  main.setAttribute('d',path);
  main.setAttribute('fill',color);
  main.setAttribute('opacity','1');
  svg.appendChild(main);

  return svg;
}

/* ── EXPLOSION ── */
function explode(btn){
  for(var i=0;i<22;i++){(function(i){
    var sp=document.createElement('span');
    sp.className='fug-spark';
    var a=(i/22)*Math.PI*2+(Math.random()-0.5)*0.5;
    var dist=30+Math.random()*55;
    var tx=(Math.cos(a)*dist).toFixed(1);
    var ty=(Math.sin(a)*dist).toFixed(1);
    var sz=3+Math.random()*8;
    var color=COLORS[Math.floor(Math.random()*COLORS.length)];
    var dur=(0.3+Math.random()*0.4).toFixed(2);
    sp.style.cssText='width:'+sz+'px;height:'+sz+'px;background:'+color+
      ';box-shadow:0 0 10px 4px '+color+';top:50%;left:50%;--tx:'+tx+'px;--ty:'+ty+'px;--dur:'+dur+'s;';
    btn.appendChild(sp);
    sp.addEventListener('animationend',function(){sp.remove();});
  })(i);}
}

/* ── UPGRADE ARROWS ── */
function upgradeArrows(){
  document.querySelectorAll('.arrow-btn').forEach(function(btn){
    if(btn.dataset.fugDone) return;
    btn.dataset.fugDone='1';

    var orig=btn.querySelector('.arr-icon');
    if(!orig) return;

    var isDark=btn.classList.contains('dark');
    var sN=isDark?'#000':'#fff';
    var sH=isDark?'#fff':'#000';
    orig.style.stroke=sN;
    orig.style.transition='none';

    // clone
    var clone=document.createElementNS('http://www.w3.org/2000/svg','svg');
    clone.classList.add('fug-arr-clone');
    clone.setAttribute('viewBox','0 0 24 24');
    clone.setAttribute('width',orig.getAttribute('width')||orig.style.width||'22');
    clone.setAttribute('height',orig.getAttribute('height')||orig.style.height||'22');
    clone.style.stroke=sN;
    clone.innerHTML=orig.innerHTML;
    btn.appendChild(clone);

    // standing bolt (always visible in button)
    var bh=btn.offsetHeight||52;
    var boltStand=document.createElement('span');
    boltStand.className='fug-bolt-stand';
    var boltColor=isDark?'#333':'rgba(255,255,255,0.85)';
    var glowColor=isDark?'#ffee00':'#d4e600';
    boltStand.appendChild(makeBoltSVG(14, bh*0.7, boltColor, glowColor));
    btn.appendChild(boltStand);

    // boom bolt (big, appears on crash)
    var boltBoom=document.createElement('span');
    boltBoom.className='fug-bolt-boom';
    boltBoom.appendChild(makeBoltSVG(30, bh*1.1, '#ffee00', '#ff7700'));
    btn.appendChild(boltBoom);

    // flash
    var flash=document.createElement('span');
    flash.className='fug-flash';
    btn.appendChild(flash);

    var busy=false;

    function runCrash(){
      // show boom bolt
      boltBoom.classList.remove('active');
      void boltBoom.offsetWidth;
      boltBoom.classList.add('active');

      // flash
      flash.style.background=COLORS[Math.floor(Math.random()*5)];
      flash.classList.remove('active');
      void flash.offsetWidth;
      flash.classList.add('active');

      // sparks
      explode(btn);

      // cleanup
      boltBoom.addEventListener('animationend',function(){
        boltBoom.classList.remove('active');
        flash.classList.remove('active');
      },{once:true});
    }

    btn.addEventListener('mouseenter',function(){
      if(busy) return;
      busy=true;

      // update stroke for hover bg colour
      orig.style.stroke=sH;
      clone.style.stroke=sH;

      // 1. arrow exits right
      btn.classList.remove('fug-resting','fug-enter');
      btn.classList.add('fug-exit');

      // 2. crash at ~280ms (arrow has exited)
      setTimeout(function(){
        runCrash();
        // 3. fresh arrow enters from left
        btn.classList.remove('fug-exit');
        btn.classList.add('fug-enter');
        setTimeout(function(){
          btn.classList.remove('fug-enter');
          btn.classList.add('fug-resting');
          busy=false;
        },320);
      },280);
    });

    btn.addEventListener('mouseleave',function(){
      orig.style.stroke=sN;
      clone.style.stroke=sN;
      if(!busy){
        btn.classList.remove('fug-resting','fug-enter','fug-exit');
      }
    });
  });
}

/* ── STAR ── */
function makeStar(size,color){
  var wrap=document.createElement('span');
  wrap.className='fug-star';
  wrap.style.width=size+'px';
  wrap.style.height=size+'px';

  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','-12 -12 24 24');
  svg.setAttribute('width',size);
  svg.setAttribute('height',size);
  svg.style.overflow='visible';

  var poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');
  poly.setAttribute('points','0,-10 1.5,-1.5 10,0 1.5,1.5 0,10 -1.5,1.5 -10,0 -1.5,-1.5');
  poly.setAttribute('fill',color);
  svg.appendChild(poly);

  var dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
  dot.setAttribute('r','1.8');
  dot.setAttribute('fill',color);
  svg.appendChild(dot);
  wrap.appendChild(svg);

  function burst(){
    for(var i=0;i<8;i++){(function(i){
      var b=document.createElement('span');
      b.className='fug-baby';
      var a=(i/8)*Math.PI*2;
      var d=18+Math.random()*18;
      var sz=2+Math.random()*3;
      var c=COLORS[Math.floor(Math.random()*COLORS.length)];
      b.style.cssText='width:'+sz+'px;height:'+sz+'px;background:'+c+
        ';box-shadow:0 0 5px 2px '+c+';top:50%;left:50%;'+
        '--tx:'+(Math.cos(a)*d).toFixed(1)+'px;--ty:'+(Math.sin(a)*d).toFixed(1)+'px;';
      wrap.appendChild(b);
      b.addEventListener('animationend',function(){b.remove();});
    })(i);}
  }

  // HOVER bursts baby stars
  wrap.addEventListener('mouseenter',function(){ burst(); });

  // auto burst every 3-5s
  (function loop(){
    var delay=3000+Math.random()*2000;
    setTimeout(function(){ burst(); loop(); }, delay);
  })();

  return wrap;
}

/* ── REPLACE CROSSHAIRS ── */
function upgradeStars(){
  document.querySelectorAll('.nav-plus').forEach(function(el){
    var s=makeStar(18,'rgba(255,255,255,0.85)');
    s.style.position='relative';s.style.display='inline-block';s.style.verticalAlign='middle';
    el.replaceWith(s);
  });
  document.querySelectorAll('.crosshair').forEach(function(el){
    var s=makeStar(20,'rgba(255,255,255,0.65)');
    s.style.top=el.style.top||'';s.style.bottom=el.style.bottom||'';
    s.style.left=el.style.left||'';s.style.right=el.style.right||'';
    s.style.zIndex=el.style.zIndex||'2';
    el.replaceWith(s);
  });
  document.querySelectorAll('.section-crosshairs span').forEach(function(el){
    var dark=el.closest('.section-crosshairs.dark');
    var c=dark?'rgba(0,0,0,0.55)':'rgba(255,255,255,0.55)';
    var s=makeStar(16,c);
    s.style.position='relative';s.style.display='inline-block';
    el.replaceWith(s);
  });
  document.querySelectorAll('.footer-crosshairs span').forEach(function(el){
    var s=makeStar(16,'rgba(0,0,0,0.45)');
    s.style.position='relative';s.style.display='inline-block';
    el.replaceWith(s);
  });
}

function init(){ upgradeStars(); upgradeArrows(); }
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{ init(); }

})();