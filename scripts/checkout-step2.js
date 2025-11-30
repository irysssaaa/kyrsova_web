document.addEventListener("DOMContentLoaded", () => {
  const LS_SHIPPING = "cyber_checkout_shipping";

  /* ===== ХЕДЕР: скрол + бургер ===== */
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
  }

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  /* ===== ВИБІР МЕТОДУ ДОСТАВКИ ===== */
  const shippingMethods = document.querySelectorAll(".shipping-method");

  if (shippingMethods.length) {
    shippingMethods.forEach((method) => {
      const radio = method.querySelector('input[type="radio"]');

      method.addEventListener("click", (event) => {
        // Не ламаємо клік по інпуту дати
        if (event.target.closest(".shipping-date-input")) return;

        if (radio) {
          radio.checked = true;
        }

        shippingMethods.forEach((m) =>
          m.classList.remove("shipping-method--active")
        );
        method.classList.add("shipping-method--active");
      });

      if (radio) {
        radio.addEventListener("change", () => {
          shippingMethods.forEach((m) =>
            m.classList.remove("shipping-method--active")
          );
          method.classList.add("shipping-method--active");
        });
      }
    });
  }

  /* ===== КАЛЕНДАР: запланована доставка ===== */
  const scheduledInput = document.getElementById("scheduled-date");
  const minLabel = document.getElementById("scheduled-min-label");

  if (scheduledInput && minLabel) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7); // +7 днів від поточної

    // Формат YYYY-MM-DD для input[type=date]
    const toInputDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    // Текст українською для підказки
    const monthsUa = [
      "січня",
      "лютого",
      "березня",
      "квітня",
      "травня",
      "червня",
      "липня",
      "серпня",
      "вересня",
      "жовтня",
      "листопада",
      "грудня",
    ];

    const minDateStr = toInputDate(minDate);
    scheduledInput.min = minDateStr;
    scheduledInput.value = minDateStr; // за замовчуванням — найперша доступна дата

        const niceText = `${minDate.getDate()} ${
      monthsUa[minDate.getMonth()]
    } ${minDate.getFullYear()} року`;
    minLabel.textContent = niceText;
  }

  // 🔸 КНОПКА "Далі" – зберігаємо обраний спосіб доставки
  const nextBtn = document.querySelector('.checkout-buttons .btn-primary');

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const active = document.querySelector('.shipping-method.shipping-method--active');

      let methodValue = 'regular';
      let title = 'Доставка';
      let date = '';
      let price = 0;

      if (active) {
        const radio = active.querySelector('input[type="radio"]');
        if (radio && radio.value) {
          methodValue = radio.value; // regular / express / scheduled
        }

        const mainSpan = active.querySelector('.shipping-main');
        if (mainSpan) {
          title = mainSpan.textContent.trim(); // "Звичайна доставка", "Доставка якнайшвидше" і т.д.
        }

        const dateEl = active.querySelector('.shipping-date');
        const scheduledInput = active.querySelector('#scheduled-date');

        if (methodValue === 'scheduled' && scheduledInput && scheduledInput.value) {
          date = scheduledInput.value; // YYYY-MM-DD
        } else if (dateEl) {
          date = dateEl.textContent.trim();
        }

        // 💰 ЦІНА ДОСТАВКИ
        if (methodValue === 'express') {
          price = 8.5;        // Платна доставка
        } else {
          price = 0;          // Звичайна і запланована — безкоштовні (можеш змінити, якщо треба)
        }
      }

      const shippingData = { method: methodValue, title, date, price };

      try {
        localStorage.setItem(LS_SHIPPING, JSON.stringify(shippingData));
      } catch (e) {
        // якщо localStorage недоступний — просто ігноруємо
      }

      window.location.href = 'checkout-step3.html';
    });
  }

});
