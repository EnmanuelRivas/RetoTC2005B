// Función para poder redirigir a la página de registro
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-button");

    registerButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        window.location.href = "/pages/registro.html";
    });
});

// Función para poder iniciar sesión en la plataforma
document.addEventListener("DOMContentLoaded", () => {
    const nombreUsuario = document.getElementById("nombre-usuario");
    const contraseñaUsuario = document.getElementById("password-usuario");
    const correoUsuario = document.getElementById("correo-usuario");
    const loginButton = document.getElementById("login-button");
    
    loginButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const usuario = {
            nombreUsuario: nombreUsuario.value.trim(),
            contraseñaUsuario: contraseñaUsuario.value.trim(),
            correoUsuario: correoUsuario.value.trim()
        };

        if (!usuario.nombreUsuario || !usuario.contraseñaUsuario || !usuario.correoUsuario) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/postLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Show success message
                window.location.href = "/pages/home.html"; // Redirect to home page
            } else {
                const errorData = await response.json();
                alert(errorData.message); // Show error message
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        }
    });  
});