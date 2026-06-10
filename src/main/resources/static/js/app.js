/* ── Авторесайз textarea ── */
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

/* ── Enter = отправить, Shift+Enter = перенос ── */
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    ask();
  }
}

/* ── Быстрые подсказки ── */
function quickMsg(text) {
  qEl.value = text;
  autoResize(qEl);
  ask();
}

/* ── Запрос к Spring Boot ── */
async function callApi(message) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  return data.reply || 'Извините, произошла ошибка.';
}

/* ── Отправить сообщение ── */
async function ask() {
  const text = qEl.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  qEl.value = '';
  qEl.style.height = 'auto';
  sendBtn.disabled = true;

  showTyping();

  try {
    const reply = await callApi(text);
    removeTyping();
    addMsg(reply, 'bot');
  } catch (err) {
    removeTyping();
    addMsg('Извините, не удалось получить ответ. Попробуйте позже.', 'bot');
    console.error('API error:', err);
  }

  sendBtn.disabled = false;
  qEl.focus();
}