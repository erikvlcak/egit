"use strict";

//select corresponding regex code for each specific input
function testPattern(input, inputClassName) {
  let regex;
  let testedInputMessage = document.querySelector(`.${inputClassName}-verification-status`);
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
  if (inputClassName !== "form__message") {
    //display result of a regex test below input field
    if (regex.test(input.value)) {
      testedInputMessage.textContent = String.fromCodePoint(0x2705) + "Correct format";
      testedInputMessage.classList.add("form__verification--correct");
      testedInputMessage.classList.remove("form__verification--wrong");
    } else {
      testedInputMessage.textContent = String.fromCodePoint(0x274c) + "Wrong format";
      testedInputMessage.classList.add("form__verification--wrong");
      testedInputMessage.classList.remove("form__verification--correct");
    }
  }
}

//create an array of empty required input fields
function testRequired() {
  let emptyFieldsArray = [];
  document.querySelectorAll("input[required], textarea[required]").forEach((item) => {
    if (item.value === "@" || item.value === "") {
      emptyFieldsArray.push(item.dataset.attribute);
    }
  });
  console.log("empty reqired fields:", emptyFieldsArray);
  return emptyFieldsArray;
}

//create an array of input fields not passing regex text
function testCorrectFormat() {
  let wrongFormatArray = [];
  document.querySelectorAll(".form__verification").forEach((item) => {
    if (item.textContent.includes("Wrong")) {
      wrongFormatArray.push(item.dataset.attribute);
    }
  });
  console.log("incorrect format fields", wrongFormatArray);
  return wrongFormatArray;
}

//make list of field with empty required inputs
function makeListOfEmptyInputs(emptyRequiredList, emptyRequiredMessage) {
  let ul = document.createElement("ul");
  ul.textContent = "Required fields:";
  ul.classList.add("ul--alert");
  emptyRequiredList.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item;
    li.classList.add("li--alert");
    ul.appendChild(li);
  });
  emptyRequiredMessage.appendChild(ul);
}

//make list of field with data in wrong format
function makeListOfIncorrectInputs(formatErrorList, formatErrorMessage) {
  let ul = document.createElement("ul");
  ul.textContent = "Incorrect inputs:";
  ul.classList.add("ul--alert");
  formatErrorList.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item;
    li.classList.add("li--alert");
    ul.appendChild(li);
  });
  formatErrorMessage.appendChild(ul);
}

//toggle nav items visibility on small screen
document.querySelector(".nav__burger").addEventListener("click", () => {
  document.querySelector(".nav__links").classList.toggle("hidden");
});

//test input values agains regex
document.querySelectorAll("input, textarea").forEach((item) => {
  item.addEventListener("keyup", (e) => {
    testPattern(item, e.target.className);
  });
});

//display error messages for empty required fields or incorrectly filled fields
document.querySelector(".form__submit-button").addEventListener("click", (e) => {
  e.preventDefault();
  let emptyRequiredList = testRequired();
  let emptyRequiredMessage = document.querySelector(".form__alert-emptyRequired");
  let formatErrorList = testCorrectFormat();
  let formatErrorMessage = document.querySelector(".form__alert-formatError");
  let submissionStatus = document.querySelector(".form__submission-status");

  //reset messages triggered by submit
  emptyRequiredMessage.innerHTML = "";
  formatErrorMessage.innerHTML = "";
  submissionStatus.innerHTML = "";

  //check if required fields are filled and all data are in correct format
  if (emptyRequiredList.length !== 0 || formatErrorList.length !== 0) {
    //show list of required fields that are still empty
    if (emptyRequiredList.length !== 0) {
      makeListOfEmptyInputs(emptyRequiredList, emptyRequiredMessage);
    }

    //show list of field with data in wrong format
    if (formatErrorList.length !== 0) {
      makeListOfIncorrectInputs(formatErrorList, formatErrorMessage);
    }
    //form is filled correctly, trigger submission of data
  } else {
    let text;
    let formData = new FormData(document.querySelector(".form__body"));
    fetch("submitForm.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error: ", response.status, response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        //display message according to response status from submitForm.php
        if (data.status === "success") {
          console.log("I run");
          submissionStatus.textContent = "Your message has been submitted! Thank You!";
          submissionStatus.classList.add("form__verification--correct");
          submissionStatus.classList.remove("form__verification--wrong");
          //reset input fields and clear verification messages
          document.querySelectorAll("input, textarea").forEach((item) => {
            console.log("I clean", item);
            if (item.className === "form__email") {
              item.value = "@";
            } else {
              item.value = "";
            }
          });
          document.querySelectorAll(".form__verification").forEach((item) => {
            item.textContent = "";
          });
        } else if (data.status === "failed") {
          submissionStatus.textContent = "Message submission failed. Contact our support.";
          submissionStatus.classList.add("form__verification--wrong");
          submissionStatus.classList.remove("form__verification--correct");
        } else {
          submissionStatus.textContent = "There was an error submitting the form.";
          submissionStatus.classList.add("form__verification--wrong");
          submissionStatus.classList.remove("form__verification--correct");
        }
      });
  }
});
