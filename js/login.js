document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const rememberMeCheckbox = document.getElementById("rememberMe");
  
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const rememberMe = rememberMeCheckbox.checked;
  
      if (username !== "" && password !== "") {
        if (rememberMe) {
          localStorage.setItem("isLoggedIn", true);
        } else {
          sessionStorage.setItem("isLoggedIn", true);
        }
        localStorage.setItem("username", username);
        window.location.href = "index.html";
      } else {
        alert("Por favor, ingresa usuario y contraseña válidos.");
      }
    });
  });
  