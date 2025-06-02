// Función para poder redirigir a la página de registro
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-button");

    registerButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        window.location.href = "/awaq/home";
    });
});

// Función para poder iniciar sesión en la plataforma
document.addEventListener("DOMContentLoaded", () => {
    const correoUsuario = document.getElementById("correo-usuario");
    const contraseñaUsuario = document.getElementById("contraseña-usuario");
    const loginButton = document.getElementById("login-button");
    
    // Verificar si ya hay un token y redirigir si existe
    if (localStorage.getItem("authToken")) {
        window.location.href = "/awaq/home";
        return;
    }
    
    loginButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default form submission

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

            if (response.ok) {
                const data = await response.json();
                
                // Guardar el token en localStorage
                localStorage.setItem("authToken", data.token);
                
                // Redirigir a la página de inicio
                window.location.href = "/awaq/home";
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Credenciales inválidas");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        }
    });  
});