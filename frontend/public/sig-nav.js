/**
 * Fak'ugesi Signature Programmes Sub-Navigation
 * Centered header with Home tab, frosted glass, navy palette
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
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 32px;
      height: 58px;
      background: transparent;
      border-bottom: 1px solid transparent;
      font-family: 'InterDisplay', sans-serif;
      transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    }

    #sig-nav.scrolled {
      background: rgba(26, 39, 68, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 2px 32px rgba(0, 0, 0, 0.12);
    }

    #sig-nav .sig-links {
      display: flex;
      align-items: center;
      gap: 32px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    #sig-nav .sig-links a {
      color: rgba(255, 255, 255, 0.75);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.01em;
      text-transform: none;
      text-decoration: none;
      line-height: 58px;
      white-space: nowrap;
      transition: color 0.2s;
      position: relative;
    }

    #sig-nav .sig-links a:hover,
    #sig-nav .sig-links a.active {
      color: #ffffff;
    }

    #sig-nav .sig-links a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.7);
    }

    #sig-nav .sig-links a.home-link {
      color: rgba(255,255,255,0.9);
      font-weight: 600;
    }

    #sig-nav .sig-tickets {
      position: absolute;
      right: 32px;
      background: #1a2744;
      color: #ffffff;
      border: none;
      cursor: pointer;
      padding: 9px 20px;
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
      transition: background 0.22s, transform 0.15s;
    }

    #sig-nav .sig-tickets:hover {
      background: #e05a1e;
      transform: translateY(-1px);
    }
  `;

  const style = document.createElement('style');
  style.textContent = sigCSS;
  document.head.appendChild(style);

  const links = [
    { label: 'Home',             href: '/index.html',           home: true },
    { label: 'Awards',           href: '/sig-awards.html' },
    { label: 'Immersive Africa', href: '/sig-immersive.html' },
    { label: "Fak'ugesiPRO",     href: '/sig-fakugesipro.html' },
    { label: 'Jamz',             href: '/sig-jamz.html' },
    { label: 'Pitchathon',       href: '/sig-pitchathon.html' },
    { label: 'Dala Khona',       href: '/sig-dalakhona.html' },
  ];

  const navHTML = `
    <nav id="sig-nav">
      <ul class="sig-links">
        ${links.map(link => `
          <li>
            <a href="${link.href}" ${isActive(link.href) ? 'class="active"' : ''} ${link.home ? 'class="home-link"' : ''}>
              ${link.label}
            </a>
          </li>
        `).join('')}
      </ul>
      <a class="sig-tickets" href="/tickets.html">GET TICKETS</a>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  const sigNav = document.getElementById('sig-nav');
  function handleScroll() {
    sigNav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();