// Основные переменные
let currentStep = 1;
const totalSteps = 5;
let quizData = {
  style: "modern",
  size: "medium",
  material: "wood",
  color: "#3498db",
  colorName: "Небесный",
  options: ["led", "system"],
  dimensions: { length: 4, width: 3, height: 2.5 },
  price: 215000,
};

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация выбранных опций
  initQuiz();

  // Кнопка начала квиза
  document.querySelectorAll(".start-quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
    });
  });

  // Навигация в шапке для мобильных
  document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector(".nav-menu").classList.toggle("active");
  });

  // Кнопка прокрутки наверх
  const scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollTopBtn.style.display = "flex";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Фильтры портфолио
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Убираем активный класс у всех кнопок
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      // Добавляем активный класс текущей кнопке
      this.classList.add("active");

      const filter = this.dataset.filter;
      filterPortfolio(filter);
    });
  });

  // Инициализация квиза с данными
  updateSummary();
});

// Инициализация квиза
function initQuiz() {
  // Обработчики для выбора стиля
  document.querySelectorAll("#step-1 .option-card").forEach((card) => {
    card.addEventListener("click", function () {
      // Убираем активный класс у всех карточек
      document
        .querySelectorAll("#step-1 .option-card")
        .forEach((c) => c.classList.remove("active"));
      // Добавляем активный класс текущей карточке
      this.classList.add("active");
      // Сохраняем выбранный стиль
      quizData.style = this.dataset.value;
    });
  });

  // Обработчики для выбора размера
  document.querySelectorAll("#step-2 .size-card").forEach((card) => {
    card.addEventListener("click", function () {
      document
        .querySelectorAll("#step-2 .size-card")
        .forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      quizData.size = this.dataset.value;
      updatePrice();
    });
  });

  // Обработчики для ввода размеров
  document.getElementById("length").addEventListener("input", function () {
    quizData.dimensions.length = parseFloat(this.value);
    updatePrice();
  });

  document.getElementById("width").addEventListener("input", function () {
    quizData.dimensions.width = parseFloat(this.value);
    updatePrice();
  });

  document.getElementById("height").addEventListener("input", function () {
    quizData.dimensions.height = parseFloat(this.value);
    updatePrice();
  });

  // Обработчики для выбора материала
  document.querySelectorAll("#step-3 .material-card").forEach((card) => {
    card.addEventListener("click", function () {
      document
        .querySelectorAll("#step-3 .material-card")
        .forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      quizData.material = this.dataset.value;
      updatePrice();
    });
  });

  // Обработчики для дополнительных опций
  document
    .querySelectorAll('#step-3 input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        updateOptions();
        updatePrice();
      });
    });

  // Обработчики для выбора цвета
  document.querySelectorAll("#step-4 .color-option").forEach((color) => {
    color.addEventListener("click", function () {
      document
        .querySelectorAll("#step-4 .color-option")
        .forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      quizData.color = this.dataset.color;
      quizData.colorName = this.dataset.name;
      updateColorPreview();
      updateSummary();
    });
  });

  // Устанавливаем первую карточку стиля как активную
  document.querySelector("#step-1 .option-card").classList.add("active");
}

// Обновление дополнительных опций
function updateOptions() {
  const options = [];
  document
    .querySelectorAll('#step-3 input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      options.push(checkbox.value);
    });
  quizData.options = options;
}

// Обновление предпросмотра цвета
function updateColorPreview() {
  const preview = document.getElementById("color-preview");
  preview.style.background = `linear-gradient(135deg, ${
    quizData.color
  } 0%, ${lightenColor(quizData.color, 40)} 100%)`;
  document.getElementById("selected-color-name").textContent =
    quizData.colorName;
}

