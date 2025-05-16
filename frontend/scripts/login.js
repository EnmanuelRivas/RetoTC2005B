// Función para poder redirigir a la página de registro
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-button");

    registerButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        window.location.href = "/pages/home.html";
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

const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

toggleButton.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    body.classList.toggle("dark-mode");
    toggleButton.textContent = body.classList.contains("light-mode") ? "🌙" : "☀️";
});


document.querySelectorAll('.next-btn').forEach(button => {
  button.addEventListener('click', () => {
    const currentStep = button.closest('.step');
    const nextStepId = button.getAttribute('data-next');
    const nextStep = document.getElementById(`step-${nextStepId}`);

    currentStep.classList.remove('active');
    nextStep.classList.add('active');
  });
});

document.querySelectorAll('.prev-btn').forEach(button => {
  button.addEventListener('click', () => {
    const currentStep = button.closest('.step');
    const prevStepId = button.getAttribute('data-prev');
    const prevStep = document.getElementById(`step-${prevStepId}`);

    currentStep.classList.remove('active');
    prevStep.classList.add('active');
  });
});
