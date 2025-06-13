/**
 * Script para manejar la lógica de inicio de sesión y redirección.
 * 
 * Este script se ejecuta cuando el DOM ha sido completamente cargado.
 * Verifica elementos del DOM, previene accesos si ya hay token y
 * envía los datos al servidor para validar al usuario.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Botón para redirigir a home si ya está registrado
    const registerButton = document.getElementById("register-button");

    if (registerButton) {
        registerButton.addEventListener("click", (event) => {
            event.preventDefault(); 
            window.location.href = "/awaq/home";
        });
    }

    const correoUsuario = document.getElementById("correo-usuario");
    const contraseñaUsuario = document.getElementById("contraseña-usuario");
    const loginButton = document.getElementById("login-button");

    if (!correoUsuario || !contraseñaUsuario || !loginButton) {
        console.warn("⛔ Elementos del formulario de login no encontrados");
        return;
    }

    // Si ya existe un token en localStorage, redirige a la página principal
    if (localStorage.getItem("authToken")) {
        window.location.href = "/awaq/home";
        return;
    }

    // Manejador de evento al hacer clic en el botón de login
    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const usuario = {
            correo: correoUsuario.value.trim(),
            contraseña: contraseñaUsuario.value.trim()
        };

        if (!usuario.correo || !usuario.contraseña) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("/awaq/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            const data = await response.json();

            if (response.ok) {
                // Verifica si es pendiente
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                if (payload.role_id === 3) {
                    alert("Tu cuenta aún está pendiente de aprobación.");
                    return; // No redirige ni guarda el token
                }

                // Usuario válido
                localStorage.setItem("authToken", data.token);
                window.location.href = "/awaq/home";
            } else {
                alert(data.message || "Credenciales inválidas");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        }
    });
});
