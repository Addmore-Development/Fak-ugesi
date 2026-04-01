const API = (() => {
  const BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api' : '/api';
  async function request(path, options = {}) {
    try {
      const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) { console.error('API error:', err.message); throw err; }
  }
  return {
    getAwards: (year) => request('/awards' + (year ? `?year=${year}` : '')),
    getTickets: () => request('/tickets'),
    submitAward: (body) => request('/submissions', { method: 'POST', body: JSON.stringify(body) }),
    submitContact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
    subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
    showToast(message, type = 'success') {
      const existing = document.getElementById('fug-toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.id = 'fug-toast';
      toast.textContent = message;
      Object.assign(toast.style, {
        position: 'fixed', bottom: '32px', right: '32px', zIndex: '9999',
        background: type === 'success' ? '#00ff88' : type === 'error' ? '#ff2d6b' : '#d4e600',
        color: '#000', padding: '14px 24px', fontWeight: '700', fontSize: '13px',
        letterSpacing: '0.06em', borderRadius: '2px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transform: 'translateY(20px)', opacity: '0', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)'
      });
      document.body.appendChild(toast);
      requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
      setTimeout(() => { toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
    }
  };
})();
