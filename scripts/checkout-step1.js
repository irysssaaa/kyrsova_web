// ===== HEADER: burger + scroll color =====
document.addEventListener('DOMContentLoaded', () => {
  const LS_ADDRESS = "cyber_checkout_address";
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  

  // burger menu
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // header scroll color
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // ===== АДРЕСИ =====
  const addressList = document.querySelector('.address-list');
  const addressCards = document.querySelectorAll('.address-card');

  const addressModal = document.getElementById('address-modal');
  const addressForm = document.getElementById('address-form');
  const modalTitle = document.getElementById('address-modal-title');
  const nameInput = document.getElementById('address-name-input');
  const tagInput = document.getElementById('address-tag-input');
  const lineInput = document.getElementById('address-line-input');
  const phoneInput = document.getElementById('address-phone-input');
  const errorBox = document.getElementById('address-form-error');
  const modalCancelBtn = document.getElementById('address-cancel-btn');

  const addAddressBtn = document.querySelector('.address-add');

  let editingCard = null;   // null = створюємо нову
  let isNewAddress = false; // режим створення

  // допоміжні функції
  function openModal(options = {}) {
    const { mode = 'edit', card = null } = options;
    editingCard = card;
    isNewAddress = mode === 'new';
    errorBox.textContent = '';

    if (mode === 'edit' && card) {
      modalTitle.textContent = 'Редагувати адресу';

      const nameEl = card.querySelector('.address-card__name');
      const tagEl = card.querySelector('.address-card__tag');
      const lines = card.querySelectorAll('.address-card__line');

      const addressLine = lines[0] ? lines[0].textContent.trim() : '';
      let phone = '';
      if (lines[1]) {
        // приберемо "Контакт:"
        phone = lines[1].textContent.replace('Контакт:', '').trim();
      }

      nameInput.value = nameEl ? nameEl.textContent.trim() : '';
      lineInput.value = addressLine;
      phoneInput.value = phone;

      let tagValue = tagEl ? (tagEl.dataset.tag || 'home') : 'home';
      tagInput.value = tagValue;

    } else {
      modalTitle.textContent = 'Нова адреса';
      nameInput.value = '';
      lineInput.value = '';
      phoneInput.value = '';
      tagInput.value = 'home';
    }

    addressModal.classList.add('address-modal--open');
    addressModal.setAttribute('aria-hidden', 'false');
    nameInput.focus();
  }

  function closeModal() {
    addressModal.classList.remove('address-modal--open');
    addressModal.setAttribute('aria-hidden', 'true');
    editingCard = null;
    isNewAddress = false;
  }

  // клац по бекдропу
  if (addressModal) {
    const backdrop = addressModal.querySelector('.address-modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  // вибір карточки (radio + підсвічування)
  function selectCard(card) {
    document
      .querySelectorAll('.address-card')
      .forEach((c) => c.classList.remove('address-card--selected'));

    card.classList.add('address-card--selected');

    const radio = card.querySelector('.address-card__radio');
    if (radio) radio.checked = true;
  }

  function updateTagEl(tagEl, tagValue) {
    if (!tagEl) return;
    tagEl.classList.remove('address-card__tag--secondary');
    tagEl.dataset.tag = tagValue;

    if (tagValue === 'home') {
      tagEl.textContent = 'ДІМ';
    } else if (tagValue === 'office') {
      tagEl.textContent = 'ОФІС';
      tagEl.classList.add('address-card__tag--secondary');
    } else {
      tagEl.textContent = 'ІНШЕ';
      tagEl.classList.add('address-card__tag--secondary');
    }
  }

  function attachCardHandlers(card) {
    const radio = card.querySelector('.address-card__radio');
    const editBtn = card.querySelector('[data-action="edit"]');
    const deleteBtn = card.querySelector('[data-action="delete"]');

    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      selectCard(card);
    });

    if (radio) {
      radio.addEventListener('change', () => {
        selectCard(card);
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal({ mode: 'edit', card });
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.remove();

        // якщо видалили вибрану – зробити активною першу, якщо є
        const firstCard = document.querySelector('.address-card');
        if (firstCard) {
          selectCard(firstCard);
        }
      });
    }
  }

  addressCards.forEach((card) => attachCardHandlers(card));

  // "Додати нову адресу"
  if (addAddressBtn) {
    addAddressBtn.addEventListener('click', () => {
      openModal({ mode: 'new' });
    });
  }

  // очищення помилки при зміні інпуту
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      errorBox.textContent = '';
    });
  }
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      errorBox.textContent = '';
    });
  }
  if (lineInput) {
    lineInput.addEventListener('input', () => {
      errorBox.textContent = '';
    });
  }

  // збереження форми (редагування / нова)
  if (addressForm) {
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.textContent = '';

      const nameVal = nameInput.value.trim();
      const tagVal = tagInput.value;
      const lineVal = lineInput.value.trim();
      const phoneVal = phoneInput.value.trim();

      // прості перевірки на заповнення
      if (!nameVal || !lineVal || !phoneVal) {
        errorBox.textContent = 'Будь ласка, заповніть назву, адресу та телефон.';
        return;
      }

      // Валідація номера: тільки формат +380XXXXXXXXX
      const phonePattern = /^\+380\d{9}$/;
      if (!phonePattern.test(phoneVal)) {
        errorBox.textContent = 'Введіть номер телефону у форматі +380XXXXXXXXX (наприклад, +380931234567).';
        return;
      }

      if (isNewAddress) {
        // створюємо нову картку
        const template = document.querySelector('.address-card');
        if (!template || !addressList) {
          closeModal();
          return;
        }

        const newCard = template.cloneNode(true);
        newCard.classList.remove('address-card--selected');

        const radio = newCard.querySelector('.address-card__radio');
        const nameEl = newCard.querySelector('.address-card__name');
        const tagEl = newCard.querySelector('.address-card__tag');
        const lines = newCard.querySelectorAll('.address-card__line');

        if (radio) {
          radio.checked = false;
        }

        if (nameEl) {
          nameEl.textContent = nameVal;
        }

        if (lines[0]) {
          lines[0].textContent = lineVal;
        }

        if (lines[1]) {
          lines[1].innerHTML =
            '<span class="address-card__contact-label">Контакт:</span> ' +
            phoneVal;
        }

        updateTagEl(tagEl, tagVal);

        // нові кнопки мають свої слухачі
        attachCardHandlers(newCard);

        addressList.appendChild(newCard);
        selectCard(newCard);

      } else if (editingCard) {
        // оновлюємо існуючу картку
        const card = editingCard;
        const nameEl = card.querySelector('.address-card__name');
        const tagEl = card.querySelector('.address-card__tag');
        const lines = card.querySelectorAll('.address-card__line');

        if (nameEl) {
          nameEl.textContent = nameVal;
        }

        if (lines[0]) {
          lines[0].textContent = lineVal;
        }

        if (lines[1]) {
          lines[1].innerHTML =
            '<span class="address-card__contact-label">Контакт:</span> ' +
            phoneVal;
        }

        updateTagEl(tagEl, tagVal);
      }

      closeModal();
    });
  }

  // ===== КНОПКИ "НАЗАД" І "ДАЛІ" =====
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

 if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    // шукаємо вибрану адресу
    let selectedCard =
      document.querySelector('.address-card.address-card--selected') ||
      document.querySelector('.address-card__radio:checked')?.closest('.address-card');

    if (selectedCard) {
      const nameEl = selectedCard.querySelector('.address-card__name');
      const lines = selectedCard.querySelectorAll('.address-card__line');

      const name = nameEl ? nameEl.textContent.trim() : '';
      const fullAddress = lines[0] ? lines[0].textContent.trim() : '';

      let phone = '';
      if (lines[1]) {
        phone = lines[1].textContent.replace('Контакт:', '').trim();
      }

      const addressData = { name, fullAddress, phone };

      try {
        localStorage.setItem(LS_ADDRESS, JSON.stringify(addressData));
      } catch (e) {
        // якщо щось з localStorage, просто пропустимо
      }
    }

    window.location.href = 'checkout-step2.html';
  });
}
});
