/**
 * Fak'ugesi Shared Announcement Ticker
 * Injects the yellow ticker bar + "Premiering" banner on every page.
 * On index.html the page bg is white; all other pages get dark navy bg.
 * The ticker is always inserted BELOW the hero section.
 */
(function () {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const isIndex = page === '' || page === 'index.html';

  /* ── Inject styles ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Announcement ribbon */
    #fug-ticker-wrap {
      position: relative;
      z-index: 90;
    }
    #fug-premiere-bar {
      background: ${isIndex ? '#ffffff' : '#0d1b35'};
      color: ${isIndex ? '#111' : '#fff'};
      font-family: 'InterDisplay', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 9px 40px;
      display: flex;
      align-items: center;
      gap: 48px;
      border-bottom: 1px solid ${isIndex ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'};
      white-space: nowrap;
      overflow: hidden;
    }
    #fug-premiere-bar .pb-left  { opacity: ${isIndex ? '0.6' : '0.55'}; flex-shrink: 0; }
    #fug-premiere-bar .pb-cta   { color: ${isIndex ? '#111' : '#fff'}; font-weight: 800; letter-spacing: 0.12em; flex-shrink: 0; }
    #fug-premiere-bar .pb-right { opacity: ${isIndex ? '0.6' : '0.55'}; }

    /* Navy scrolling ticker */
    #fug-ticker {
      background: #1a2744;
      overflow: hidden;
      padding: 10px 0;
      white-space: nowrap;
      position: relative;
      z-index: 5;
    }
    #fug-ticker .ticker-inner {
      display: inline-flex;
      animation: fugTicker 28s linear infinite;
    }
    #fug-ticker .ticker-item {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      padding: 0 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-ticker .ticker-item::after { content: '→'; opacity: 0.5; }
    @keyframes fugTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  `;
  document.head.appendChild(style);

  /* ── Build HTML ── */
  const html = `
    <div id="fug-ticker-wrap">
      <div id="fug-premiere-bar">
        <span class="pb-left">Premiering 07 — 21.04.2026</span>
        <span class="pb-cta">GET YOUR TICKETS</span>
        <span class="pb-right">Don't miss the South African Dome Premiere of African Imaginaries</span>
      </div>
      <div id="fug-ticker">
        <div class="ticker-inner">
          <span class="ticker-item">Awards applications now open. Learn more</span>
          <span class="ticker-item">07 — 12 October 2026 · Johannesburg</span>
          <span class="ticker-item">African Imaginaries · 2026 Theme</span>
          <span class="ticker-item">Awards applications now open. Learn more</span>
          <span class="ticker-item">07 — 12 October 2026 · Johannesburg</span>
          <span class="ticker-item">African Imaginaries · 2026 Theme</span>
          <span class="ticker-item">Awards applications now open. Learn more</span>
          <span class="ticker-item">07 — 12 October 2026 · Johannesburg</span>
          <span class="ticker-item">African Imaginaries · 2026 Theme</span>
          <span class="ticker-item">Awards applications now open. Learn more</span>
          <span class="ticker-item">07 — 12 October 2026 · Johannesburg</span>
          <span class="ticker-item">African Imaginaries · 2026 Theme</span>
        </div>
      </div>
    </div>`;

  /* ── Insert AFTER the .hero or .page-hero section ── */
  function insertTicker() {
    const hero = document.querySelector('.hero, .page-hero');
    if (hero) {
      hero.insertAdjacentHTML('afterend', html);
    } else {
      const nav = document.getElementById('fug-nav');
      if (nav) {
        nav.insertAdjacentHTML('afterend', html);
      } else {
        document.body.insertAdjacentHTML('afterbegin', html);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertTicker);
  } else {
    insertTicker();
  }
})();