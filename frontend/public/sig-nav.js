/**
 * Fak'ugesi Signature Programmes Sub-Navigation v2
 * - Cross indicator ABOVE active tab (not between words)
 * - Bouncy spring transition between tabs
 * - Triple bounce on click
 * - GET TICKETS: hover → white bg, dark text
 * - No water/ripple canvas effect
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
      padding: 0 140px 0 32px;
      height: 58px;
      background: transparent;
      border-bottom: 1px solid transparent;
      font-family: 'InterDisplay', sans-serif;
      transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
      overflow: visible;
    }

    #sig-nav.scrolled {
      background: rgba(26, 39, 68, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 2px 32px rgba(0, 0, 0, 0.12);
    }

    /* Cross indicator that slides ABOVE tabs */
    #sig-nav-indicator {
      position: absolute;
      top: 6px;
      pointer-events: none;
      z-index: 10;
      /* Spring-like transition for the horizontal slide */
      transition: left 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #sig-nav-indicator svg {
      display: block;
    }
    /* Vertical bounce animation on click */
    #sig-nav-indicator.jumping {
      animation: sigIndicatorBounce 0.65s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes sigIndicatorBounce {
      0%   { transform: translateY(0) scale(1); }
      16%  { transform: translateY(-10px) scale(1.6); }
      32%  { transform: translateY(0) scale(1); }
      48%  { transform: translateY(-7px) scale(1.35); }
      64%  { transform: translateY(0) scale(1); }
      80%  { transform: translateY(-4px) scale(1.15); }
      100% { transform: translateY(0) scale(1); }
    }

    #sig-nav .sig-links {
      display: flex;
      align-items: center;
      gap: 28px;
      list-style: none;
      margin: 0;
      padding: 0;
      position: relative;
    }

    #sig-nav .sig-links li {
      position: relative;
    }

    #sig-nav .sig-links a {
      color: rgba(255, 255, 255, 0.72);
      font-size: 12.5px;
      font-weight: 500;
      letter-spacing: 0.01em;
      text-decoration: none;
      line-height: 58px;
      white-space: nowrap;
      transition: color 0.2s;
      display: block;
      padding: 0 4px;
    }

    #sig-nav .sig-links a:hover {
      color: #ffffff;
    }

    #sig-nav .sig-links a.active {
      color: #ffffff;
      font-weight: 600;
    }

    #sig-nav .sig-tickets {
      position: absolute;
      right: 32px;
      background: rgba(26, 55, 120, 0.85);
      color: #ffffff;
      border: 1.5px solid rgba(255,255,255,0.35);
      cursor: pointer;
      padding: 8px 18px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-family: 'InterDisplay', sans-serif;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      border-radius: 100px;
      white-space: nowrap;
      transition: background 0.22s, color 0.22s, border-color 0.22s, transform 0.15s;
    }

    #sig-nav .sig-tickets:hover {
      background: #ffffff;
      color: #1a2744;
      border-color: #ffffff;
      transform: translateY(-1px);
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
      <div id="sig-nav-indicator">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <line x1="9" y1="0" x2="9" y2="18" stroke="rgba(255,255,255,0.9)" stroke-width="1.8"/>
          <line x1="0" y1="9" x2="18" y2="9" stroke="rgba(255,255,255,0.9)" stroke-width="1.8"/>
        </svg>
      </div>
      <ul class="sig-links" id="sig-links-list">
        ${listItems}
      </ul>
      <a class="sig-tickets" href="/tickets.html">GET TICKETS</a>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  const sigNav = document.getElementById('sig-nav');
  const indicator = document.getElementById('sig-nav-indicator');
  const sigLinksList = document.getElementById('sig-links-list');

  // Position indicator centred above a given element
  function positionIndicator(el) {
    const navRect = sigNav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const centerX = elRect.left - navRect.left + elRect.width / 2 - 8; // 8 = half of 16px icon
    indicator.style.left = centerX + 'px';
  }

  // Trigger triple-bounce vertical animation
  function jumpIndicator() {
    indicator.classList.remove('jumping');
    void indicator.offsetWidth; // reflow
    indicator.classList.add('jumping');
    indicator.addEventListener('animationend', () => indicator.classList.remove('jumping'), { once: true });
  }

  // Find active tab and position indicator on load
  function initIndicator() {
    const activeLink = sigLinksList.querySelector('a.active');
    const targetEl = activeLink || sigLinksList.querySelector('a');
    if (targetEl) positionIndicator(targetEl);
  }

  // Event listeners
  sigLinksList.querySelectorAll('li').forEach(li => {
    const a = li.querySelector('a');
    if (!a) return;

    // Hover: slide indicator to this tab
    li.addEventListener('mouseenter', () => positionIndicator(a));

    // Mouse leave: return to active tab
    li.addEventListener('mouseleave', () => {
      const activeLink = sigLinksList.querySelector('a.active');
      const fallback = activeLink || sigLinksList.querySelector('a');
      if (fallback) positionIndicator(fallback);
    });

    // Click: set active + bounce
    li.addEventListener('click', () => {
      sigLinksList.querySelectorAll('a').forEach(el => el.classList.remove('active'));
      a.classList.add('active');
      positionIndicator(a);
      jumpIndicator();
    });
  });

  // Scroll behaviour
  function handleScroll() {
    sigNav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Init after layout paint
  requestAnimationFrame(() => requestAnimationFrame(initIndicator));
  window.addEventListener('resize', initIndicator);
})();