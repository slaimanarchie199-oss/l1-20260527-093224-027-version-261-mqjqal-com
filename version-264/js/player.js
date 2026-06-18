(function () {
    var shell = document.querySelector('[data-player-shell]');
    if (!shell) {
        return;
    }

    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-player-button]');
    var source = shell.getAttribute('data-src');
    var initialized = false;

    function playVideo() {
        if (!video || !source) {
            return;
        }

        if (!initialized) {
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                video.src = source;
            }
            initialized = true;
        }

        shell.classList.add('is-playing');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });
})();
