/* ── Элементы интерфейса (Глобальный UI Конфиг) ── */
const qEl = document.getElementById('question');
const sendBtn = document.getElementById('sendBtn');
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const homeLogoBtn = document.getElementById('homeLogoBtn');

/* ── Навигационная SPA-система (Принцип единой ответственности) ── */
const navButtons = {
  home: document.getElementById('navHome'),
  news: document.getElementById('navNews'),
  terms: document.getElementById('navTerms')
};

const pages = {
  home: document.getElementById('pageHome'),
  news: document.getElementById('pageNews'),
  terms: document.getElementById('pageTerms')
};

function switchTab(targetPage) {
  Object.keys(pages).forEach(key => {
    if (key === targetPage) {
      pages[key].classList.add('active');
      if (navButtons[key]) navButtons[key].classList.add('active');
    } else {
      pages[key].classList.remove('active');
      if (navButtons[key]) navButtons[key].classList.remove('active');
    }
  });
}

// Слушатели навигации
navButtons.home.addEventListener('click', () => switchTab('home'));
navButtons.news.addEventListener('click', () => switchTab('news'));
navButtons.terms.addEventListener('click', () => switchTab('terms'));
// Клик на логотип — возврат на главную (ТЗ: Любая ссылка на главную — это возврат)
homeLogoBtn.addEventListener('click', () => switchTab('home'));

/* ── Модальное окно авторизации (Вход / Регистрация) ── */
authBtn.addEventListener('click', () => authModal.classList.add('active'));
modalCloseBtn.addEventListener('click', () => authModal.classList.remove('active'));
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) authModal.classList.remove('active');
});

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
  if (!qEl) return;
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

  if (!res.ok) throw new Error('Network error');
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