  document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");
    const isLoginPage = window.location.pathname.endsWith("login.html");
    const username = localStorage.getItem("username"); // Obtén el nombre de usuario almacenado
    
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = "login.html";
    } else {
        const usernameDisplay = document.getElementById("username-display");
        usernameDisplay.textContent = `Hola, ${username}`; // Muestra el nombre de usuario
    }
});
