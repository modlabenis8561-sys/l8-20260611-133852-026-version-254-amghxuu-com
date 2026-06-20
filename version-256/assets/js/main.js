(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    ready(function () {
        var toggle = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');

        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                var open = panel.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, current) {
                slide.classList.toggle('is-active', current === activeIndex);
            });

            dots.forEach(function (dot, current) {
                dot.classList.toggle('is-active', current === activeIndex);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-target')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }

        var filterScope = document.querySelector('[data-local-filter]');
        var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-line button'));

        function applyLocalFilter() {
            if (!filterScope) {
                return;
            }

            var activeValues = filterButtons
                .filter(function (button) {
                    return button.classList.contains('is-active') && button.getAttribute('data-filter-value') !== 'all';
                })
                .map(function (button) {
                    return button.getAttribute('data-filter-value');
                });

            var cards = Array.prototype.slice.call(filterScope.querySelectorAll('.movie-card'));

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre')
                ].join(' ');

                var visible = activeValues.every(function (value) {
                    return haystack.indexOf(value) !== -1;
                });

                card.style.display = visible ? '' : 'none';
            });
        }

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var parent = button.closest('.filter-line');
                var value = button.getAttribute('data-filter-value');

                if (parent) {
                    Array.prototype.slice.call(parent.querySelectorAll('button')).forEach(function (item) {
                        item.classList.remove('is-active');
                    });
                }

                button.classList.add('is-active');

                if (value === 'all' && parent) {
                    Array.prototype.slice.call(parent.querySelectorAll('button')).forEach(function (item) {
                        if (item !== button) {
                            item.classList.remove('is-active');
                        }
                    });
                }

                applyLocalFilter();
            });
        });
    });
}());
