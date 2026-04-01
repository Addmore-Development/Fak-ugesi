document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) { nav.style.background="rgba(10,12,22,0.97)"; }
    else { nav.style.background=""; }
  }, { passive: true });
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
});
