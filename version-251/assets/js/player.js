(() => {
  const players = Array.from(document.querySelectorAll(".movie-player"));

  players.forEach((player) => {
    const video = player.querySelector("video");
    const cover = player.querySelector(".player-cover");
    const stream = player.getAttribute("data-stream");
    let prepared = false;
    let hlsInstance = null;

    if (!video || !stream) {
      return;
    }

    const prepareVideo = () => {
      if (prepared) {
        return;
      }

      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      }
    };

    const playVideo = () => {
      prepareVideo();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
      if (cover) {
        cover.classList.add("is-hidden");
      }
    };

    if (cover) {
      cover.addEventListener("click", playVideo);
    }

    video.addEventListener("click", () => {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", () => {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });

    window.addEventListener("beforeunload", () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
