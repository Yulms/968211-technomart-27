"use strict";

// модальное окно - object. При нажатии на кнопке открытия модального окна записываем в эту переменную
// объект вызываемого окна
let modalWindow;
let buttonClose;
let buttonModalContact = document.querySelector(".button--modal--contact");
let buttonModalMap = document.querySelector(".button--modal--map");
let headerUser = document.querySelector(".header__user-area");
// переменные формы контактов
let contactName = document.querySelector(".contact-form__input--name");
let contactEmail = document.querySelector(".contact-form__input--email");
let contactText = document.querySelector(".contact-form__input--letter");
let contactForm = document.querySelector(".contact-form");

// проверка поддержки local storage
let isStorageSupport = true;
let storage = "";
try {
  storage = localStorage.getItem("userName");
} catch (error) {
  isStorageSupport = false;
}

// LOGIN и LOGOUT
// 1. При загрузке страницы
// проверка, если запись isLogined в local storage
// если запись есть и она yes - подключаем класс header__user-area--logined к header__user-area
// если записи нет - создание записи в Local Storage isLogined: 0
// 2. При нажатии на кнопку вход подключается класс header__user-area--logined к header__user-area
// 3. При нажатии на кнопку выход - этот же класс отлючается

if (isStorageSupport) {
  storage = localStorage.getItem("isLogined");
  if (!storage) {
    localStorage.setItem("isLogined", "no");
  } else if (storage === "yes") {
    headerUser.classList.add("header__user-area--logined");
  }
}

let buttonLogin = document.querySelector(".user-button--icon--login");

buttonLogin.addEventListener("click", function(evt) {
  evt.preventDefault();
  headerUser.classList.add("header__user-area--logined");
  if (isStorageSupport) {
    localStorage.setItem("isLogined", "yes");
  }
});

let buttonLogout = document.querySelector(".user-button--icon--logout");

buttonLogout.addEventListener("click", function(evt) {
  evt.preventDefault();
  headerUser.classList.remove("header__user-area--logined");
  if (isStorageSupport) {
    localStorage.setItem("isLogined", "no");
  }
});

//
//
//
// НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ НАЖАТИЙ НА КНОПКИ ВЫЗОВА МОДАЛЬНЫХ ОКОН
if (buttonModalContact) {
  buttonModalContact.addEventListener("click", function(evt) {
    evt.preventDefault();
    windowShow(evt, ".modal--contact");
  });
}

if (buttonModalMap) {
  buttonModalMap.addEventListener("click", function(evt) {
    evt.preventDefault();
    windowShow(evt, ".modal--map");
  });
}

// Обрабочик для клика на кнопку купить и добавить в закладки
// Поскольку кнопок много и они могут быть в разных блоках,
// ловим событие клика на body, затем отлавливаем нужное по имени класса
let body = document.querySelector("body");

body.addEventListener("click", function(evt) {
  // где был клик? https://learn.javascript.ru/event-delegation
  let targetPoint = evt.target;

  // если событие - нажатие на кнопку купить
  if (targetPoint.classList.contains("button--buy")) {
    evt.preventDefault();
    // показываем модальное окно
    windowShow(evt, ".cart-add");
    // увеличиваем количество товаров на 1 и делаем кнопку активной
    let cartQuantity = document.querySelector(".header__cart-quantity");
    cartQuantity.textContent++;
    document
      .querySelector(".header__shop-button--cart")
      .classList.add("header__shop-button--active");
    return;
  }

  // если событие - нажатие на кнопку добавить в закладки
  if (targetPoint.classList.contains("button--like")) {
    evt.preventDefault();
    // увеличиваем количество товаров на 1 и делаем кнопку активной
    let likedQuantity = document.querySelector(".header__liked-quantity");
    likedQuantity.textContent++;
    document
      .querySelector(".header__shop-button--bookmarks")
      .classList.add("header__shop-button--active");
    return;
  }
});

