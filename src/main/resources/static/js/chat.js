// chat.js - оптимизированная версия

(function() {
  'use strict';

  // Кэш DOM элементов
  var dom = {
    chat: null,
    question: null,
    sendBtn: null,
    typing: null
  };

  // Получить элемент с кэшированием
  function get(id) {
    if (!dom[id]) dom[id] = document.getElementById(id);
    return dom[id];
  }

  // Обновить кэш после загрузки partials
  function refreshDom() {
    dom.chat = document.getElementById('chat');
    dom.question = document.getElementById('question');
    dom.sendBtn = document.getElementById('sendBtn');
  }

  // Время сообщения (один вызов)
  var now = function() {
    var d = new Date();
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  };

  // Экранирование HTML (быстрая таблица)
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) { return escapeMap[m]; });
  }

  // Добавить сообщение
  function addMsg(text, role) {
    var chat = dom.chat || get('chat');
    if (!chat) return;

    var isUser = role === 'user';
    var div = document.createElement('div');
    div.className = 'msg ' + role;
    div.innerHTML = '<div class="msg-avatar"><i class="ti ' + (isUser ? 'ti-user' : 'ti-train') + '"></i></div><div><div class="msg-bubble">' + escapeHtml(text) + '</div><div class="msg-time">' + now() + '</div></div>';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  // Индикатор печати
  function showTyping() {
    removeTyping();
    var chat = dom.chat || get('chat');
    if (!chat) return;
    var div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typing';
    div.innerHTML = '<div class="msg-avatar"><i class="ti ti-train"></i></div><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    dom.typing = div;
  }

  function removeTyping() {
    if (dom.typing) dom.typing.remove();
    dom.typing = null;
  }

  // Авторесайз textarea
  function autoResize(el) {
    if (!el) return;
    el.style.height = 'auto';
    var h = el.scrollHeight;
    el.style.height = (h > 120 ? 120 : h) + 'px';
  }

  // Обработчик клавиш
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  // Быстрые подсказки
  function quickMsg(text) {
    var q = dom.question || get('question');
    if (q) {
      q.value = text;
      autoResize(q);
      ask();
    }
  }

  // API вызов
  async function callApi(message) {
    var res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });
    var data = await res.json();
    return data.reply || 'Извините, произошла ошибка.';
  }

  // Главная функция отправки
  async function ask() {
    var q = dom.question || get('question');
    var btn = dom.sendBtn || get('sendBtn');

    if (!q || !btn) return;

    var text = q.value.trim();
    if (!text) return;

    addMsg(text, 'user');
    q.value = '';
    q.style.height = 'auto';
    btn.disabled = true;
    showTyping();

    try {
      var reply = await callApi(text);
      removeTyping();
      addMsg(reply, 'bot');
    } catch (err) {
      removeTyping();
      addMsg('Ошибка соединения', 'bot');
    }

    btn.disabled = false;
    q.focus();
  }

  // Инициализация
  function initChat() {
    refreshDom();

    var btn = dom.sendBtn;
    var q = dom.question;

    if (btn) btn.onclick = ask;
    if (q) {
      q.addEventListener('keypress', handleKey);
      q.addEventListener('input', function(e) { autoResize(e.target); });
    }

    console.log('Chat ready');
  }

  // Экспорт в глобальную область
  window.ask = ask;
  window.addMsg = addMsg;
  window.autoResize = autoResize;
  window.handleKey = handleKey;
  window.quickMsg = quickMsg;
  window.showTyping = showTyping;
  window.removeTyping = removeTyping;
  window.initChat = initChat;
  window.callApi = callApi;
})();