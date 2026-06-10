
let isRecording = false;
let recognition = null;

function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  const qEl = document.getElementById('question');

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    addMsg('Голосовой ввод не поддерживается вашим браузером. Попробуйте Chrome.', 'bot');
    return;
  }

  if (isRecording) {
    recognition.stop();
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecording = true;
    btn.classList.add('recording');
  };

  recognition.onend = () => {
    isRecording = false;
    btn.classList.remove('recording');
  };

  recognition.onresult = (e) => {
    qEl.value = e.results[0][0].transcript;
    autoResize(qEl);
    ask();
  };

  recognition.onerror = () => {
    isRecording = false;
    btn.classList.remove('recording');
  };

  recognition.start();
}