function windowShow(evt, formClass) {
  switch (formClass) {
    case ".modal--contact":
      modalWindow = document.querySelector(".modal--contact");
      modalWindow.classList.remove("modal--hide");
      modalWindow.classList.add("modal--show");
      contactText.focus();
      // если браузер поддерживает local storage
      if (isStorageSupport) {
        // при наличии инфо о юзере подставляем ее в соответствующие поля
        storage = localStorage.getItem("userName");
        if (storage) {
          contactName.value = storage;
        } else {
          // устанавливаем фокус на поле имя
          contactName.focus();
        }
        storage = localStorage.getItem("userEmail");
        if (storage) {
          contactEmail.value = storage;
        } else {
          // если имя заполнено устанавливаем фокус на email
          if (contactName.value) {
            contactEmail.focus();
          }
        }
      } else {
        // устанавливаем фокус на поле имя
        contactName.focus();
      }
      break;
    case ".modal--map":
      modalWindow = document.querySelector(".modal--map");
      modalWindow.classList.remove("modal--hide");
      modalWindow.classList.add("modal--show");
      break;
    case ".cart-add":
      modalWindow = document.querySelector(".cart-add");
      modalWindow.classList.remove("modal--hide");
      modalWindow.classList.add("modal--show");
      break;
  }
  // в зависимости от открытого модального окна
  // 1. записываем в переменную объект кнопки закрытия именно открытого окна
  // 2. вызываем функцию, навешиваюзую обработчик события на эту кнопку
  buttonClose = document.querySelector(formClass + " .button-close");
  addEventClose();
}

//
//
// ОТПРАВКА ДАННЫХ. Валидация и запись данных формы в local-storage.
if (contactForm) {
  contactForm.addEventListener("submit", function(evt) {
    if (!contactName.value || !contactEmail.value || !contactText.value) {
      evt.preventDefault();
      // хак, чтобы анимация ошибки отрабатывала несколько раз (просто удаление и добавление класса не сработает)
      modalWindow.classList.remove("modal--error");
      // операция из лекции не сработала: popup.offsetWidth = popup.offsetWidth;
      +modalWindow.offsetWidth;
      modalWindow.classList.add("modal--error");
    } else {
      if (isStorageSupport) {
        localStorage.setItem("userName", contactName.value);
        localStorage.setItem("userEmail", contactEmail.value);
      }
    }
  });
}

//
//
//
// ЗАКРЫТИЕ ОКОН
function addEventClose() {
  buttonClose.addEventListener("click", function(evt) {
    evt.preventDefault();
    closeModal();
  });
}

// закрытие окна по нажатию esc
window.addEventListener("keydown", function(evt) {
  // если нажата esc
  if (evt.keyCode === 27) {
    // если окно открыто
    if (modalWindow.classList.contains("modal--show")) {
      evt.preventDefault();
      closeModal();
    }
  }
});

function closeModal() {
  modalWindow.classList.remove("modal--show");
  modalWindow.classList.remove("modal--error");

  modalWindow.addEventListener("animationend", function(evt) {
    evt.preventDefault();
    if (evt.animationName === "bounce-reverse") {
      modalWindow.classList.remove("modal--hide");
    }
  });
  modalWindow.classList.add("modal--hide");
}

//
//
//
//
//
//
//
// СЛАЙДЕРЫ

// 1й слайдер КНОПКИ - ЛЕВО ПРАВО
let btnLeft = document.querySelector(".slider__toggle--left");
let btnRight = document.querySelector(".slider__toggle--right");

if (btnLeft) {
  btnLeft.addEventListener("click", function(evt) {
    evt.preventDefault;
    toggleSlider(false);
  });

  btnRight.addEventListener("click", function(evt) {
    evt.preventDefault;
    toggleSlider(true);
  });
}

// Алгоритм при нажатии на кнопку:
// 1. Находим текущий элемент
// 2. Убираем у него класс Active
// 3. Находим элемент слева или cправа
// 4. Добавляем ему класс active

function toggleSlider(isForward) {
  let currentItem = document.querySelector(".slider__item--active");
  currentItem.classList.remove("slider__item--active");

  let currentSliderPoint = document.querySelector(
    ".slider__point-item--active"
  );
  currentSliderPoint.classList.remove("slider__point-item--active");

  let targetClass;
  let targetSliderPoint;
  if (isForward) {
    // если элемент не последний
    if (currentItem.nextElementSibling) {
      targetClass = currentItem.nextElementSibling;
      targetSliderPoint = currentSliderPoint.nextElementSibling;
    } else {
      targetClass = currentItem.parentElement.firstElementChild;
      targetSliderPoint = currentSliderPoint.parentElement.firstElementChild;
    }
  } else {
    if (currentItem.previousElementSibling) {
      targetClass = currentItem.previousElementSibling;
      targetSliderPoint = currentSliderPoint.previousElementSibling;
    } else {
      targetClass = currentItem.parentElement.lastElementChild;
      targetSliderPoint = currentSliderPoint.parentElement.lastElementChild;
    }
  }
  targetClass.classList.add("slider__item--active");
  targetSliderPoint.classList.add("slider__point-item--active");
}

