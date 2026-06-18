(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');
  if (navButton && navLinks) {
    navButton.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var show = function (next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
  inputs.forEach(function (input) {
    var target = input.getAttribute('data-filter-input') || 'body';
    var scope = document.querySelector(target) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var apply = function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        card.classList.toggle('hidden-card', value && text.indexOf(value) === -1);
      });
    };
    input.addEventListener('input', apply);
  });
})();
