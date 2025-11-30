// ================= HEADER: burger + scroll color =================

// burger menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// header scroll color
const header = document.getElementById("header");

if (header) {
  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
}

// ================= CART LOGIC =================

const TAX_VALUE = 50; // $50
const SHIPPING_VALUE = 29; // $29
const LS_CART_ITEMS = "cyber_cart_items";
const LS_ORDER_PRICING = "cyber_order_pricing";

const cartItems = document.querySelectorAll(".cart-item");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

// промокод + бонусна картка
let promoDiscountPercent = 0; // 0.1 = 10%
let bonusDiscount = 0;        // $20, наприклад

const promoInput = document.getElementById("promo-code");
const bonusInput = document.getElementById("bonus-card");
const bonusButton = document.querySelector(".field-btn");

// елементи для повідомлень під полями
let promoMsgEl = null;
let bonusMsgEl = null;

if (promoInput) {
  const promoBlock = promoInput.closest(".summary-block");
  if (promoBlock) {
    promoMsgEl = document.createElement("p");
    promoMsgEl.className = "field-message";
    promoBlock.appendChild(promoMsgEl);
  }
}

if (bonusInput) {
  const bonusBlock = bonusInput.closest(".summary-block");
  if (bonusBlock) {
    bonusMsgEl = document.createElement("p");
    bonusMsgEl.className = "field-message";
    bonusBlock.appendChild(bonusMsgEl);
  }
}

function setPromoMessage(text, isError = false) {
  if (!promoMsgEl) return;
  promoMsgEl.textContent = text;
  promoMsgEl.classList.toggle("field-message--error", isError);
  promoMsgEl.classList.toggle("field-message--success", !isError);
}

function setBonusMessage(text, isError = false) {
  if (!bonusMsgEl) return;
  bonusMsgEl.textContent = text;
  bonusMsgEl.classList.toggle("field-message--error", isError);
  bonusMsgEl.classList.toggle("field-message--success", !isError);
}

/**
 * Перерахунок subtotal та total
 */
function recalcTotals() {
  let subtotal = 0;

  document.querySelectorAll(".cart-item").forEach((item) => {
    const basePrice = Number(item.dataset.price || 0);
    const qtyEl = item.querySelector(".counter-value");
    const qty = qtyEl ? Number(qtyEl.textContent) || 0 : 0;
    subtotal += basePrice * qty;
  });

  // застосовуємо знижку за промокодом до суми товарів
  let discountedSubtotal = subtotal;
  if (promoDiscountPercent > 0) {
    discountedSubtotal = Math.round(subtotal * (1 - promoDiscountPercent));
  }

  if (subtotalEl) {
    subtotalEl.textContent = `$${discountedSubtotal}`;
  }

  // підсумок з податком/доставкою і бонусною знижкою
  let total = discountedSubtotal + TAX_VALUE + SHIPPING_VALUE - bonusDiscount;
  if (total < 0) total = 0;

  if (totalEl) {
    totalEl.textContent = `$${total}`;
  }

  // 🔹 НОВЕ: зберігаємо все в localStorage для Step3
  saveCartToStorage(subtotal, discountedSubtotal, total);
}
function saveCartToStorage(subtotal, discountedSubtotal, total) {
  if (typeof Storage === "undefined") return;

  // товари з кошика
  const itemsData = [];
  document.querySelectorAll(".cart-item").forEach((item) => {
    const nameEl = item.querySelector(".cart-item__name");
    const name = nameEl ? nameEl.textContent.trim() : "";

    const price = Number(item.dataset.price || 0);

    const qtyEl = item.querySelector(".counter-value");
    const qty = qtyEl ? Number(qtyEl.textContent) || 0 : 0;

    const imgEl = item.querySelector(".cart-item__image img");
    const image = imgEl ? imgEl.getAttribute("src") : "";

    if (qty > 0 && price > 0) {
      itemsData.push({ name, price, qty, image });
    }
  });

  // знижки
  const promoPart = subtotal - discountedSubtotal; // знижка по промокоду (якщо є)
  const promoDiscount = promoPart > 0 ? promoPart : 0;
  const bonusDiscountValue = bonusDiscount > 0 ? bonusDiscount : 0;

  const pricing = {
    subtotal,             // сума товарів ДО знижок
    discountedSubtotal,   // після промокоду
    tax: TAX_VALUE,
    shippingBase: SHIPPING_VALUE,
    promoDiscount,
    bonusDiscount: bonusDiscountValue,
    totalDiscount: promoDiscount + bonusDiscountValue,
    total,                // підсумок у кошику
  };

  try {
    localStorage.setItem(LS_CART_ITEMS, JSON.stringify(itemsData));
    localStorage.setItem(LS_ORDER_PRICING, JSON.stringify(pricing));
  } catch (e) {
    // нічого страшного, якщо localStorage недоступний
  }
}


