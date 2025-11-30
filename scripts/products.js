// scripts/products.js

document.addEventListener('DOMContentLoaded', () => {
  /* ===== BURGER-МЕНЮ ===== */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  /* ===== ЗМІНА КОЛЬОРУ ХЕДЕРА ПРИ СКРОЛІ ===== */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll);

  /* ===== АКОРДЕОН ФІЛЬТРІВ ===== */
  const filterGroups = document.querySelectorAll('.filter-group');

  filterGroups.forEach((group) => {
    const headerBtn = group.querySelector('.filter-group__header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', () => {
      group.classList.toggle('is-open');
    });
  });

  /* ===== ФІЛЬТРИ + СОРТУВАННЯ ===== */
  const grid = document.querySelector('.catalog-grid');
  const cards = Array.from(document.querySelectorAll('.catalog-card'));
  const brandCheckboxes = Array.from(
    document.querySelectorAll('.brand-list .checkbox input')
  );
  const sortSelect = document.getElementById('sort-select');
  const countSpan = document.querySelector('.catalog-top__count');

  if (grid && cards.length) {
    // початковий порядок карток (для сортування "Новинки")
    cards.forEach((card, index) => {
      card.dataset.initialIndex = String(index);
    });

    function getActiveBrands() {
      return brandCheckboxes
        .filter((cb) => cb.checked && cb.value)
        .map((cb) => cb.value.toLowerCase());
    }

    function getCardPrice(card) {
      if (card.dataset.price) {
        return parseFloat(card.dataset.price);
      }
      const priceEl = card.querySelector('.catalog-card__price');
      if (!priceEl) return 0;
      const num = priceEl.textContent.replace(/[^0-9.]/g, '');
      return parseFloat(num || '0');
    }

    function getCardRating(card) {
      if (card.dataset.rating) {
        return parseFloat(card.dataset.rating);
      }
      return 0;
    }

    function applyFiltersAndSort() {
      let filtered = [...cards];

      // ---- фільтр по брендах ----
      const activeBrands = getActiveBrands();
      if (activeBrands.length > 0) {
        filtered = filtered.filter((card) => {
          const brand = (card.dataset.brand || '').toLowerCase();
          if (!brand) return true; // якщо не вказано бренд – не ховаємо
          return activeBrands.includes(brand);
        });
      }

      // ---- сортування ----
      const sortValue = sortSelect ? sortSelect.value : 'rating';

      filtered.sort((a, b) => {
        if (sortValue === 'price-asc') {
          return getCardPrice(a) - getCardPrice(b);
        }
        if (sortValue === 'price-desc') {
          return getCardPrice(b) - getCardPrice(a);
        }
        if (sortValue === 'new') {
          return (
            parseInt(b.dataset.initialIndex || '0', 10) -
            parseInt(a.dataset.initialIndex || '0', 10)
          );
        }
        // за рейтингом (за замовчуванням)
        return getCardRating(b) - getCardRating(a);
      });

      // ---- оновлюємо DOM ----
      grid.innerHTML = '';
      filtered.forEach((card) => grid.appendChild(card));

      if (countSpan) {
        countSpan.textContent = filtered.length;
      }
    }

    brandCheckboxes.forEach((cb) => {
      cb.addEventListener('change', applyFiltersAndSort);
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', applyFiltersAndSort);
    }

    // перший запуск
    applyFiltersAndSort();
  }

  /* ===== КНОПКИ "КУПИТИ" → product.html ===== */
  const buyButtons = document.querySelectorAll('.catalog-card__btn');

  buyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // поки що всі ведуть на один product.html
      window.location.href = 'product.html';
    });
  });
});
