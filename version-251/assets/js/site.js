(() => {
  const menuButton = document.querySelector(".mobile-menu-button");
  const mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mobilePanel.hidden = isOpen;
    });
  }

  document.querySelectorAll("img[data-cover]").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.opacity = "0";
    });
  });

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  let currentSlide = 0;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  if (slides.length > 1) {
    setInterval(() => showSlide(currentSlide + 1), 5200);
  }

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const filterInput = document.querySelector("[data-filter-input]");
  const filterYear = document.querySelector("[data-filter-year]");
  const filterGrid = document.querySelector("[data-filter-grid]");

  if (filterInput && query) {
    filterInput.value = query;
  }

  const applyFilter = () => {
    if (!filterGrid) {
      return;
    }

    const keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
    const yearValue = filterYear ? filterYear.value : "";
    const cards = Array.from(filterGrid.querySelectorAll(".movie-card"));

    cards.forEach((card) => {
      const text = (card.dataset.text || "").toLowerCase();
      const title = (card.dataset.title || "").toLowerCase();
      const year = card.dataset.year || "";
      const keywordMatch = !keyword || text.includes(keyword) || title.includes(keyword);
      const yearMatch = !yearValue || year === yearValue;
      card.classList.toggle("is-filtered-out", !(keywordMatch && yearMatch));
    });
  };

  if (filterInput || filterYear) {
    applyFilter();
  }

  if (filterInput) {
    filterInput.addEventListener("input", applyFilter);
  }

  if (filterYear) {
    filterYear.addEventListener("change", applyFilter);
  }
})();
