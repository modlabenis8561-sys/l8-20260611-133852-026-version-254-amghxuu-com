(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var prev = slider.querySelector('.hero-prev');
    var next = slider.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide') || 0));
        start();
      });
    });

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

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var input = document.getElementById('movieSearch');
    var type = document.getElementById('typeFilter');
    var year = document.getElementById('yearFilter');
    if (!cards.length || (!input && !type && !year)) {
      return;
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';

      cards.forEach(function (card) {
        var searchText = (card.getAttribute('data-search') || '').toLowerCase();
        var cardType = card.getAttribute('data-type') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matchKeyword = !keyword || searchText.indexOf(keyword) !== -1;
        var matchType = !typeValue || cardType === typeValue;
        var matchYear = !yearValue || cardYear === yearValue;
        card.hidden = !(matchKeyword && matchType && matchYear);
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }
    if (type) {
      type.addEventListener('change', apply);
    }
    if (year) {
      year.addEventListener('change', apply);
    }
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.player-block'));
    players.forEach(function (block) {
      var video = block.querySelector('.movie-video');
      var overlay = block.querySelector('.player-overlay');
      var message = block.querySelector('.player-message');
      var url = block.getAttribute('data-video-url');
      var hls = null;
      var loaded = false;

      function showMessage(text) {
        if (!message) {
          return;
        }
        message.textContent = text;
        message.classList.add('show');
      }

      function hideOverlay() {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      }

      function attachSource() {
        if (loaded || !video || !url) {
          return Promise.resolve();
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              showMessage('播放失败，请稍后重试');
              if (hls) {
                hls.destroy();
                hls = null;
              }
            }
          });
          return Promise.resolve();
        }
        video.src = url;
        return Promise.resolve();
      }

      function play() {
        if (!video) {
          return;
        }
        attachSource().then(function () {
          hideOverlay();
          var attempt = video.play();
          if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
              showMessage('点击画面即可继续播放');
            });
          }
        });
      }

      if (overlay) {
        overlay.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!loaded || video.paused) {
            play();
          } else {
            video.pause();
          }
        });
        video.addEventListener('play', hideOverlay);
      }
    });
  }

  ready(function () {
    initMenu();
    initHeroSlider();
    initFilters();
    initPlayers();
  });
})();
