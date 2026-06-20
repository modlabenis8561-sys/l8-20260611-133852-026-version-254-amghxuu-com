(function () {
  window.initMoviePlayer = function (source, title) {
    const video = document.getElementById('moviePlayer');
    const starter = document.getElementById('playerStart');
    const errorBox = document.getElementById('playerError');
    const Hls = window.Hls;
    let ready = false;

    if (!video || !starter || !source) {
      return;
    }

    const showError = () => {
      if (errorBox) {
        errorBox.hidden = false;
      }
    };

    const prepare = () => {
      if (ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        ready = true;
        return;
      }

      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data && data.fatal) {
            showError();
          }
        });
        ready = true;
        return;
      }

      showError();
    };

    const play = async () => {
      prepare();
      starter.classList.add('is-off');

      try {
        await video.play();
      } catch (_error) {
        starter.classList.remove('is-off');
      }
    };

    starter.addEventListener('click', play);
    video.addEventListener('click', () => {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', () => starter.classList.add('is-off'));
    video.addEventListener('pause', () => {
      if (!video.ended) {
        starter.classList.remove('is-off');
      }
    });
    video.addEventListener('error', showError);
    video.setAttribute('aria-label', title || '影片播放');
  };
})();
