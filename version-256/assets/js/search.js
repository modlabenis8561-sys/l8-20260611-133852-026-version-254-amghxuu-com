(function () {
    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return (params.get('q') || '').trim();
    }

    function text(value) {
        return String(value || '').toLowerCase();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function card(movie) {
        return [
            '<article class="movie-card movie-card-horizontal">',
            '<a class="movie-cover" href="' + movie.url + '">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="cover-badge">' + escapeHtml(movie.region) + '</span>',
            '<span class="cover-time">45:00</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.category) + '</span><span>推荐指数 ' + escapeHtml(movie.score) + '</span></div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function render() {
        var input = document.getElementById('site-search-input');
        var results = document.getElementById('search-results');

        if (!input || !results || !Array.isArray(SEARCH_MOVIES)) {
            return;
        }

        var query = getQuery();
        input.value = query;

        var terms = text(query).split(/\s+/).filter(Boolean);
        var selected = SEARCH_MOVIES.filter(function (movie) {
            if (!terms.length) {
                return movie.score >= 88;
            }

            var haystack = text([
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.oneLine,
                movie.category
            ].join(' '));

            return terms.every(function (term) {
                return haystack.indexOf(term) !== -1;
            });
        }).slice(0, 160);

        if (!selected.length) {
            results.innerHTML = '<div class="detail-text"><h2>暂无匹配内容</h2><p>可以尝试更换影片名、地区、年份或类型关键词。</p></div>';
            return;
        }

        results.innerHTML = selected.map(card).join('');
    }

    if (document.readyState !== 'loading') {
        render();
    } else {
        document.addEventListener('DOMContentLoaded', render);
    }
}());
