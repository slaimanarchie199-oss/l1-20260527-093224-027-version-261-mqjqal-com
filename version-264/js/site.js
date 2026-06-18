(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            setSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            setSlide(current + 1);
        }, 5200);
    }

    var homeSearch = document.querySelector('[data-home-search]');
    if (homeSearch) {
        homeSearch.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = homeSearch.querySelector('input');
            var query = input ? input.value.trim() : '';
            var target = homeSearch.getAttribute('data-target') || 'search.html';
            window.location.href = target + (query ? '?q=' + encodeURIComponent(query) : '');
        });
    }

    var filterPanel = document.querySelector('[data-filter-panel]');
    if (filterPanel) {
        var keywordInput = filterPanel.querySelector('[data-filter-keyword]');
        var yearSelect = filterPanel.querySelector('[data-filter-year]');
        var typeSelect = filterPanel.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var emptyTip = document.querySelector('[data-empty-tip]');

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var keyword = normalize(keywordInput && keywordInput.value);
            var year = normalize(yearSelect && yearSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year')
                ].join(' '));
                var ok = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    ok = false;
                }
                if (type && normalize(card.getAttribute('data-type')).indexOf(type) === -1) {
                    ok = false;
                }

                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (emptyTip) {
                emptyTip.style.display = visible ? 'none' : 'block';
            }
        }

        [keywordInput, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && keywordInput) {
            keywordInput.value = q;
        }
        applyFilter();
    }
})();
