document.addEventListener('alpine:init', () => {
  Alpine.data('siteHeader', () => ({
    open: false,
    scrolled: false,
    active: 'home',
    sections: ['features', 'how-it-works', 'guides', 'pricing', 'faq'],
    init() {
      this.onScroll();
    },
    onScroll() {
      this.scrolled = window.scrollY > 8;
      const line = this.$el.offsetHeight + 40;
      let current = 'home';
      this.sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      this.active = current;
    },
  }));

  Alpine.data('pricing', () => ({
    yearly: false,
    plans: {
      pro: { monthly: 3.99, yearly: 3.19 },
      family: { monthly: 6.99, yearly: 5.59 },
    },
    price(plan) {
      const value = this.yearly ? this.plans[plan].yearly : this.plans[plan].monthly;
      return '£' + value.toFixed(2);
    },
  }));

  Alpine.data('faq', () => ({
    active: null,
    toggle(index) {
      this.active = this.active === index ? null : index;
    },
  }));
});

(() => {
  const DURATION = 1000;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;

  const stop = () => {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };

  const scrollToY = (target) => {
    stop();
    const start = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const end = Math.max(0, Math.min(target, maxY));
    const distance = end - start;
    if (reduceMotion.matches || Math.abs(distance) < 2) {
      window.scrollTo(0, end);
      return;
    }
    const duration = Math.min(DURATION + Math.abs(distance) * 0.12, 1800);
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(p));
      frame = p < 1 ? requestAnimationFrame(step) : null;
    };
    frame = requestAnimationFrame(step);
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    let y = 0;
    if (hash.length > 1) {
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      const header = document.querySelector('header');
      const offset = header ? header.offsetHeight - 8 : 0;
      y = target.getBoundingClientRect().top + window.scrollY - offset;
    }
    event.preventDefault();
    scrollToY(y);
    history.pushState(null, '', hash.length > 1 ? hash : window.location.pathname + window.location.search);
  });

  ['wheel', 'touchstart', 'keydown'].forEach((type) => window.addEventListener(type, stop, { passive: true }));
})();
