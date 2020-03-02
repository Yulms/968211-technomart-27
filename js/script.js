"use strict";

// модальное окно - object. При нажатии на кнопке открытия модального окна записываем в эту переменную
// объект вызываемого окна
let modalWindow;
let buttonClose;
let buttonModalContact = document.querySelector(".button--modal--contact");
let buttonModalMap = document.querySelector(".button--modal--map");
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

//
//
//
// НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ НАЖАТИЙ НА КНОПКИ ВЫЗОВА МОДАЛЬНЫХ ОКОН
buttonModalContact.addEventListener("click", function(evt) {
  windowShow(evt, ".modal--contact");
});

buttonModalMap.addEventListener("click", function(evt) {
  windowShow(evt, ".modal--map");
});

function windowShow(evt, formClass) {
  evt.preventDefault();
  switch (formClass) {
    case ".modal--contact":
      modalWindow = document.querySelector(".modal--contact");
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

//
//
//
// ЗАКРЫТИЕ ОКОН
// закрытие окна контактов
function addEventClose() {
  buttonClose.addEventListener("click", function(evt) {
    evt.preventDefault();
    modalWindow.classList.remove("modal--show");
    modalWindow.classList.remove("modal--error");
  });
}

// закрытие окна по нажатию esc
window.addEventListener("keydown", function(evt) {
  // если нажата esc
  if (evt.keyCode === 27) {
    // если окно открыто
    if (modalWindow.classList.contains("modal--show")) {
      evt.preventDefault;
      modalWindow.classList.remove("modal--show");
      modalWindow.classList.remove("modal--error");
    }
  }
});
