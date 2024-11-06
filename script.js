//TODO: fix border color change - testedInputField classlist

"use strict";

//display result of regex test
function testPattern(input, inputClassName) {
  let regex;
  let testedInputMessage = document.querySelector(`.${inputClassName}-error`);
  let testedInputField = document.querySelector(`#${inputClassName}`);
  switch (inputClassName) {
    case "form__name": {
      regex = /^[a-z ,.'-]+$/i;
      break;
    }
    case "form__company": {
      regex = /^(?!\s*$)(?!^[^a-zA-Z0-9]*$)(?=.*[a-zA-Z])[\w\s.,'-]+$/;
      break;
    }
    case "form__email": {
      regex = /(^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+[\.][a-z]+$)/gm;
      break;
    }
    case "form__phone": {
      regex = /^(\+(\d{2}|\d{3})\s?)?(\d{3}\s?\d{3}\s?\d{3}|\d{3}\s?\d{3}\s?\d{4})$/;
      break;
    }
  }

  if (regex.test(input.value)) {
    testedInputMessage.textContent = String.fromCodePoint(0x2705) + "Correct format";
    testedInputMessage.classList.add("input__message--correct");
    testedInputMessage.classList.remove("input__message--wrong");
    testedInputField.classList.add("input__border--correct");
    testedInputField.classList.remove("input__border--wrong");
  } else {
    testedInputMessage.textContent = String.fromCodePoint(0x274c) + "Wrong format";
    testedInputMessage.classList.add("input__message--wrong");
    testedInputMessage.classList.remove("input__message--correct");
    testedInputField.classList.add("input__border--wrong");
    testedInputField.classList.remove("input__border--correct");
  }
}

//test input values agains regex
document.querySelectorAll("input, textarea").forEach((item) => {
  item.addEventListener("keyup", (e) => {
    testPattern(item, e.target.className);
  });
});

//create an array of empty required input fields
function testRequired() {
  let emptyFieldsArray = [];
  document.querySelectorAll("input, textarea").forEach((item) => {
    if (!item.value) {
      emptyFieldsArray.push(item.dataset.attribute);
    }
  });
  return emptyFieldsArray;
}

//create an array of input fields not passing regex text
function testCorrectFormat() {
  let wrongFormatArray = [];
  document.querySelectorAll(".input__message").forEach((item) => {
    if (item.textContent.includes("Wrong")) {
      wrongFormatArray.push(item.dataset.attribute);
    }
  });
  return wrongFormatArray;
}

//toggle nav items visibility on small screen
document.querySelector(".nav__burger").addEventListener("click", () => {
  document.querySelector(".nav__div").classList.toggle("hidden");
});

//display error messages for empty required fields or incorrectly filled fields
document.querySelector(".form__submit-button").addEventListener("click", (e) => {
  let emptyRequiredList = testRequired();
  let emptyRequiredMessage = document.querySelector(".form__submit__alert-emptyRequired");
  let formatErrorList = testCorrectFormat();
  let formatErrorMessage = document.querySelector(".form__submit__alert-formatError");

  if (emptyRequiredList.length !== 0 || formatErrorList !== 0) {
    e.preventDefault();
    emptyRequiredMessage.innerHTML = "";
    formatErrorMessage.innerHTML = "";

    if (emptyRequiredList.length !== 0) {
      let ul = document.createElement("ul");
      ul.textContent = "These fields are required:";
      ul.classList.add("ul--alert");
      emptyRequiredList.forEach((item) => {
        let li = document.createElement("li");
        li.textContent = item;
        li.classList.add("li--alert");
        ul.appendChild(li);
      });
      emptyRequiredMessage.appendChild(ul);
    }

    if (formatErrorList.length !== 0) {
      let ul = document.createElement("ul");
      ul.textContent = "These fields are filled incorrectly:";
      ul.classList.add("ul--alert");
      formatErrorList.forEach((item) => {
        let li = document.createElement("li");
        li.textContent = item;
        li.classList.add("li--alert");
        ul.appendChild(li);
      });
      formatErrorMessage.appendChild(ul);
    }
  } else {
    e.preventDefault(); //remove this line to submit form
    console.log("submitting");
    //submit
  }
});
