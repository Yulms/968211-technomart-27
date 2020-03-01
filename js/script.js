"use strict";

//модальное окно - object. При нажатии на кнопке открытия модального окна записываем в эту переменную
// конкретный объект окна
let modalWindow;
let buttonCloseModal = document.querySelector(".button-close");
let buttonModalContact = document.querySelector(".button--modal--contact");
// переменные формы
let contactForm = document.querySelector(".contact-form");
let contactName = document.querySelector(".contact-form__input--name");
let contactEmail = document.querySelector(".contact-form__input--email");
let contactText = document.querySelector(".contact-form__input--letter");
// проверка поддержки local storage
let isStorageSupport = true;
let storage = "";
try {
  storage = localStorage.getItem("userName");
} catch (error) {
  isStorageSupport = false;
}

buttonModalContact.addEventListener("click", function(evt) {
  evt.preventDefault();
  modalWindow = document.querySelector(".modal--contact");
  modalWindow.classList.add("modal--show");

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
});

// Валидация и запись данных формы в local-storage.
contactForm.addEventListener("submit", function(evt) {
  if (!contactName.value || !contactEmail.value || !contactText.value) {
    evt.preventDefault();
    // хак, чтобы анимация ошибки отрабатывала несколько раз
    modalWindow.classList.remove("modal--error");
    // операция из демо не сработала popup.offsetWidth = popup.offsetWidth;
    +modalWindow.offsetWidth;
    modalWindow.classList.add("modal--error");
  } else {
    if (isStorageSupport) {
      localStorage.setItem("userName", contactName.value);
      localStorage.setItem("userEmail", contactEmail.value);
    }
  }
});

// закрытие окна по клику на крестике
buttonCloseModal.addEventListener("click", function(evt) {
  evt.preventDefault();
  modalWindow.classList.remove("modal--show");
  modalWindow.classList.remove("modal--error");
});

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
