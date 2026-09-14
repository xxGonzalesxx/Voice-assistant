// app.js - оптимизированная и исправленная версия

(function() {
  'use strict';

  var dom = {};

  function get(id) {
    if (!dom[id]) dom[id] = document.getElementById(id);
    return dom[id];
  }

  // ==================== ИНИЦИАЛИЗАЦИЯ ДИНАМИЧЕСКИХ КОМПОНЕНТОВ ====================
  function initDynamicElements() {
    // Навбар
    var navbar = get('navbar');
    var burger = get('burger');
    var navLinks = get('navLinks');

    if (navbar) {
      window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 8);
      }, { passive: true });

      document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
          if (navLinks) navLinks.classList.remove('open');
          if (burger) {
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    // Анимация карточек
    var cards = document.querySelectorAll('.feature-card');
    if (cards.length) {
      if (!window.IntersectionObserver) {
        cards.forEach(function(c) { c.classList.add('visible'); });
      } else {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        cards.forEach(function(c) { observer.observe(c); });
      }
    }

    // Плавный скролл
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        var id = this.getAttribute('href').slice(1);
        if (!id) return;
        var target = get(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ==================== НАВБАР (ГЛОБАЛЬНЫЙ МЕТОД) ====================
  window.toggleMenu = function() {
    var burger = get('burger');
    var navLinks = get('navLinks');
    if (!navLinks || !burger) return;
    var open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  // ==================== МОДАЛКИ (ГЛОБАЛЬНЫЕ МЕТОДЫ) ====================
  function getModalElements() {
    return {
      overlay: get('modalOverlay'),
      modal: get('modal')
    };
  }

  window.openModal = function(tab) {
    var els = getModalElements();
    if (!els.overlay || !els.modal) {
      console.error('Модалки не загружены');
      return;
    }
    els.overlay.classList.add('open');
    els.modal.classList.add('open');
    els.overlay.removeAttribute('aria-hidden');
    window.switchTab(tab || 'login');
    setTimeout(function() {
      var input = els.modal.querySelector('input');
      if (input) input.focus();
    }, 260);
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    var els = getModalElements();
    if (!els.overlay || !els.modal) return;
    els.overlay.classList.remove('open');
    els.modal.classList.remove('open');
    els.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.switchTab = function(tab) {
    var loginBody = get('bodyLogin');
    var registerBody = get('bodyRegister');
    var tabLogin = get('tabLogin');
    var tabRegister = get('tabRegister');
    var isLogin = tab === 'login';
    if (loginBody) loginBody.hidden = !isLogin;
    if (registerBody) registerBody.hidden = isLogin;
    if (tabLogin) tabLogin.classList.toggle('active', isLogin);
    if (tabRegister) tabRegister.classList.toggle('active', !isLogin);
  };

  window.handleLogin = async function () {
    var email = document.getElementById('loginEmail')?.value.trim();
    var pass = document.getElementById('loginPass')?.value;

    if (!email || !pass) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      var response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: pass })
      });

      var data = await response.json();

      if (response.ok) {
        alert('Вход выполнен успешно!');
        closeModal();
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        alert(data.error || 'Ошибка входа. Проверьте данные.');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером.');
      console.error('Login error:', error);
    }
  };

  window.handleRegister = async function () {
    var name = document.getElementById('regName')?.value.trim();
    var email = document.getElementById('regEmail')?.value.trim();
    var pass = document.getElementById('regPass')?.value;
    var offer = document.getElementById('offerCheck')?.checked;

    if (!name || !email || !pass) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    if (!offer) {
      alert('Необходимо принять условия публичной оферты.');
      return;
    }

    try {
      var response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email: email, password: pass })
      });

      var data = await response.json();

      if (response.ok) {
        alert('Регистрация прошла успешно! Теперь войдите.');
        switchTab('login');
        if (get('regName')) get('regName').value = '';
        if (get('regEmail')) get('regEmail').value = '';
        if (get('regPass')) get('regPass').value = '';
        if (get('offerCheck')) get('offerCheck').checked = false;
      } else {
        alert(data.error || 'Ошибка регистрации. Попробуйте ещё раз.');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером.');
      console.error('Register error:', error);
    }
  };

  // ==================== МОДАЛКА ОФЕРТЫ ====================
  function getOfferElements() {
    return {
      overlay: get('offerOverlay'),
      modal: get('offerModal')
    };
  }

  window.openOffer = function(e) {
    if (e) e.preventDefault();
    var els = getOfferElements();
    if (!els.overlay || !els.modal) {
      console.error('Оферта не загружена');
      return;
    }
    els.overlay.classList.add('open');
    els.modal.classList.add('open');
    els.overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeOffer = function() {
    var els = getOfferElements();
    if (!els.overlay || !els.modal) return;
    els.overlay.classList.remove('open');
    els.modal.classList.remove('open');
    els.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // ==================== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ====================
  window.showPage = function(name) {
    var home = get('page-home');
    var chat = get('page-chat');
    if (home) home.hidden = (name !== 'home');
    if (chat) chat.hidden = (name !== 'chat');
    window.scrollTo(0, 0);
  };

  // ==================== ЗАГРУЗКА PARTIALS (ВОССТАНОВЛЕНО И ИСПРАВЛЕНО) ====================
  async function loadPartials() {
    console.log('🔄 Загрузка partials...');

    var partials = {
      'slot-navbar': '/partials/navbar.html',
      'slot-hero': '/partials/hero.html',
      'slot-features': '/partials/features.html',
      'slot-news': '/partials/news.html',
      'slot-footer': '/partials/footer.html',
      'slot-chat': '/partials/page-chat.html',
      'slot-modals': '/partials/modals.html'
    };

    for (var slot in partials) {
      try {
        var res = await fetch(partials[slot]);
        if (!res.ok) throw new Error('Статус ответа: ' + res.status);
        var html = await res.text();
        var el = get(slot);
        if (el) {
          el.innerHTML = html;
          console.log('✅ Загружен: ' + slot);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки слота ' + slot + ':', err);
      }
    }

    // Инициализируем события только после того, как все элементы вставились в DOM
    initDynamicElements();
    console.log('🚀 Инициализация элементов интерфейса завершена.');
  }

  // Запуск сборки при загрузке документа
  document.addEventListener('DOMContentLoaded', loadPartials);

})();
