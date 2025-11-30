// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// ===== HEADER SCROLL COLOR =====
const headerEl = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
});

// ===== HERO GALLERY =====
function changeImage(el) {
  const main = document.getElementById('main-img');
  if (!main) return;

  main.src = el.src;
  document.querySelectorAll('.thumbs img').forEach(img => img.classList.remove('active'));
  el.classList.add('active');
}

// ===== ПЕРЕХІД: КАТЕГОРІЯ "СМАРТФОНИ" → products.html =====
const smartphoneCard = document.querySelector('.card-smartphones');

if (smartphoneCard) {
  smartphoneCard.style.cursor = 'pointer';

  const goToProducts = () => {
    window.location.href = 'products.html';
  };

  smartphoneCard.addEventListener('click', goToProducts);
  smartphoneCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') goToProducts();
  });
}

// ===== ГОЛОВНА КНОПКА "КУПИТИ ЗАРАЗ" У HERO → product.html =====
const heroBuyBtn = document.querySelector('.hero-buy-btn');
if (heroBuyBtn) {
  heroBuyBtn.addEventListener('click', () => {
    window.location.href = 'product.html';
  });
}

// ===== BLOCK 4: НОВИНКИ – перша карточка iPhone → product.html =====
const mainIphoneCard = document.querySelector('.product-card-main-iphone');
const mainIphoneBuyBtn = document.querySelector('.product-main-buy');

function goToProductPage() {
  window.location.href = 'product.html';
}

if (mainIphoneCard) {
  mainIphoneCard.style.cursor = 'pointer';

  mainIphoneCard.addEventListener('click', (e) => {
    // щоб не дублювати з кліком по кнопці — дозволяємо всередині все, окрім інших кнопок
    if (e.target && e.target.closest('button')) return;
    goToProductPage();
  });
}

if (mainIphoneBuyBtn) {
  mainIphoneBuyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToProductPage();
  });
}

// ===== SALE TIMER: до 15 грудня (поточного або наступного року) =====
(function initSaleTimer() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function getNextDeadline() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // 15 грудня поточного року, 23:59:59
    let deadline = new Date(currentYear, 11, 15, 23, 59, 59);

    // якщо вже пізніше – беремо 15 грудня наступного року
    if (deadline.getTime() <= now.getTime()) {
      deadline = new Date(currentYear + 1, 11, 15, 23, 59, 59);
    }
    return deadline;
  }

  let deadline = getNextDeadline();

  function updateTimer() {
    const now = new Date().getTime();
    let diff = deadline.getTime() - now;

    // якщо чомусь пішло в мінус — оновлюємо дедлайн на наступний рік
    if (diff <= 0) {
      deadline = getNextDeadline();
      diff = deadline.getTime() - now;
    }

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();