/**
 * Оновлення ціни в одній картці
 */
function updateItemPrice(item) {
  const basePrice = Number(item.dataset.price || 0);
  const qty = Number(item.querySelector(".counter-value").textContent) || 0;
  const priceEl = item.querySelector(".cart-item__price");
  if (priceEl) {
    priceEl.textContent = `$${basePrice * qty}`;
  }
}

/**
 *  Навішуємо обробники на одну картку
 */
function attachItemHandlers(item) {
  const minusBtn = item.querySelector(".counter-btn--minus");
  const plusBtn = item.querySelector(".counter-btn--plus");
  const valueEl = item.querySelector(".counter-value");
  const removeBtn = item.querySelector(".cart-item__remove");

  if (!valueEl) return;

  plusBtn &&
    plusBtn.addEventListener("click", () => {
      let current = Number(valueEl.textContent) || 1;
      current += 1;
      valueEl.textContent = String(current);
      updateItemPrice(item);
      recalcTotals();
    });

  minusBtn &&
    minusBtn.addEventListener("click", () => {
      let current = Number(valueEl.textContent) || 1;
      if (current > 1) {
        current -= 1;
        valueEl.textContent = String(current);
        updateItemPrice(item);
        recalcTotals();
      }
    });

  removeBtn &&
    removeBtn.addEventListener("click", () => {
      item.remove();
      recalcTotals();
    });
}

// ініціалізація для всіх карток
cartItems.forEach((item) => {
  attachItemHandlers(item);
});

// ===== Логіка промокоду =====

function applyPromo() {
  if (!promoInput) return;
  const code = promoInput.value.trim().toUpperCase();

  if (!code) {
    promoDiscountPercent = 0;
    setPromoMessage("Введіть промокод", true);
    recalcTotals();
    return;
  }

  if (code === "CYBER10") {
    promoDiscountPercent = 0.1;
    setPromoMessage("Промокод CYBER10 застосовано: -10% до суми товарів", false);
  } else if (code === "APPLE5") {
    promoDiscountPercent = 0.05;
    setPromoMessage("Промокод APPLE5 застосовано: -5% до суми товарів", false);
  } else {
    promoDiscountPercent = 0;
    setPromoMessage("Такий промокод не знайдено", true);
  }

  recalcTotals();
}

if (promoInput) {
  promoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyPromo();
    }
  });
}

// ===== Логіка бонусної картки =====

function applyBonusCard() {
  if (!bonusInput) return;
  const card = bonusInput.value.trim();
  const digits = card.replace(/\D/g, ""); // все, що не цифра, прибираємо

  if (!digits) {
    bonusDiscount = 0;
    setBonusMessage("Введіть номер бонусної картки", true);
    recalcTotals();
    return;
  }

  if (digits.length >= 8) {
    bonusDiscount = 20; // фіксована знижка
    setBonusMessage("Картку застосовано: -$20 до замовлення", false);
  } else {
    bonusDiscount = 0;
    setBonusMessage("Номер картки виглядає некоректним", true);
  }

  recalcTotals();
}

if (bonusButton) {
  bonusButton.addEventListener("click", () => {
    applyBonusCard();
  });
}

// початковий підрахунок
recalcTotals();
