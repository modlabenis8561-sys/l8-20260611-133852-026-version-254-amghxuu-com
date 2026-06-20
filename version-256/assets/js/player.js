(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    ready(function () {
        var video = document.querySelector('.movie-player');
        var layer = document.querySelector('.play-layer');

        if (!video || !layer) {
            return;
        }

        var streamUrl = layer.getAttribute('data-stream');
        var hlsInstance = null;
        var prepared = false;

        function prepareVideo() {
            if (prepared || !streamUrl) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function startVideo() {
            prepareVideo();
            layer.classList.add('is-hidden');
            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        layer.addEventListener('click', startVideo);

        video.addEventListener('click', function () {
            if (!prepared) {
                startVideo();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
}());
