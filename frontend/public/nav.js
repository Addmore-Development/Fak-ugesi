/**
 * Fak'ugesi Shared Nav v3
 * - Transparent background by default (no solid white)
 * - White frosted low-opacity on scroll
 * - Rounded corners on GET TICKETS button
 * - Search button removed
 * - Plus sign spins 360° and shoots baby pluses on hover
 */
(function() {
  const path = window.location.pathname;
  const page = path.replace(/^\//, '').replace(/\.html$/, '') || 'index';

  function isActive(href) {
    const h = href.replace(/^\//, '').replace(/\.html$/, '');
    if (h === 'index' && (page === '' || page === 'index')) return true;
    if (h !== 'index' && page === h) return true;
    return false;
  }

  const sigPages = ['immersiveAfrica','awards','sig-awards','sig-immersive','sig-fakugesipro','sig-jamz','sig-pitchathon','sig-dalakhona'];

  const navCSS = `
    #fug-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      padding: 0 32px; height: 58px;
      background: transparent;
      border-bottom: 1px solid transparent;
      font-family: 'InterDisplay', sans-serif;
      transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    }
    #fug-nav.scrolled {
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 2px 32px rgba(0,0,0,0.06);
    }
    #fug-nav .nav-left { display:flex; align-items:center; }
    #fug-nav .nav-plus-sym {
      color: rgba(255,255,255,0.85); font-size: 24px; font-weight: 300; line-height:1;
      cursor: pointer; display:inline-block; user-select:none;
      margin-right: 4px;
      transition: color 0.2s;
    }
    #fug-nav .nav-plus-sym:hover { color: #e05a1e; }
    @keyframes nav-plusSpin {
      0%   { transform:rotate(0deg) scale(1); }
      45%  { transform:rotate(210deg) scale(1.5); }
      100% { transform:rotate(360deg) scale(1); }
    }
    .plus-spinning { animation: nav-plusSpin 0.55s cubic-bezier(.4,0,.2,1) forwards !important; }

    #fug-nav .nav-centre { display:flex; align-items:center; justify-content:center; }
    #fug-nav .nav-links { display:flex; gap:26px; list-style:none; margin:0; padding:0; }
    #fug-nav .nav-links > li { position:relative; }
    #fug-nav .nav-links a, #fug-nav .nav-links .nav-drop-trigger {
      color:rgba(255,255,255,0.82); text-decoration:none;
      font-size:13px; font-weight:500; letter-spacing:0.01em;
      transition:color 0.2s; cursor:pointer;
      display:flex; align-items:center; gap:4px;
      background:none; border:none; padding:0; font-family:inherit;
      line-height:58px; white-space:nowrap;
    }
    #fug-nav .nav-links a:hover,
    #fug-nav .nav-links .nav-drop-trigger:hover,
    #fug-nav .nav-links a.active,
    #fug-nav .nav-links .nav-drop-trigger.active { color:#ffffff; }
    #fug-nav .nav-drop-trigger .chevron {
      display:inline-block; width:7px; height:7px;
      border-right:1.5px solid currentColor; border-bottom:1.5px solid currentColor;
      transform:rotate(45deg) translateY(-1px); transition:transform 0.2s;
    }
    #fug-nav .nav-links li.open .nav-drop-trigger .chevron { transform:rotate(-135deg) translateY(-1px); }
    #fug-nav .nav-dropdown {
      position:absolute; top:100%; left:50%;
      transform:translateX(-50%) translateY(-6px);
      background:rgba(255,255,255,0.96); border:1px solid rgba(0,0,0,0.09);
      box-shadow:0 8px 32px rgba(0,0,0,0.12);
      min-width:190px; padding:8px 0;
      opacity:0; pointer-events:none;
      transition:opacity 0.18s, transform 0.18s;
      z-index:200;
      backdrop-filter: blur(12px);
    }
    #fug-nav .nav-links li.open .nav-dropdown {
      opacity:1; pointer-events:auto;
      transform:translateX(-50%) translateY(0);
    }
    #fug-nav .nav-dropdown a {
      display:block; padding:10px 20px;
      font-size:13px; color:rgba(13,27,62,0.75);
      text-decoration:none; font-weight:500;
      transition:color 0.15s, background 0.15s;
      line-height:1.4; white-space:nowrap;
    }
    #fug-nav .nav-dropdown a:hover { color:#0d1b3e; background:rgba(0,0,0,0.04); }
    #fug-nav .nav-dropdown a.active { color:#0d1b3e; font-weight:600; }
    #fug-nav .nav-right { display:flex; align-items:center; gap:12px; justify-content:flex-end; }
    #fug-nav .nav-tickets-btn {
      background:#1a2744; color:#fff; border:none; cursor:pointer;
      padding:9px 20px; font-size:11px; font-weight:700;
      letter-spacing:0.1em; text-transform:uppercase;
      font-family:'InterDisplay',sans-serif;
      transition:background 0.22s, transform 0.15s;
      white-space:nowrap; text-decoration:none;
      display:inline-flex; align-items:center;
      border-radius: 100px;
    }
    #fug-nav .nav-tickets-btn:hover { background:#e05a1e; transform:translateY(-1px); }
    .fug-baby-plus {
      position:fixed; pointer-events:none; z-index:99999;
      font-weight:700; line-height:1;
      transform:translate(-50%,-50%);
      transition:transform 0.52s ease-out, opacity 0.52s ease-out;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = navCSS;
  document.head.appendChild(styleEl);

  const navHTML = `
  <nav id="fug-nav">
    <div class="nav-left">
      <span class="nav-plus-sym" id="nav-plus-main">+</span>
    </div>
    <div class="nav-centre">
      <ul class="nav-links">
        <li><a href="/index.html" ${isActive('index') ? 'class="active"' : ''}>Home</a></li>
        <li><a href="/programme.html" ${isActive('programme') ? 'class="active"' : ''}>Festival Programme</a></li>
        <li class="drop-li">
          <button class="nav-drop-trigger ${sigPages.includes(page) ? 'active' : ''}">Signature Programmes <span class="chevron"></span></button>
          <div class="nav-dropdown">
            <a href="/sig-awards.html"      ${isActive('sig-awards')      ? 'class="active"' : ''}>Awards</a>
            <a href="/sig-immersive.html"   ${isActive('sig-immersive')   ? 'class="active"' : ''}>Immersive Africa</a>
            <a href="/sig-fakugesipro.html" ${isActive('sig-fakugesipro') ? 'class="active"' : ''}>Fak'ugesiPRO</a>
            <a href="/sig-jamz.html"        ${isActive('sig-jamz')        ? 'class="active"' : ''}>Jamz</a>
            <a href="/sig-pitchathon.html"  ${isActive('sig-pitchathon')  ? 'class="active"' : ''}>Pitchathon</a>
            <a href="/sig-dalakhona.html"   ${isActive('sig-dalakhona')   ? 'class="active"' : ''}>Dala Khona</a>
          </div>
        </li>
        <li class="drop-li">
          <button class="nav-drop-trigger ${page === 'about' ? 'active' : ''}">Discover <span class="chevron"></span></button>
          <div class="nav-dropdown">
            <a href="/about.html" ${isActive('about') ? 'class="active"' : ''}>About Us</a>
          </div>
        </li>
      </ul>
    </div>
    <div class="nav-right">
      <a class="nav-tickets-btn" href="/tickets.html">GET TICKETS</a>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Scroll behaviour — transparent by default, frosted white on scroll
  const nav = document.getElementById('fug-nav');
  function updateNav() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Dropdown toggle
  document.querySelectorAll('#fug-nav .drop-li').forEach(li => {
    li.querySelector('.nav-drop-trigger').addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = li.classList.contains('open');
      document.querySelectorAll('#fug-nav .drop-li.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) li.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('#fug-nav .drop-li.open').forEach(o => o.classList.remove('open'));
  });

  // Plus: spin + shoot baby pluses
  const plusEl = document.getElementById('nav-plus-main');
  if (plusEl) {
    plusEl.addEventListener('mouseenter', () => {
      plusEl.classList.remove('plus-spinning');
      void plusEl.offsetWidth;
      plusEl.classList.add('plus-spinning');
      shootBabyPluses(plusEl);
    });
    plusEl.addEventListener('animationend', () => plusEl.classList.remove('plus-spinning'));
  }

  function shootBabyPluses(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colours = ['#e05a1e','#1a2744','#4a6fa5','#ff8c42','#2a3f72'];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
      const dist = 32 + Math.random() * 30;
      const size = 11 + Math.random() * 9;
      const baby = document.createElement('span');
      baby.className = 'fug-baby-plus';
      baby.textContent = '+';
      baby.style.cssText = `left:${cx}px;top:${cy}px;font-size:${size}px;color:${colours[i % colours.length]};`;
      document.body.appendChild(baby);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        baby.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) rotate(${Math.random()*360}deg) scale(0.3)`;
        baby.style.opacity = '0';
      }));
      setTimeout(() => baby.remove(), 600);
    }
  }
})();