(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dotsWrap = hero.querySelector('[data-hero-dots]');
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    const dots = slides.map(function (_, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', '切换到第' + (index + 1) + '部');
      button.addEventListener('click', function () {
        setActive(index);
        restart();
      });
      dotsWrap.appendChild(button);
      return button;
    });

    function setActive(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function advance(step) {
      setActive(active + step);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        advance(1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        advance(-1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        advance(1);
        restart();
      });
    }

    setActive(0);
    restart();
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const typeFilter = document.querySelector('[data-type-filter]');
  const yearFilter = document.querySelector('[data-year-filter]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

  function queryValue() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  if (filterInput && queryValue()) {
    filterInput.value = queryValue();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    const type = typeFilter ? typeFilter.value : '';
    const year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      const text = (card.getAttribute('data-search') || '').toLowerCase();
      const cardType = card.getAttribute('data-type') || '';
      const cardYear = card.getAttribute('data-year') || '';
      const matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
      const matchesType = !type || cardType.indexOf(type) !== -1;
      const matchesYear = !year || cardYear === year;
      card.classList.toggle('is-hidden', !(matchesKeyword && matchesType && matchesYear));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilters);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  applyFilters();
})();
