(function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.opacity = '0';
    }, { once: true });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeIndex = 0;

  function activateSlide(index) {
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

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      activateSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      activateSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var regionSelect = document.querySelector('[data-filter-region]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var resultText = document.querySelector('[data-result-text]');
  var emptyResult = document.querySelector('.empty-result');

  function applyFilter() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    if (!cards.length) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var region = regionSelect ? regionSelect.value : '';
    var year = yearSelect ? yearSelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-tags') || ''
      ].join(' ').toLowerCase();
      var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchedRegion = !region || (card.getAttribute('data-region') || '') === region;
      var matchedYear = !year || (card.getAttribute('data-year') || '') === year;
      var show = matchedKeyword && matchedRegion && matchedYear;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });

    if (resultText) {
      resultText.textContent = visible ? '已显示匹配内容' : '暂无匹配内容';
    }
    if (emptyResult) {
      emptyResult.style.display = visible ? 'none' : 'block';
    }
  }

  if (filterInput || regionSelect || yearSelect) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && filterInput) {
      filterInput.value = query;
    }
    [filterInput, regionSelect, yearSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilter);
        element.addEventListener('change', applyFilter);
      }
    });
    applyFilter();
  }

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    var existing = document.querySelector('script[data-hls-loader]');
    if (existing) {
      existing.addEventListener('load', callback, { once: true });
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    script.async = true;
    script.setAttribute('data-hls-loader', '1');
    script.addEventListener('load', callback, { once: true });
    document.head.appendChild(script);
  }

  document.querySelectorAll('[data-video-url]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-overlay');
    var source = player.getAttribute('data-video-url');
    var started = false;

    function startVideo() {
      if (!video || !source) {
        return;
      }
      if (button) {
        button.classList.add('is-hidden');
      }
      if (started) {
        video.play().catch(function () {});
        return;
      }
      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play().catch(function () {});
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = source;
          video.play().catch(function () {});
        }
      });
    }

    if (button) {
      button.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo();
        } else {
          video.pause();
        }
      });
    }
  });
})();
