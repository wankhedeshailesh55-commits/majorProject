console.log("script.js loaded");

(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        // 🔥 THIS is what actually blocks submission
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // show bootstrap validation styles
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
