// Función para mostrar el formulario de registro
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", (event) => {
        // Redirect to the login page
        event.preventDefault();
        window.location.href = "/pages/login.html";
    });
});

// Función para registrar un nuevo usuario
document.addEventListener("DOMContentLoaded", () => {
    const nombreUsuario = document.getElementById("nombre-usuario");
    const correoUsuario = document.getElementById("correo-usuario");
    const contraseñaUsuario = document.getElementById("password-usuario");
    const registerButton = document.getElementById("register-button");

    registerButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const usuario = {
            nombreUsuario: nombreUsuario.value.trim(),
            correoUsuario: correoUsuario.value.trim(),
            contraseñaUsuario: contraseñaUsuario.value.trim()
        };

        if (!usuario.nombreUsuario || !usuario.correoUsuario || !usuario.contraseñaUsuario) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/postUsuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Show success message
                window.location.href = "/pages/login.html"; // Redirect to login page
            } else {
                const errorData = await response.json();
                alert(errorData.message); // Show error message
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
        }
    });
});