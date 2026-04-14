/**
 * fakugesi-cross-patch.js
 * Moves all .cross-icon elements 5px inward from the content boundary.
 * Inline styles with left:248px → left:253px, right:248px → right:253px
 * Content stays at 248px — only the decorative crosses shift.
 */
(function patchCrossIcons() {
  function repositionCrosses() {
    document.querySelectorAll('.cross-icon').forEach(el => {
      const style = el.getAttribute('style') || '';

      // Only touch the position value, leave animation-delay and other props intact
      let updated = style;

      // left:248px → left:253px
      updated = updated.replace(/left\s*:\s*248px/g, 'left:253px');
      // right:248px → right:253px
      updated = updated.replace(/right\s*:\s*248px/g, 'right:253px');

      if (updated !== style) {
        el.setAttribute('style', updated);
      }
    });
  }

  // Run immediately
  repositionCrosses();

  // Run after DOM content loaded (catches dynamically injected crosses from nav.js etc.)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repositionCrosses);
  }

  // Run after full load
  window.addEventListener('load', repositionCrosses);

  // Short delay for anything injected by other scripts
  setTimeout(repositionCrosses, 300);
  setTimeout(repositionCrosses, 800);
})();