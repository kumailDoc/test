/*
File:       app.js
Name:       Ziyan Liu
Student Id: 301133339
Date:       2022-10-01
*/
// IIFE --Immediately invoked Function Expression
(function () {
  function Start() {
    console.log("App Started...");

    let deleteButtons = document.querySelectorAll(".btn-danger");

    for (button of deleteButtons) {
      button.addEventListener("click", (event) => {
        if (!confirm("Are you sure?")) {
          event.preventDefault();
          window.location.assign("/game-info");
        }
      });
    }
  }

  window.addEventListener("load", Start);
})();
