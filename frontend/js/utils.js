const Utils = {
  debounce(fn, delay = 200) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; },
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
};