// НАЖАТИЕ НА ТОЧКИ СЛАЙДЕРА
let btnPointList = document.querySelector(".slider__point-list");
if (btnPointList) {
  btnPointList.addEventListener("click", function(evt) {
    evt.preventDefault();

    // где был клик? https://learn.javascript.ru/event-delegation
    let targetPoint = evt.target;

    // если юзер не попал в точку - выходим
    if (!targetPoint.classList.contains("slider__point")) return;

    // удаляем активный класс с текущей точки и слайдера
    document
      .querySelector(".slider__point-item--active")
      .classList.remove("slider__point-item--active");
    document
      .querySelector(".slider__item--active")
      .classList.remove("slider__item--active");

    // добавляем активный класс к новой точке
    targetPoint.parentElement.classList.add("slider__point-item--active");

    // узнаем порядковый номер точки (как могу), для показа соответствующего слайда
    // и по наденному номеру подключаем класс active соответствующему слайду
    let sliderPointItems = document.querySelectorAll(".slider__point-item");
    for (let i = 0; i < sliderPointItems.length; i++) {
      if (
        sliderPointItems[i].classList.contains("slider__point-item--active")
      ) {
        // Переключение слайда
        // 1. Выбираем все элементы slider-item
        // 2. Слайдеру с соотвествующим номером добавляем класс active
        document
          .querySelectorAll(".slider__item")
          [i].classList.add("slider__item--active");
        break;
      }
    }
  });
}

//
//
//
//
//
// СЛАЙДЕР - СЕРВИСЫ
// 1. Удаляем активные классы с кнопки и контентной части
// 2. Добавляем активный класс к нажатой кнопке
// 3. Определяем порядковый номер нажатой кнопки и
//    добавляем активный класс такому же номеру табов
let tabbedSlider = document.querySelector(".tabbed-slider__buttons-list");
if (tabbedSlider) {
  tabbedSlider.addEventListener("click", function(evt) {
    evt.preventDefault();
    let targetButton = evt.target;
    // если юзер не попал в button - выходим
    if (!targetButton.classList.contains("tabbed-button")) return;

    // 1
    document
      .querySelector(".tabbed-button--active")
      .classList.remove("tabbed-button--active");
    document
      .querySelector(".tabbed-slider__content--active")
      .classList.remove("tabbed-slider__content--active");
    // 2
    targetButton.classList.add("tabbed-button--active");
    // 3
    let tabbedButtons = document.querySelectorAll(".tabbed-button");
    let i = 0;
    while (i < tabbedButtons.length) {
      if (tabbedButtons[i].classList.contains("tabbed-button--active")) {
        document
          .querySelectorAll(".tabbed-slider__content")
          [i].classList.add("tabbed-slider__content--active");
      }
      i++;
    }
  });
}

//
//
//
//
//
//
// ПОКАЗ БЛОКА КНОПОК В КАРТОЧКЕ ТОВАРА ПРИ ФОКУСЕ НА ОДНОЙ ИЗ НИХ
// 1. Ловим событие фокуса и анфокуса на всем списке.
// 2. Определяем, на каком именно элементе внутри произошло событие
// 3. Добавляем класс родителю - карточке товара для показа блока кнопок
// 4. Удаляем класс с предыдущего фокуса

let minicardList = document.querySelector(".minicard-list");
minicardList.addEventListener("focusin", function(evt) {
  evt.preventDefault();
  let targetButton = evt.target;
  targetButton.parentElement.parentElement.classList.add(
    "minicard-list__item--active"
  );
});

minicardList.addEventListener("focusout", function(evt) {
  evt.preventDefault();
  let targetButton = evt.target;
  targetButton.parentElement.parentElement.classList.remove(
    "minicard-list__item--active"
  );
});
