(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.textContent = open ? '×' : '☰';
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function uniqueValues(cards, name) {
    var values = [];
    cards.forEach(function (card) {
      var value = card.getAttribute(name);
      if (value && values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    return values.sort(function (a, b) {
      return String(b).localeCompare(String(a), 'zh-CN');
    });
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var yearSelect = scope.querySelector('[data-filter-year]');
      var typeSelect = scope.querySelector('[data-filter-type]');
      var categorySelect = scope.querySelector('[data-filter-category]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var count = scope.querySelector('[data-filter-count]');
      var empty = scope.querySelector('[data-empty-state]');

      fillSelect(yearSelect, uniqueValues(cards, 'data-year'));
      fillSelect(typeSelect, uniqueValues(cards, 'data-type'));

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var category = categorySelect ? categorySelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = card.getAttribute('data-search') || '';
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (year && card.getAttribute('data-year') !== year) {
            ok = false;
          }
          if (type && card.getAttribute('data-type') !== type) {
            ok = false;
          }
          if (category && card.getAttribute('data-category') !== category) {
            ok = false;
          }
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible;
        }
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [input, yearSelect, typeSelect, categorySelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
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
    script.setAttribute('data-hls-loader', 'true');
    script.addEventListener('load', callback, { once: true });
    document.head.appendChild(script);
  }

  function initPlayer() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (box) {
      var video = box.querySelector('video[data-src]');
      var button = box.querySelector('[data-play-button]');
      var status = box.querySelector('[data-player-status]');
      var hls = null;
      var started = false;

      if (!video || !button) {
        return;
      }

      function setStatus(text) {
        if (status) {
          status.textContent = text || '';
        }
      }

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            setStatus('请再次点击播放');
          });
        }
      }

      function attachWithHls() {
        var src = video.getAttribute('data-src');
        if (!src) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus('');
            playVideo();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              setStatus('网络正在重试');
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              setStatus('媒体错误恢复中');
              hls.recoverMediaError();
            } else {
              setStatus('播放暂时不可用');
              hls.destroy();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', playVideo, { once: true });
          video.load();
        } else {
          setStatus('当前浏览器不支持 HLS 播放');
        }
      }

      function start() {
        if (started) {
          playVideo();
          return;
        }
        started = true;
        button.classList.add('is-hidden');
        setStatus('正在加载播放源');
        loadHls(attachWithHls);
      }

      button.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (!started) {
          start();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
