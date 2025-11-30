// scripts/checkout-step3.js

document.addEventListener("DOMContentLoaded", () => {
  const LS_CART_ITEMS = "cyber_cart_items";
  const LS_ORDER_PRICING = "cyber_order_pricing";
  const LS_ADDRESS = "cyber_checkout_address";
  const LS_SHIPPING = "cyber_checkout_shipping";

  /* ========================
     HEADER: scroll + burger
     ======================== */
   const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("scrolled"); // як на інших сторінках
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

    if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active"); // такий самий клас, як у step1/step2/cart
      burger.classList.toggle("burger--active");
    });
  }


  /* ========================
     ЗАВАНТАЖЕННЯ СУМАРІ ВІЗ localStorage
     ======================== */
  function loadSummaryFromStorage() {
    // —— товари ——
    let items = [];
    try {
      const raw = localStorage.getItem(LS_CART_ITEMS);
      if (raw) items = JSON.parse(raw);
    } catch (e) {
      items = [];
    }

    // —— ціни ——
    let pricing = null;
    try {
      const raw = localStorage.getItem(LS_ORDER_PRICING);
      if (raw) pricing = JSON.parse(raw);
    } catch (e) {
      pricing = null;
    }

    // —— адреса ——
    let addressData = null;
    try {
      const raw = localStorage.getItem(LS_ADDRESS);
      if (raw) addressData = JSON.parse(raw);
    } catch (e) {
      addressData = null;
    }

    // —— доставка ——
    let shippingData = null;
    try {
      const raw = localStorage.getItem(LS_SHIPPING);
      if (raw) shippingData = JSON.parse(raw);
    } catch (e) {
      shippingData = null;
    }

    // ===== ТОВАРИ =====
    const productsContainer = document.getElementById("summary-products");
    if (productsContainer) {
      productsContainer.innerHTML = "";

      if (items && items.length) {
        items.forEach((item) => {
          const div = document.createElement("div");
          div.className = "summary-product";
          const priceTotal = (item.price * item.qty)
            .toFixed(2)
            .replace(/\.00$/, "");

          div.innerHTML = `
            <div class="summary-product__image">
              <img src="${item.image || "images/iphone14.png"}" alt="${item.name}">
            </div>
            <div class="summary-product__text">
              <span class="summary-product__name">${item.name} × ${item.qty}</span>
              <span class="summary-product__price">$${priceTotal}</span>
            </div>
          `;
          productsContainer.appendChild(div);
        });
      }
    }

    // ===== АДРЕСА ДОСТАВКИ =====
    const addressEl = document.getElementById("summary-address");
    if (addressEl && addressData) {
      let text = addressData.fullAddress || "";
      if (addressData.name) {
        text = `${addressData.name}, ${text}`;
      }
      if (addressData.phone) {
        text += ` • ${addressData.phone}`;
      }
      addressEl.textContent = text;
    }

    // ===== СПОСІБ ДОСТАВКИ =====
    const shippingMethodEl = document.getElementById("summary-shipping-method");
    if (shippingMethodEl && shippingData) {
      let label = shippingData.title || "Доставка";
      if (shippingData.date) {
        label += ` • ${shippingData.date}`;
      }
      shippingMethodEl.textContent = label;
    }

    // ===== ЦІНИ =====
    const subtotalEl = document.getElementById("summary-subtotal");
    const discountRow = document.getElementById("summary-discount-row");
    const discountValueEl = document.getElementById("summary-discount");
    const taxEl = document.getElementById("summary-tax");
    const shippingEl = document.getElementById("summary-shipping");
    const totalEl = document.getElementById("summary-total");

    if (pricing) {
      const subtotal = Number(pricing.subtotal || 0);             // товари до знижок
      const discount = Number(pricing.totalDiscount || 0);        // промо + бонус
      const tax = Number(pricing.tax || 0);

      // доставка: якщо з Step2 є своя ціна – беремо її, інакше базову
      let shippingPrice = 0;
      if (shippingData && typeof shippingData.price === "number") {
        shippingPrice = shippingData.price;
      } else if (typeof pricing.shippingBase === "number") {
        shippingPrice = pricing.shippingBase;
      }

      if (subtotalEl) {
        subtotalEl.textContent =
          "$" + subtotal.toFixed(2).replace(/\.00$/, "");
      }
      if (taxEl) {
        taxEl.textContent =
          "$" + tax.toFixed(2).replace(/\.00$/, "");
      }
      if (shippingEl) {
        shippingEl.textContent =
          "$" + shippingPrice.toFixed(2).replace(/\.00$/, "");
      }

      if (discountRow && discountValueEl) {
        if (discount > 0) {
          discountRow.style.display = "flex";
          discountValueEl.textContent =
            "−$" + discount.toFixed(2).replace(/\.00$/, "");
        } else {
          discountRow.style.display = "none";
        }
      }

      const total = Math.max(subtotal - discount + tax + shippingPrice, 0);
      if (totalEl) {
        totalEl.textContent =
          "$" + total.toFixed(2).replace(/\.00$/, "");
      }
    }
  }


  loadSummaryFromStorage();

  /* ========================
     ТАБИ ОПЛАТИ
     ======================== */
  const paymentTabs = document.querySelectorAll(".payment-tab");

    const paymentCardFields = document.getElementById("payment-card-fields");
  const paymentAlt = document.getElementById("payment-alt");
  const paymentAltName = document.getElementById("payment-alt-name");
  const cardVisual = document.getElementById("payment-card-visual");

  function getActiveMethod() {
    const active = document.querySelector(".payment-tab.payment-tab--active");
    if (active && active.dataset.method) {
      return active.dataset.method;
    }
    return "card";
  }

  function updatePaymentView(method) {
    if (paymentCardFields && paymentAlt) {
      if (method === "card") {
        paymentCardFields.hidden = false;
        if (cardVisual) cardVisual.style.display = "";
        paymentAlt.hidden = true;
      } else {
        paymentCardFields.hidden = true;
        if (cardVisual) cardVisual.style.display = "none";
        paymentAlt.hidden = false;

        if (paymentAltName) {
          paymentAltName.textContent =
            method === "paypal-credit" ? "PayPal Credit" : "PayPal";
        }
      }
    }
  }

  paymentTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      paymentTabs.forEach((t) => t.classList.remove("payment-tab--active"));
      tab.classList.add("payment-tab--active");

      const method = tab.dataset.method || "card";
      updatePaymentView(method);
    });
  });

  // ініціалізація стану
  updatePaymentView(getActiveMethod());


  /* ========================
     ВАЛІДАЦІЯ КАРТКИ
     ======================== */
  const form = document.querySelector(".payment-form");
  // прибираємо HTML5 required, керуємо валідацією самі
  if (form) {
    ["cardholder", "cardnumber", "expdate", "cvv"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.removeAttribute("required");
    });
  }

  function validateCardForm() {
    if (!form) return false;

    const cardholder = form.querySelector('input[name="cardholder"]');
    const cardnumber = form.querySelector('input[name="cardnumber"]');
    const expdate = form.querySelector('input[name="expdate"]');
    const cvv = form.querySelector('input[name="cvv"]');

    // імʼя – тільки букви + пробіли, мінімум 2 символи
    const nameVal = (cardholder?.value || "").trim();
    if (!/^[A-Za-zА-Яа-яІіЇїЄє'\- ]{2,}$/.test(nameVal)) {
      alert("Введи коректне ім’я власника картки (лише літери).");
      cardholder?.focus();
      return false;
    }

    // номер картки – тільки цифри, 16 цифр
    const cardVal = (cardnumber?.value || "").replace(/\s+/g, "");
    if (!/^\d{16}$/.test(cardVal)) {
      alert("Номер картки має містити 16 цифр.");
      cardnumber?.focus();
      return false;
    }

    // термін дії – 4 цифри (MMYY)
    const expVal = (expdate?.value || "").replace(/\D+/g, "");
    if (!/^\d{4}$/.test(expVal)) {
      alert("Термін дії введи у форматі MMYY (4 цифри).");
      expdate?.focus();
      return false;
    }
    const month = parseInt(expVal.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      alert("Місяць у терміні дії має бути від 01 до 12.");
      expdate?.focus();
      return false;
    }

    // CVV – 3 цифри
    const cvvVal = (cvv?.value || "").replace(/\D+/g, "");
    if (!/^\d{3}$/.test(cvvVal)) {
      alert("CVV має містити 3 цифри.");
      cvv?.focus();
      return false;
    }

    return true;
  }

  /* ========================
     КНОПКИ BACK / PAY
     ======================== */

  const backBtn = document.querySelector(".payment-buttons .btn-outline");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "checkout-step2.html";
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const method = getActiveMethod();

      if (method === "card") {
        if (!validateCardForm()) return;
      } else if (method === "paypal") {
        alert("Тут мав би бути редірект на PayPal. Зараз це демо 😊");
      } else if (method === "paypal-credit") {
        alert("Тут міг би бути PayPal Credit. Поки що – демо-режим.");
      }

      alert("Дякуємо! Замовлення успішно оформлено 💜");
      window.location.href = "index.html";
    });
  }
});
