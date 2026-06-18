(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var opened = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function restart() {
        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          restart();
        });
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          restart();
        });
      });
      show(0);
      restart();
    }

    var filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
      var searchInput = filterRoot.querySelector('[data-filter-search]');
      var yearSelect = filterRoot.querySelector('[data-filter-year]');
      var categorySelect = filterRoot.querySelector('[data-filter-category]');
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-title]'));
      var empty = filterRoot.querySelector('.empty-state');

      function apply() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var category = categorySelect ? categorySelect.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = [card.dataset.title, card.dataset.genre, card.dataset.category].join(' ').toLowerCase();
          var okQuery = !query || haystack.indexOf(query) !== -1;
          var okYear = !year || String(card.dataset.year) === year;
          var okCategory = !category || card.dataset.category === category;
          var visible = okQuery && okYear && okCategory;
          card.style.display = visible ? '' : 'none';
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.style.display = shown ? 'none' : 'block';
        }
      }

      [searchInput, yearSelect, categorySelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    }
  });
})();
