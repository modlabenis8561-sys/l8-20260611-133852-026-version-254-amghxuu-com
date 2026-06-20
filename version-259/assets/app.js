(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var toggle = document.querySelector('.menu-toggle');
        var menu = document.querySelector('.mobile-nav');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            var isOpen = menu.hasAttribute('hidden');
            if (isOpen) {
                menu.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
                toggle.textContent = '×';
            } else {
                menu.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.textContent = '☰';
            }
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        selectAll('[data-filter-scope]').forEach(function (bar) {
            var section = bar.closest('.section-shell');
            if (!section) {
                return;
            }
            var cards = selectAll('.movie-card', section);
            var input = bar.querySelector('[data-filter-input]');
            var yearSelect = bar.querySelector('[data-filter-year]');
            var typeSelect = bar.querySelector('[data-filter-type]');
            var years = [];
            var types = [];

            cards.forEach(function (card) {
                var year = card.getAttribute('data-year') || '';
                var type = card.getAttribute('data-type') || '';
                if (year && years.indexOf(year) === -1) {
                    years.push(year);
                }
                if (type && types.indexOf(type) === -1) {
                    types.push(type);
                }
            });

            years.sort().reverse().forEach(function (year) {
                var option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });

            types.sort().forEach(function (type) {
                var option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });

            function apply() {
                var keyword = (input.value || '').trim().toLowerCase();
                var year = yearSelect.value;
                var type = typeSelect.value;
                cards.forEach(function (card) {
                    var searchText = (card.getAttribute('data-search') || '').toLowerCase();
                    var matchKeyword = !keyword || searchText.indexOf(keyword) > -1;
                    var matchYear = !year || card.getAttribute('data-year') === year;
                    var matchType = !type || card.getAttribute('data-type') === type;
                    card.hidden = !(matchKeyword && matchYear && matchType);
                });
            }

            input.addEventListener('input', apply);
            yearSelect.addEventListener('change', apply);
            typeSelect.addEventListener('change', apply);
        });
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    function createSearchCard(movie) {
        var link = document.createElement('a');
        link.className = 'movie-card compact';
        link.href = movie.file;
        link.innerHTML = [
            '<div class="card-cover">',
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="card-badge">' + escapeHtml(movie.type) + '</span>',
            '</div>',
            '<div class="card-body">',
            '<h3>' + escapeHtml(movie.title) + '</h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
            '</div>'
        ].join('');
        return link;
    }

    function setupSearchPage() {
        var results = document.getElementById('search-results');
        if (!results || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get('q') || '').trim();
        var input = document.getElementById('search-page-input');
        var title = document.getElementById('search-result-title');
        if (input) {
            input.value = query;
        }
        var list = window.SEARCH_MOVIES;
        if (query) {
            var lower = query.toLowerCase();
            list = list.filter(function (movie) {
                return movie.search.toLowerCase().indexOf(lower) > -1;
            });
            title.textContent = '搜索结果：' + query;
        } else {
            title.textContent = '热门内容';
            list = list.slice(0, 80);
        }
        results.innerHTML = '';
        list.slice(0, 160).forEach(function (movie) {
            results.appendChild(createSearchCard(movie));
        });
        if (!list.length) {
            title.textContent = '未找到相关内容';
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupSearchPage();
    });
}());
