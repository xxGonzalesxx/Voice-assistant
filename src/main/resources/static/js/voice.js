// voice.js - оптимизированная версия

(function() {
  'use strict';

  var isRecording = false;
  var recognition = null;

  // Поддержка браузера
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var hasSupport = !!SpeechRecognition;

  function toggleVoice() {
    var btn = document.getElementById('voiceBtn');
    var qEl = document.getElementById('question');

    if (!hasSupport) {
      if (typeof addMsg === 'function') {
        addMsg('Голосовой ввод не поддерживается вашим браузером.', 'bot');
      }
      return;
    }

    if (isRecording) {
      if (recognition) recognition.stop();
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = function() {
      isRecording = true;
      if (btn) btn.classList.add('recording');
    };

    recognition.onend = function() {
      isRecording = false;
      if (btn) btn.classList.remove('recording');
    };

    recognition.onresult = function(e) {
      if (qEl && e.results[0]) {
        var text = e.results[0][0].transcript;
        qEl.value = text;
        if (typeof autoResize === 'function') autoResize(qEl);
        if (typeof ask === 'function') ask();
      }
    };

    recognition.onerror = function() {
      isRecording = false;
      if (btn) btn.classList.remove('recording');
    };

    recognition.start();
  }

  function initVoice() {
    var btn = document.getElementById('voiceBtn');
    if (btn) {
      btn.onclick = toggleVoice;
    }
    console.log('Voice ready');
  }

  window.toggleVoice = toggleVoice;
  window.initVoice = initVoice;
})();