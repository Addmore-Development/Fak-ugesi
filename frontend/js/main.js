document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.style.opacity="1"; entry.target.style.transform="translateY(0)"; observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".flip-card, .cat-flip, .partner-card, .spotlight-grid > div").forEach((el, i) => {
    el.style.opacity="0"; el.style.transform="translateY(28px)";
    el.style.transition=`opacity 0.5s ease ${i*0.08}s, transform 0.5s ease ${i*0.08}s`;
    observer.observe(el);
  });
});
