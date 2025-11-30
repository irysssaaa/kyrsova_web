// scripts/product.js

document.addEventListener("DOMContentLoaded", () => {
  /* ========== HEADER ========== */
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

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

  /* ========== ГАЛЕРЕЯ ФОТО ========== */

  const mainImg = document.getElementById("product-main-image");
  const thumbs = document.querySelectorAll(".thumb");

  if (mainImg && thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const innerImg = thumb.querySelector("img");

        if (innerImg) {
          mainImg.src = innerImg.src;
          mainImg.alt = innerImg.alt || mainImg.alt;
        }

        thumbs.forEach((t) => t.classList.remove("thumb--active"));
        thumb.classList.add("thumb--active");
      });
    });
  }

  /* ========== КОЛЬОРИ + Наявність (silver = нема в наявності) ========== */

  const colorDots = document.querySelectorAll(".color-dot");
  const addToCartBtn = document.querySelector(".btn-primary");
  const productActions = document.querySelector(".product-actions");

  // створюємо елемент статусу наявності динамічно
  let stockStatusEl = null;
  if (productActions) {
    stockStatusEl = document.createElement("p");
    stockStatusEl.className = "product-stock";
    stockStatusEl.textContent = "В наявності";
    productActions.appendChild(stockStatusEl);
  }

  function setOutOfStock(isOut) {
    if (!addToCartBtn || !stockStatusEl) return;

    if (isOut) {
      addToCartBtn.classList.add("btn-primary--disabled");
      addToCartBtn.disabled = true;
      stockStatusEl.textContent = "Немає в наявності";
      stockStatusEl.classList.add("product-stock--out");
    } else {
      addToCartBtn.classList.remove("btn-primary--disabled");
      addToCartBtn.disabled = false;
      stockStatusEl.textContent = "В наявності";
      stockStatusEl.classList.remove("product-stock--out");
    }
  }

  if (colorDots.length) {
    colorDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        colorDots.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");

        const color = dot.dataset.color || "";

        // silver = типу "білий" – робимо його відсутнім
        if (color === "silver") {
          setOutOfStock(true);
        } else {
          setOutOfStock(false);
        }
      });
    });

    // при старті подивимось, який колір активний (раптом silver)
    const activeDot = document.querySelector(".color-dot.active");
    if (activeDot && activeDot.dataset.color === "silver") {
      setOutOfStock(true);
    } else {
      setOutOfStock(false);
    }
  }

  /* ========== ПАМ’ЯТЬ + ЦІНА ========== */

  const memoryTabs = document.querySelectorAll(".memory-tab");
  const priceCurrent = document.querySelector(".product-price-current");
  const priceOld = document.querySelector(".product-price-old");

  // ціни для кожного об’єму пам’яті
  const memoryPrices = {
    "128": { current: 1199, old: 1299 },
    "256": { current: 1299, old: 1399 },
    "512": { current: 1349, old: 1449 },
    "1024": { current: 1399, old: 1499 }, // 1TB
  };

  function updatePrice(memoryKey) {
    if (!priceCurrent || !priceOld) return;
    const prices = memoryPrices[memoryKey];
    if (!prices) return;

    priceCurrent.textContent = `$${prices.current}`;
    priceOld.textContent = `$${prices.old}`;
  }

  if (memoryTabs.length) {
    memoryTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        memoryTabs.forEach((t) => t.classList.remove("memory-tab--active"));
        tab.classList.add("memory-tab--active");

        const mem = tab.dataset.memory;
        updatePrice(mem);
      });
    });

    // виставляємо ціну відповідно до активного таба при завантаженні
    const activeTab = document.querySelector(".memory-tab.memory-tab--active");
    if (activeTab) {
      updatePrice(activeTab.dataset.memory);
    }
  }

  /* ========== ДЕТАЛІ: "Показати більше" ========== */

  const detailsMoreBtn = document.querySelector(".details-more__btn");
  const detailsExtra = document.querySelector(".details-extra");

  if (detailsMoreBtn && detailsExtra) {
    // .details-extra спочатку прихований через CSS
    detailsMoreBtn.addEventListener("click", () => {
      const isOpen = detailsExtra.classList.toggle("details-extra--open");
      const btnTextNode = detailsMoreBtn.firstChild;

      if (btnTextNode && btnTextNode.nodeType === Node.TEXT_NODE) {
        btnTextNode.textContent = isOpen ? "Приховати " : "Показати більше ";
      }
    });
  }

  /* ========== ВІДГУКИ: вибір зірок + додавання "Гостя" ========== */

  const reviewsList = document.querySelector(".reviews-list");
  const commentTextarea = document.querySelector(".leave-comment textarea");
  const commentSubmit = document.querySelector(".leave-comment__btn");

  const ratingContainer = document.querySelector(".leave-comment__stars");
  const ratingStars = ratingContainer
    ? ratingContainer.querySelectorAll(".rating-star")
    : [];

  // вибір кількості зірок в формі
  if (ratingContainer && ratingStars.length) {
    ratingContainer.dataset.rating = "5"; // за замовчуванням 5

    ratingStars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.dataset.value || "5", 10);
        ratingContainer.dataset.rating = String(value);

        ratingStars.forEach((s) => {
          const sv = parseInt(s.dataset.value || "0", 10);
          s.classList.toggle("active", sv <= value);
        });
      });
    });
  }

  // додавання нового коментаря
  if (commentTextarea && commentSubmit && reviewsList) {
    commentSubmit.addEventListener("click", () => {
      const text = commentTextarea.value.trim();
      if (!text) return;

      const now = new Date();
      const machineDate = now.toISOString().split("T")[0];
      const humanDate = now.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // поточний рейтинг (1–5), за замовчуванням 5
      let rating = 5;
      if (ratingContainer) {
        const r = parseInt(ratingContainer.dataset.rating || "5", 10);
        if (!Number.isNaN(r) && r >= 1 && r <= 5) {
          rating = r;
        }
      }

      // генеруємо HTML зірок
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          starsHTML += '<i class="fas fa-star"></i>';
        } else {
          starsHTML += '<i class="far fa-star"></i>';
        }
      }

      const review = document.createElement("article");
      review.className = "review review--user";
      review.innerHTML = `
        <div class="review__avatar review__avatar--icon">
          <i class="fas fa-heart"></i>
        </div>
        <div class="review__content">
          <div class="review__header">
            <div class="review__title">
              <span class="review__name">Гість</span>
              <div class="review__stars">
                ${starsHTML}
              </div>
            </div>
            <time class="review__date" datetime="${machineDate}">${humanDate}</time>
          </div>
          <p class="review__text">${text}</p>
        </div>
      `;

      // додати новий відгук на початок списку
      reviewsList.insertBefore(review, reviewsList.firstChild);

      // очистити textarea
      commentTextarea.value = "";
      commentTextarea.focus();
    });
  }

  /* ========== "Показати більше" коментарів ========== */

  const reviewsMoreBtn = document.querySelector(".reviews-more__btn");

  if (reviewsMoreBtn && reviewsList) {
    reviewsMoreBtn.addEventListener("click", () => {
      const extraReviews = reviewsList.querySelectorAll(".review--extra");
      extraReviews.forEach((rev) => {
        rev.classList.remove("review--extra");
      });

      reviewsMoreBtn.style.display = "none";
    });
  }

  /* ========== ЛАЙКИ У СХОЖИХ ТОВАРАХ ========== */

  const relatedLikes = document.querySelectorAll(".related-card__like");

  relatedLikes.forEach((btn) => {
    btn.addEventListener("click", () => {
      const icon = btn.querySelector("i");
      if (!icon) return;
      icon.classList.toggle("far");
      icon.classList.toggle("fas");
    });
  });
    /* ========== ЛАЙТБОКС ДЛЯ ФОТО З ВІДГУКІВ ========== */

  const reviewPhotos = Array.from(document.querySelectorAll(".review-photo"));
  const lightbox = document.getElementById("review-lightbox");
  const lightboxImg = document.getElementById("review-lightbox-image");
  const lightboxOverlay = document.querySelector(".review-lightbox__overlay");
  const lightboxClose = document.querySelector(".review-lightbox__close");
  const lightboxPrev = document.querySelector(".review-lightbox__arrow--prev");
  const lightboxNext = document.querySelector(".review-lightbox__arrow--next");

  let currentPhotoIndex = -1;

  function openLightboxByIndex(index) {
    if (!lightbox || !lightboxImg) return;
    const btn = reviewPhotos[index];
    if (!btn) return;

    const img = btn.querySelector("img");
    if (!img) return;

    const src = btn.dataset.full || img.src;

    currentPhotoIndex = index;
    lightboxImg.src = src;
    lightboxImg.alt = img.alt || "";
    lightbox.classList.add("review-lightbox--open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("review-lightbox--open");
    lightboxImg.src = "";
    currentPhotoIndex = -1;
    document.body.style.overflow = "";
  }

  function showPrevPhoto() {
    if (!reviewPhotos.length) return;
    if (currentPhotoIndex <= 0) {
      currentPhotoIndex = reviewPhotos.length - 1;
    } else {
      currentPhotoIndex -= 1;
    }
    openLightboxByIndex(currentPhotoIndex);
  }

  function showNextPhoto() {
    if (!reviewPhotos.length) return;
    if (currentPhotoIndex >= reviewPhotos.length - 1) {
      currentPhotoIndex = 0;
    } else {
      currentPhotoIndex += 1;
    }
    openLightboxByIndex(currentPhotoIndex);
  }

  // відкриття по кліку на превʼю
  reviewPhotos.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      openLightboxByIndex(index);
    });
  });

  // закриття
  lightboxOverlay && lightboxOverlay.addEventListener("click", closeLightbox);
  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);

  // стрілки
  lightboxPrev && lightboxPrev.addEventListener("click", showPrevPhoto);
  lightboxNext && lightboxNext.addEventListener("click", showNextPhoto);

  // клавіатура: Esc / ← / →
  window.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("review-lightbox--open")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      showPrevPhoto();
    } else if (e.key === "ArrowRight") {
      showNextPhoto();
    }
  });


});
