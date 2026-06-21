// app.js - оптимизированная версия

(function() {
  'use strict';

  // Кэш DOM элементов
  var dom = {};

  function get(id) {
    if (!dom[id]) dom[id] = document.getElementById(id);
    return dom[id];
  }

  // ==================== НАВБАР ====================
  (function() {
    var navbar = get('navbar');
    var burger = get('burger');
    var navLinks = get('navLinks');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

    window.toggleMenu = function() {
      if (!navLinks || !burger) return;
      var open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };

    document.addEventListener('click', function(e) {
      if (!navbar.contains(e.target)) {
        if (navLinks) navLinks.classList.remove('open');
        if (burger) {
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  })();

  // ==================== АНИМАЦИЯ КАРТОЧЕК ====================
  (function() {
    var cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;

    if (!window.IntersectionObserver) {
      cards.forEach(function(c) { c.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(function(c) { observer.observe(c); });
  })();

  // ==================== SMOOTH SCROLL ====================
  (function() {
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
  })();

  // ==================== МОДАЛКИ ====================
  (function() {
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

    window.handleLogin = function() {
      var email = get('loginEmail');
      var pass = get('loginPass');
      if (!email || !pass || !email.value.trim() || !pass.value) {
        alert('Заполните все поля');
        return;
      }
      alert('Вход будет подключен к Spring Boot');
    };

    window.handleRegister = function() {
      var name = get('regName');
      var email = get('regEmail');
      var pass = get('regPass');
      var offer = get('offerCheck');
      if (!name || !email || !pass || !name.value.trim() || !email.value.trim() || !pass.value) {
        alert('Заполните все поля');
        return;
      }
      if (!offer || !offer.checked) {
        alert('Примите условия оферты');
        return;
      }
      alert('Регистрация будет подключена к Spring Boot');
    };
  })();

  // ==================== МОДАЛКА ОФЕРТЫ ====================
  (function() {
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
  })();

  // ==================== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ====================
  window.showPage = function(name) {
    var home = get('page-home');
    var chat = get('page-chat');
    if (home) home.hidden = (name !== 'home');
    if (chat) chat.hidden = (name !== 'chat');
    window.scrollTo(0, 0);
  };

  // ==================== ЗАГРУЗКА PARTIALS ====================
  async function loadPartials() {
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
        var html = await res.text();
        var el = get(slot);
        if (el) el.innerHTML = html;
      } catch (err) {
        console.error('Ошибка:', partials[slot]);
      }
    }

    if (typeof initChat === 'function') initChat();
    if (typeof initVoice === 'function') initVoice();

    console.log('Partials loaded');
  }

  document.addEventListener('DOMContentLoaded', loadPartials);
})();