(function () {
  var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
  boxes.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var stream = box.getAttribute('data-stream');
    var loaded = false;
    var hls = null;
    var load = function () {
      if (loaded || !video || !stream) return;
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    };
    var start = function () {
      load();
      box.classList.add('is-started');
      var attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch(function () {});
      }
    };
    if (button) {
      button.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) start();
      });
      video.addEventListener('play', function () {
        box.classList.add('is-started');
      });
    }
  });
})();
