/**
 * Fak'ugesi Shared Footer
 * Injects consistent footer + social band on every page.
 * Drop <script src="footer.js"></script> before </body> on each page,
 * and REMOVE the static <footer> and .social-band markup from each page.
 */
(function () {

  const style = document.createElement('style');
  style.textContent = `
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-Regular.otf') format('opentype'); font-weight:400; }
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-Medium.otf') format('opentype'); font-weight:500; }
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-SemiBold.otf') format('opentype'); font-weight:600; }
    @font-face { font-family:'InterDisplay'; src:url('/fonts/InterDisplay-Bold.otf') format('opentype'); font-weight:700; }

    #fug-social-band {
      background: #1a2744;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      padding: 18px 48px;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-social-band p {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      letter-spacing: 0.02em;
      margin: 0;
    }
    #fug-social-band .fsb-icons {
      display: flex;
      gap: 16px;
    }
    #fug-social-band .fsb-icons a {
      color: #fff;
      text-decoration: none;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
    }
    #fug-social-band .fsb-icons a:hover { opacity: 0.5; }

    #fug-footer {
      background: #fff;
      border-top: 1px solid rgba(26,39,68,0.1);
      padding: 0 48px;
      color: #0d1b3e;
      position: relative;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer .fug-footer-inner {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 80px;
      padding: 40px 0 36px;
      position: relative;
    }
    #fug-footer .fug-footer-col { display: flex; flex-direction: column; }
    #fug-footer .fug-footer-brand {
      font-weight: 700;
      font-size: 13px;
      color: #0d1b3e;
      margin-bottom: 6px;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer .fug-footer-addr {
      font-size: 12px;
      line-height: 1.7;
      color: #5a6070;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer .fug-footer-col-title {
      font-size: 12px;
      font-weight: 600;
      color: #0d1b3e;
      margin-bottom: 10px;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer a {
      color: #1a2744;
      font-size: 12px;
      display: block;
      line-height: 2;
      text-decoration: none;
      font-family: 'InterDisplay', sans-serif;
    }
    #fug-footer a:hover { text-decoration: underline; }
    #fug-footer .fug-footer-right {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    #fug-footer .fug-footer-logo {
      height: 52px;
      width: auto;
      display: block;
    }
    #fug-footer .fug-footer-copy {
      font-size: 11px;
      color: #888;
      line-height: 1.7;
      font-family: 'InterDisplay', sans-serif;
    }

    /* Cross icons in footer */
    .fug-footer-cross {
      display: inline-flex; align-items: center; justify-content: center;
      width: 14px; height: 14px; position: absolute; z-index: 2;
      opacity: 0.25;
      transition: transform 0.1s linear;
    }
    .fug-footer-cross svg { width: 100%; height: 100%; }
  `;
  document.head.appendChild(style);

  const html = `
    <div id="fug-social-band">
      <p>Follow us on socials @fakugesi</p>
      <div class="fsb-icons">
        <a href="https://www.instagram.com/fakugesi/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://x.com/fakugesi" target="_blank" rel="noopener" aria-label="X">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/fakugesi" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
      </div>
    </div>

    <footer id="fug-footer">
      <span class="fug-footer-cross" style="top:16px;left:200px;">
        <svg viewBox="0 0 14 14" fill="none"><line x1="7" y1="0" x2="7" y2="14" stroke="#1a2744" stroke-width="1.2"/><line x1="0" y1="7" x2="14" y2="7" stroke="#1a2744" stroke-width="1.2"/></svg>
      </span>
      <span class="fug-footer-cross" style="top:16px;right:200px;">
        <svg viewBox="0 0 14 14" fill="none"><line x1="7" y1="0" x2="7" y2="14" stroke="#1a2744" stroke-width="1.2"/><line x1="0" y1="7" x2="14" y2="7" stroke="#1a2744" stroke-width="1.2"/></svg>
      </span>
      <span class="fug-footer-cross" style="bottom:16px;left:200px;">
        <svg viewBox="0 0 14 14" fill="none"><line x1="7" y1="0" x2="7" y2="14" stroke="#1a2744" stroke-width="1.2"/><line x1="0" y1="7" x2="14" y2="7" stroke="#1a2744" stroke-width="1.2"/></svg>
      </span>
      <span class="fug-footer-cross" style="bottom:16px;right:200px;">
        <svg viewBox="0 0 14 14" fill="none"><line x1="7" y1="0" x2="7" y2="14" stroke="#1a2744" stroke-width="1.2"/><line x1="0" y1="7" x2="14" y2="7" stroke="#1a2744" stroke-width="1.2"/></svg>
      </span>

      <div class="fug-footer-inner">
        <div class="fug-footer-col">
          <p class="fug-footer-brand">Fak'ugesi Festival</p>
          <p class="fug-footer-addr">41 Juta Street, Braamfontein<br>Johannesburg, South Africa</p>
        </div>
        <div class="fug-footer-col">
          <p class="fug-footer-col-title">Contact us</p>
          <a href="mailto:hello@fakugesi.co.za">hello@fakugesi.co.za</a>
          <a href="tel:+27117178156">+27 11 717 8156</a>
        </div>
        <div class="fug-footer-right">
          <img class="fug-footer-logo" src="/images/logos/fakugesi/logo_fakugesi_dark.svg" alt="Fak'ugesi Festival" />
          <p class="fug-footer-copy">© 2026<br>Fak'ugesi Festival<br>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  `;

  // Insert at end of body
  document.body.insertAdjacentHTML('beforeend', html);

  // Scroll spin for footer crosses (coordinates with page-level cross icons)
  (function(){
    let lastY = window.scrollY;
    let rot = 0;
    let ticking = false;
    function onScroll(){
      if(!ticking){
        requestAnimationFrame(function(){
          const y = window.scrollY;
          const delta = y - lastY;
          if(Math.abs(delta) > 0){
            rot += delta > 0 ? 15 : -15;
            document.querySelectorAll('.fug-footer-cross').forEach(el => {
              el.style.transform = 'rotate(' + rot + 'deg)';
            });
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
  })();

})();