// Осветление цвета для градиента
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Навигация по шагам квиза
function nextStep() {
  if (currentStep < totalSteps) {
    // Скрываем текущий шаг
    document.getElementById(`step-${currentStep}`).classList.remove("active");
    // Показываем следующий шаг
    currentStep++;
    document.getElementById(`step-${currentStep}`).classList.add("active");
    updateProgressBar();
    updateSummary();

    // Прокручиваем к началу секции
    document
      .getElementById("quiz")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function prevStep() {
  if (currentStep > 1) {
    document.getElementById(`step-${currentStep}`).classList.remove("active");
    currentStep--;
    document.getElementById(`step-${currentStep}`).classList.add("active");
    updateProgressBar();

    document
      .getElementById("quiz")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Обновление прогресс-бара
function updateProgressBar() {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  document.getElementById("quiz-progress").style.width = `${progress}%`;

  document.querySelectorAll(".progress-step").forEach((step, index) => {
    if (index < currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

// Обновление цены
function updatePrice() {
  let basePrice = 150000; // Базовая цена для средней кухни

  // Наценка за размер
  if (quizData.size === "small") basePrice = 85000;
  if (quizData.size === "large") basePrice = 250000;

  // Наценка за материал
  if (quizData.material === "plastic") basePrice += 0;
  if (quizData.material === "wood") basePrice += 45000;
  if (quizData.material === "glass") basePrice += 30000;

  // Наценка за доп. опции
  let optionsPrice = 0;
  if (quizData.options.includes("led")) optionsPrice += 8000;
  if (quizData.options.includes("system")) optionsPrice += 15000;
  if (quizData.options.includes("sink")) optionsPrice += 12000;
  if (quizData.options.includes("table")) optionsPrice += 25000;

  // Корректировка по площади
  const area = quizData.dimensions.length * quizData.dimensions.width;
  if (area > 12) basePrice *= 1.3;
  if (area < 6) basePrice *= 0.8;

  quizData.price = basePrice + optionsPrice;

  // Обновляем отображение цены
  document.getElementById("total-price").textContent = formatPrice(
    quizData.price
  );
}

// Форматирование цены
function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₽";
}

// Обновление сводки
function updateSummary() {
  // Стиль
  const styleMap = {
    modern: "Современный",
    classic: "Классический",
    loft: "Лофт",
    scandinavian: "Скандинавский",
  };
  document.getElementById("summary-style").textContent =
    styleMap[quizData.style] || "Современный";

  // Размер
  const sizeMap = {
    small: "Малогабаритная (до 6 м²)",
    medium: "Стандартная (6-12 м²)",
    large: "Большая (более 12 м²)",
  };
  document.getElementById("summary-size").textContent =
    sizeMap[quizData.size] || "Стандартная (6-12 м²)";

  // Материал
  const materialMap = {
    plastic: "Пластик/МДФ",
    wood: "Массив дерева",
    glass: "Стекло/Металл",
  };
  document.getElementById("summary-material").textContent =
    materialMap[quizData.material] || "Массив дерева";

  // Цвет
  document.getElementById("summary-color").textContent = quizData.colorName;

  // Опции
  const optionsMap = {
    led: "Подсветка LED",
    system: "Системы хранения BLUM",
    sink: "Гранитная мойка",
    table: "Раздвижной стол",
  };
  const optionsText = quizData.options.map((opt) => optionsMap[opt]).join(", ");
  document.getElementById("summary-options").textContent =
    optionsText || "Нет дополнительных опций";

  // Обновляем цену
  updatePrice();
}

// Фильтрация портфолио
function filterPortfolio(filter) {
  const items = document.querySelectorAll(".portfolio-item");

  items.forEach((item) => {
    if (filter === "all" || item.dataset.category.includes(filter)) {
      item.style.display = "block";
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "scale(1)";
      }, 10);
    } else {
      item.style.opacity = "0";
      item.style.transform = "scale(0.8)";
      setTimeout(() => {
        item.style.display = "none";
      }, 300);
    }
  });
}

// Отправка квиза
function submitQuiz() {
  // В реальном проекте здесь будет отправка на сервер
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Простая валидация
  if (!name || !phone) {
    alert("Пожалуйста, заполните обязательные поля: имя и телефон");
    return;
  }

  // В реальном приложении здесь будет AJAX запрос

  // Показываем модальное окно успеха
  document.getElementById("successModal").style.display = "flex";

  // В реальном приложении здесь сброс формы или перенаправление
  console.log("Данные квиза:", {
    ...quizData,
    name,
    phone,
    email,
    message,
  });
}

// Закрытие модального окна
function closeModal() {
  document.getElementById("successModal").style.display = "none";

  // Сбрасываем квиз к началу
  currentStep = 1;
  document
    .querySelectorAll(".quiz-step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step-1").classList.add("active");
  updateProgressBar();

  // Прокручиваем к началу квиза
  document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
}
