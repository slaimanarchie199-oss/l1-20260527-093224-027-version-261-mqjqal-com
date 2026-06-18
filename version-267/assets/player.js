(function () {
  const video = document.getElementById('movie-player');
  const button = document.querySelector('[data-play-trigger]');
  const wrap = document.querySelector('[data-player-wrap]');

  if (!video || typeof PLAY_SRC === 'undefined') {
    return;
  }

  let prepared = false;
  let hlsInstance = null;

  function prepare() {
    if (prepared) {
      return;
    }

    prepared = true;
    const url = PLAY_SRC;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else {
      video.src = url;
    }
  }

  function start() {
    prepare();

    if (button) {
      button.classList.add('is-hidden');
    }

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (wrap) {
    wrap.addEventListener('click', function (event) {
      if (event.target === video && video.paused) {
        start();
      }
    });
  }

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && button) {
      button.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
