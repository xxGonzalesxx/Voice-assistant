/* ══════════════════════════════════════════════
   app.js — РЖД Помощник
   Логика главной страницы + чата
   ══════════════════════════════════════════════ */

/* ── Кешируем часто используемые элементы ── */
const qEl     = document.getElementById('question');
const sendBtn = document.getElementById('sendBtn');

/* ════════════════════════
   SPA-РОУТЕР: переключение страниц
   ════════════════════════ */
function showPage(name) {
  document.getElementById('page-home').hidden = (name !== 'home');
  document.getElementById('page-chat').hidden = (name !== 'chat');
  window.scrollTo(0, 0);
}

/* ════════════════════════
   NAVBAR
   ════════════════════════ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  window.toggleMenu = function () {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ════════════════════════
   IntersectionObserver: fade-up для карточек
   ════════════════════════ */
(function initObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.feature-card').forEach(function (c) {
      c.classList.add('visible');
    });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.feature-card').forEach(function (c) {
    io.observe(c);
  });
})();

/* ════════════════════════
   SMOOTH SCROLL для якорей
   ════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ════════════════════════
   МОДАЛКА: Вход / Регистрация
   ════════════════════════ */
(function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal   = document.getElementById('modal');

  window.openModal = function (tab) {
    overlay.classList.add('open');
    modal.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    switchTab(tab || 'login');
    setTimeout(function () {
      const first = modal.querySelector('input');
      if (first) first.focus();
    }, 260);
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    overlay.classList.remove('open');
    modal.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.switchTab = function (tab) {
    const loginBody    = document.getElementById('bodyLogin');
    const registerBody = document.getElementById('bodyRegister');
    const tabLogin     = document.getElementById('tabLogin');
    const tabRegister  = document.getElementById('tabRegister');

    const isLogin = tab === 'login';
    loginBody.hidden    = !isLogin;
    registerBody.hidden =  isLogin;
    tabLogin.classList.toggle('active',    isLogin);
    tabRegister.classList.toggle('active', !isLogin);
  };

  /* ESC закрывает любую открытую модалку */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeOffer(); }
  });

  /* Заглушки форм — подключить к Spring Boot */
  window.handleLogin = function () {
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;
    if (!email || !pass) { alert('Пожалуйста, заполните все поля.'); return; }
    /* TODO: POST /api/auth/login */
    alert('Функция входа будет подключена к Spring Boot.');
  };

  window.handleRegister = function () {
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass  = document.getElementById('regPass').value;
    const offer = document.getElementById('offerCheck').checked;
    if (!name || !email || !pass) { alert('Пожалуйста, заполните все поля.'); return; }
    if (!offer) { alert('Необходимо принять условия публичной оферты.'); return; }
    /* TODO: POST /api/auth/register */
    alert('Функция регистрации будет подключена к Spring Boot.');
  };
})();

/* ════════════════════════
   МОДАЛКА: Оферта
   ════════════════════════ */
(function initOffer() {
  const overlay = document.getElementById('offerOverlay');
  const modal   = document.getElementById('offerModal');

  window.openOffer = function (e) {
    if (e) e.preventDefault();
    overlay.classList.add('open');
    modal.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeOffer = function () {
    overlay.classList.remove('open');
    modal.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
})();

/* ════════════════════════
   ЧАТ: авторесайз textarea
   ════════════════════════ */
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