document.addEventListener("DOMContentLoaded", () => {
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

    if (localStorage.getItem("authToken")) {
        window.location.href = "/awaq/home";
        return;
    }

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
                    return; // ❌ No redirige ni guarda el token
                }

                // ✅ Usuario válido
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
