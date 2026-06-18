(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var panel = document.querySelector('[data-player]');
    if (!panel) {
      return;
    }
    var video = panel.querySelector('video');
    var cover = panel.querySelector('.play-cover');
    var url = panel.getAttribute('data-video');
    var started = false;
    var hls = null;

    function bind() {
      if (!video || !url) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function start() {
      if (!started) {
        bind();
        started = true;
      }
      if (cover) {
        cover.classList.add('hidden');
      }
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          if (cover) {
            cover.classList.remove('hidden');
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('hidden');
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  });
})();
