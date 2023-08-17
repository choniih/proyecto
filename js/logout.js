
const logoutBtn = document.querySelector(".logout-btn"); 
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "login.html"; 
});
