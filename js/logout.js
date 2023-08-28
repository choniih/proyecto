const logoutBtn = document.querySelector(".logout-btn");
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "login.html";
});
