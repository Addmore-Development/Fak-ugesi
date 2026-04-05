/**
 * Fak'ugesi Shared Nav v1
 * Injects consistent nav with Discovery dropdown across all pages
 */
(function() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  function isActive(href) {
    if (href === 'index.html' && (page === '' || page === 'index.html')) return true;
    if (href !== 'index.html' && page === href) return true;
    return false;
  }

  const navHTML = `
  <style>
    @font-face {
      font-family: 'InterDisplay';
      src: url('fonts/InterDisplay-Regular.otf') format('opentype');
      font-weight: 400; font-style: normal;
    }
    @font-face {
      font-family: 'InterDisplay';
      src: url('fonts/InterDisplay-Medium.otf') format('opentype');
      font-weight: 500; font-style: normal;
    }
    @font-face {
      font-family: 'InterDisplay';
      src: url('fonts/InterDisplay-SemiBold.otf') format('opentype');
      font-weight: 600; font-style: normal;
    }
    @font-face {
      font-family: 'InterDisplay';
      src: url('fonts/InterDisplay-Bold.otf') format('opentype');
      font-weight: 700; font-style: normal;
    }
    @font-face {
      font-family: 'DxWideground';
      src: url('fonts/DxWideground-Regular.otf') format('opentype');
      font-weight: 400; font-style: normal;
    }

    #fug-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 40px; height: 56px;
      background: rgba(13,17,23,0.92); backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-nav .nav-left {
      display: flex; align-items: center; gap: 8px;
    }
    #fug-nav .nav-plus-sym {
      color: rgba(255,255,255,0.4); font-size: 18px; font-weight: 300;
      line-height: 1; margin-right: 8px;
    }
    #fug-nav .nav-links {
      display: flex; gap: 32px; list-style: none; margin: 0; padding: 0;
    }
    #fug-nav .nav-links > li {
      position: relative;
    }
    #fug-nav .nav-links a, #fug-nav .nav-links .nav-drop-trigger {
      color: rgba(255,255,255,0.75); text-decoration: none;
      font-size: 13px; font-weight: 500; letter-spacing: 0.01em;
      transition: color 0.2s; cursor: pointer;
      display: flex; align-items: center; gap: 4px;
      background: none; border: none; padding: 0; font-family: inherit;
      line-height: 56px; white-space: nowrap;
    }
    #fug-nav .nav-links a:hover,
    #fug-nav .nav-links .nav-drop-trigger:hover,
    #fug-nav .nav-links a.active,
    #fug-nav .nav-links .nav-drop-trigger.active { color: #fff; }

    /* Dropdown chevron */
    #fug-nav .nav-drop-trigger .chevron {
      display: inline-block; width: 8px; height: 8px;
      border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor;
      transform: rotate(45deg) translateY(-1px);
      transition: transform 0.2s;
    }
    #fug-nav .nav-links li.open .nav-drop-trigger .chevron {
      transform: rotate(-135deg) translateY(-1px);
    }

    /* Dropdown panel */
    #fug-nav .nav-dropdown {
      position: absolute; top: 100%; left: 0;
      background: #0d1117; border: 1px solid rgba(255,255,255,0.1);
      min-width: 180px; padding: 8px 0;
      opacity: 0; pointer-events: none;
      transform: translateY(-6px);
      transition: opacity 0.18s, transform 0.18s;
      z-index: 200;
    }
    #fug-nav .nav-links li.open .nav-dropdown {
      opacity: 1; pointer-events: auto; transform: translateY(0);
    }
    #fug-nav .nav-dropdown a {
      display: block; padding: 10px 20px;
      font-size: 13px; color: rgba(255,255,255,0.7);
      text-decoration: none; font-weight: 500;
      transition: color 0.15s, background 0.15s;
      line-height: 1.4; white-space: nowrap;
    }
    #fug-nav .nav-dropdown a:hover { color: #fff; background: rgba(255,255,255,0.05); }
    #fug-nav .nav-dropdown a.active { color: #fff; }

    /* Right side */
    #fug-nav .nav-right {
      display: flex; align-items: center; gap: 20px;
    }
    #fug-nav .nav-search-btn {
      background: none; border: none; cursor: pointer; padding: 4px;
      color: rgba(255,255,255,0.55); transition: color 0.2s;
    }
    #fug-nav .nav-search-btn:hover { color: #fff; }
    #fug-nav .nav-ticket-btn {
      background: #fff; color: #000;
      padding: 8px 20px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.05em; text-transform: uppercase;
      text-decoration: none; border-radius: 2px;
      font-family: 'InterDisplay', sans-serif;
      transition: background 0.2s;
    }
    #fug-nav .nav-ticket-btn:hover { background: #d4e600; }
    #fug-nav .nav-right-plus {
      color: rgba(255,255,255,0.35); font-size: 18px; font-weight: 300;
    }
  </style>
  <nav id="fug-nav">
    <div class="nav-left">
      <span class="nav-plus-sym">+</span>
      <ul class="nav-links">
        <li><a href="index.html" ${isActive('index.html') ? 'class="active"' : ''}>Home</a></li>
        <li><a href="programme.html" ${isActive('programme.html') ? 'class="active"' : ''}>Festival Programme</a></li>
        <li class="drop-li">
          <button class="nav-drop-trigger ${(page==='immersiveAfrica.html'||page==='awards.html') ? 'active' : ''}">
            Signature Programmes <span class="chevron"></span>
          </button>
          <div class="nav-dropdown">
            <a href="immersiveAfrica.html" ${isActive('immersiveAfrica.html') ? 'class="active"' : ''}>Immersive Africa</a>
            <a href="awards.html" ${isActive('awards.html') ? 'class="active"' : ''}>Awards</a>
          </div>
        </li>
        <li class="drop-li">
          <button class="nav-drop-trigger ${(page==='about.html') ? 'active' : ''}">
            Discovery <span class="chevron"></span>
          </button>
          <div class="nav-dropdown">
            <a href="about.html" ${isActive('about.html') ? 'class="active"' : ''}>About Us</a>
          </div>
        </li>
        <li><a href="tickets.html" ${isActive('tickets.html') ? 'class="active"' : ''}>Tickets</a></li>
      </ul>
    </div>
    <div class="nav-right">
      <button class="nav-search-btn" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <circle cx="7.5" cy="7.5" r="5.5"/>
          <line x1="12" y1="12" x2="16" y2="16"/>
        </svg>
      </button>
      <a class="nav-ticket-btn" href="tickets.html">Get Tickets</a>
      <span class="nav-right-plus">+</span>
    </div>
  </nav>`;

  // Insert at top of body
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Dropdown toggle logic
  document.querySelectorAll('#fug-nav .drop-li').forEach(li => {
    const trigger = li.querySelector('.nav-drop-trigger');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = li.classList.contains('open');
      document.querySelectorAll('#fug-nav .drop-li.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) li.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('#fug-nav .drop-li.open').forEach(o => o.classList.remove('open'));
  });
})();