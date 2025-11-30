document.addEventListener('DOMContentLoaded', function () {
  console.log('services.js loaded');

  /* ===========================
     БУРГЕР-МЕНЮ
  ============================ */
 var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  // 👉 хедер стає фіолетовим при скролі
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // одразу перевіряємо стан при завантаженні
  }

  // бургер-меню
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  /* ===========================
     REVEAL-АНІМАЦІЇ (виїзд блоків)
  ============================ */

  var revealObserver = null;

  function initRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      // Старі браузери — просто показуємо всі елементи
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    // Підписуємо все, що вже є
    observeRevealElements(document);
  }

  function observeRevealElements(root) {
    if (!revealObserver) {
      // Якщо обсервер не підтримується — просто все показуємо
      root.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var els = root.querySelectorAll('.reveal');
    els.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  initRevealObserver();

  /* ===========================
     ДИНАМІЧНІ ПОСЛУГИ (services.json)
  ============================ */

  var servicesGrid = document.querySelector('.js-services-grid');

  var fallbackServices = [
    {
      icon: 'fa-magic',
      title: 'Підбір сетапу під роль',
      text: 'Розповідаєш, чим займаєшся, що важливо, який бюджет. Ми підбираємо ноут / телефон / навушники / годинник так, щоб усе працювало як одна система.',
      points: [
        'Робота / навчання / креаторство',
        '2–3 варіанти під різні бюджети',
        'Пояснення “що за що відповідає”'
      ],
      label: 'від 0 грн (консультація онлайн)'
    },
    {
      icon: 'fa-sliders-h',
      title: 'Стартове налаштування девайсів',
      text: 'Налаштовуємо акаунти, хмару, базові застосунки, Face ID / Touch ID, резервні копії. Ти дістаєш не “нову коробку”, а готовий до роботи девайс.',
      points: [
        'Apple ID / Google акаунт',
        'Хмарні сервіси, пошта, месенджери',
        'Базова безпека, резервування'
      ],
      label: 'від 399 грн'
    },
    {
      icon: 'fa-exchange-alt',
      title: 'Перенесення даних & міграція',
      text: 'Переїжджаємо зі старого телефону / ноутбука на новий: фото, чати, нотатки, контакти, файли.',
      points: [
        'Android → iOS / iOS → iOS',
        'Mac / Windows → Mac',
        'Перевірка, що все підтягнулося'
      ],
      label: 'від 599 грн'
    },
    {
      icon: 'fa-sync-alt',
      title: 'Trade-in & оновлення техніки',
      text: 'Допомагаємо здати старий девайс і доплатити за новий. Пояснюємо, чи взагалі є сенс оновлюватися саме зараз.',
      points: [
        'Оцінка стану пристрою',
        'Пропозиції по оновленню',
        'Еко-підхід до утилізації'
      ],
      label: 'індивідуальний розрахунок'
    },
    {
      icon: 'fa-headset',
      title: 'Консультація “чи вистачить мені цього?”',
      text: 'Присилаєш нам варіант (або кілька) з будь-якого магазину — ми розбираємо, чи ок ця модель саме під твій сценарій.',
      points: [
        'Розбір характеристик “по-людськи”',
        'Порада: брати / не брати',
        'Альтернатива, якщо є кращий варіант'
      ],
      label: 'від 299 грн'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Супровід після покупки',
      text: 'Допомагаємо розібратись з оновленнями, помилками, дивною поведінкою девайса. Без “гугли” — просто напиши нам.',
      points: [
        'Онлайн-підтримка',
        'Рекомендації по догляду',
        'Поради по апгрейду в майбутньому'
      ],
      label: 'пакети підтримки / разові сесії'
    }
  ];

  function renderServices(services) {
    if (!servicesGrid) return;

    servicesGrid.innerHTML = '';

    services.forEach(function (service, index) {
      var card = document.createElement('article');
      // додаємо reveal-клас, щоб теж виїжджали
      var dirClass = 'reveal--up';
      if (index % 3 === 0) dirClass = 'reveal--left';
      else if (index % 3 === 2) dirClass = 'reveal--right';
      card.className = 'service-card reveal ' + dirClass;

      var iconWrap = document.createElement('div');
      iconWrap.className = 'service-card__icon';
      var icon = document.createElement('i');
      icon.className = 'fas ' + (service.icon || 'fa-star');
      iconWrap.appendChild(icon);

      var title = document.createElement('h3');
      title.className = 'service-card__title';
      title.textContent = service.title || '';

      var text = document.createElement('p');
      text.className = 'service-card__text';
      text.textContent = service.text || '';

      var list;
      if (Array.isArray(service.points) && service.points.length) {
        list = document.createElement('ul');
        list.className = 'service-card__list';
        service.points.forEach(function (pt) {
          var li = document.createElement('li');
          li.textContent = pt;
          list.appendChild(li);
        });
      }

      var label;
      if (service.label) {
        label = document.createElement('p');
        label.className = 'service-card__label';
        label.textContent = service.label;
      }

      card.appendChild(iconWrap);
      card.appendChild(title);
      card.appendChild(text);
      if (list) card.appendChild(list);
      if (label) card.appendChild(label);

      servicesGrid.appendChild(card);
    });

    // Підписуємо нові .reveal елементи в цій секції
    observeRevealElements(servicesGrid);

    console.log('DOM для послуг намальований. Кількість карток:', services.length);
  }

  if (servicesGrid) {
    fetch('data/services.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Bad status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        console.log('Завантажено services.json:', data);
        if (Array.isArray(data) && data.length) {
          renderServices(data);
        } else {
          console.warn('services.json не масив або порожній, малюємо fallback');
          renderServices(fallbackServices);
        }
      })
      .catch(function (err) {
        console.warn('Проблема з fetch services.json, малюємо fallback:', err);
        renderServices(fallbackServices);
      });
  }

  /* ===========================
     ДИНАМІЧНИЙ FAQ (faq.json)
  ============================ */

  var faqContainer = document.querySelector('.js-faq-list');

  var fallbackFaq = [
    {
      question: 'Чи обовʼязково купувати техніку саме у вас?',
      answer:
        'Ні 🙂 Ми можемо просто допомогти з вибором — навіть якщо купувати будеш в іншому місці. Але, звісно, у нас ми відповідаємо за весь ланцюжок: від замовлення до налаштування.'
    },
    {
      question: 'Як відбувається онлайн-налаштування?',
      answer:
        'Зазвичай це відеодзвінок або спільний екран. Крок за кроком налаштовуємо акаунти, резервні копії, хмару, потрібні застосунки. Якщо щось незрозуміло — повторюємо спокійно ще раз.'
    },
    {
      question: 'Що, якщо під час перенесення даних щось “зламається”?',
      answer:
        'Перед стартом ми завжди робимо резервну копію. Якщо щось піде не так, повернемося до збереженого стану і повторимо міграцію без втрати даних.'
    },
    {
      question: 'Чи працюєте ви тільки з Apple?',
      answer:
        'Ні, але Apple-сетапи ми справді любимо трохи більше 😅 Ми також консультуємо по Windows-ноутах, моніторах, периферії та мікрофонах/камері для роботи й стримінгу.'
    }
  ];

  function renderFaq(items) {
    if (!faqContainer) return;

    faqContainer.innerHTML = '';

    items.forEach(function (item, index) {
      var article = document.createElement('article');

      var dirClass = 'reveal--up';
      if (index % 3 === 0) dirClass = 'reveal--left';
      else if (index % 3 === 2) dirClass = 'reveal--right';

      article.className = 'faq-item reveal ' + dirClass;

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'faq-item__question';

      var spanText = document.createElement('span');
      spanText.textContent = item.question || '';

      var iconWrap = document.createElement('span');
      iconWrap.className = 'faq-item__icon';
      var icon = document.createElement('i');
      icon.className = 'fas fa-plus';
      iconWrap.appendChild(icon);

      button.appendChild(spanText);
      button.appendChild(iconWrap);

      var answerDiv = document.createElement('div');
      answerDiv.className = 'faq-item__answer';

      var p = document.createElement('p');
      p.textContent = item.answer || '';
      answerDiv.appendChild(p);

      // Клік по питанню — відкриває / закриває
      button.addEventListener('click', function () {
        article.classList.toggle('faq-item--open');
      });

      article.appendChild(button);
      article.appendChild(answerDiv);

      faqContainer.appendChild(article);
    });

    // Підписуємо .reveal для анімацій
    observeRevealElements(faqContainer);

    console.log('FAQ намальований. Кількість пунктів:', items.length);
  }

  if (faqContainer) {
    fetch('data/faq.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Bad status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        console.log('Завантажено faq.json:', data);
        if (Array.isArray(data) && data.length) {
          renderFaq(data);
        } else {
          console.warn('faq.json не масив або порожній, малюємо fallback');
          renderFaq(fallbackFaq);
        }
      })
      .catch(function (err) {
        console.warn('Проблема з fetch faq.json, малюємо fallback FAQ:', err);
        renderFaq(fallbackFaq);
      });
  }
});
