document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    const hero = document.querySelector(".hero");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        const minis = Array.from(hero.querySelectorAll(".hero-mini"));
        let current = 0;
        const show = function (index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
            minis.forEach(function (mini, i) {
                mini.classList.toggle("active", i === current);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        minis.forEach(function (mini, i) {
            mini.addEventListener("mouseenter", function () {
                show(i);
            });
        });
        setInterval(function () {
            show(current + 1);
        }, 5200);
        show(0);
    }

    const filters = document.querySelector(".filter-panel");
    if (filters) {
        const input = filters.querySelector("input[type='search']");
        const year = filters.querySelector("select[name='year']");
        const type = filters.querySelector("select[name='type']");
        const clear = filters.querySelector("button[type='button']");
        const cards = Array.from(document.querySelectorAll(".movie-card[data-search]"));
        const empty = document.querySelector(".no-result");
        const params = new URLSearchParams(window.location.search);
        if (input && params.get("q")) {
            input.value = params.get("q");
        }
        const apply = function () {
            const q = input ? input.value.trim().toLowerCase() : "";
            const y = year ? year.value : "";
            const t = type ? type.value : "";
            let visible = 0;
            cards.forEach(function (card) {
                const text = (card.getAttribute("data-search") || "").toLowerCase();
                const cardYear = card.getAttribute("data-year") || "";
                const cardType = card.getAttribute("data-type") || "";
                const matched = (!q || text.indexOf(q) !== -1) && (!y || cardYear === y) && (!t || cardType.indexOf(t) !== -1);
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.style.display = visible ? "none" : "block";
            }
        };
        [input, year, type].forEach(function (node) {
            if (node) {
                node.addEventListener("input", apply);
                node.addEventListener("change", apply);
            }
        });
        if (clear) {
            clear.addEventListener("click", function () {
                if (input) {
                    input.value = "";
                }
                if (year) {
                    year.value = "";
                }
                if (type) {
                    type.value = "";
                }
                apply();
            });
        }
        apply();
    }
});
