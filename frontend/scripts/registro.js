document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-button");

    registerButton.addEventListener("click", (event) => {
        // Redirect to the register page
        event.preventDefault();
        window.location.href = "/pages/home.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", (event) => {
        // Redirect to the login page
        event.preventDefault();
        window.location.href = "/pages/login.html";
    });
});