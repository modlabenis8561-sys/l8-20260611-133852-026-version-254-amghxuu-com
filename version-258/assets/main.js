(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const previous = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  let active = slides.findIndex((slide) => slide.classList.contains('is-active'));
  active = active < 0 ? 0 : active;

  const setSlide = (index) => {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === active);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === active);
    });
  };

  if (slides.length) {
    previous?.addEventListener('click', () => setSlide(active - 1));
    next?.addEventListener('click', () => setSlide(active + 1));
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => setSlide(index));
    });
    window.setInterval(() => setSlide(active + 1), 5000);
  }

  document.querySelectorAll('[data-filter-panel]').forEach((panel) => {
    const scope = panel.closest('[data-filter-scope]') || document;
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
    const search = panel.querySelector('[data-filter-search]');
    const year = panel.querySelector('[data-filter-year]');
    const type = panel.querySelector('[data-filter-type]');
    const region = panel.querySelector('[data-filter-region]');
    const category = panel.querySelector('[data-filter-category]');

    const update = () => {
      const q = (search?.value || '').trim().toLowerCase();
      const y = year?.value || '';
      const t = type?.value || '';
      const r = region?.value || '';
      const c = category?.value || '';

      cards.forEach((card) => {
        const text = (card.dataset.text || '').toLowerCase();
        const visible = (!q || text.includes(q)) &&
          (!y || card.dataset.year === y) &&
          (!t || card.dataset.type === t) &&
          (!r || card.dataset.region === r) &&
          (!c || card.dataset.category === c);

        card.classList.toggle('is-hidden', !visible);
      });
    };

    [search, year, type, region, category].forEach((item) => {
      item?.addEventListener('input', update);
      item?.addEventListener('change', update);
    });
  });
})();
