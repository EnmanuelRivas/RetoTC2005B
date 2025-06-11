document.addEventListener('DOMContentLoaded', function () {
  const profileImgInput = document.getElementById('profileImgInput');
  const profileImgPreview = document.getElementById('profileImgPreview');

  profileImgInput.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        profileImgPreview.innerHTML = `<img src="${e.target.result}" alt="Imagen de perfil">`;
      };

      reader.readAsDataURL(file);
    }
  });

  // Navegación entre pasos
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

  // Envío del formulario con FormData
  document.getElementById('submitBtn').addEventListener('click', async function (e) {
    e.preventDefault();

    const form = document.getElementById('registroForm');
    const formData = new FormData(form);

    // Asegurarse de que la contraseña se incluya correctamente
    const passwordInput = document.getElementById('contraseña-usuario');
    if (passwordInput && passwordInput.value.trim() !== '') {
      // Usar el nombre del campo sin ñ
      formData.delete('contrasena'); // Eliminar cualquier valor anterior
      formData.append('contrasena', passwordInput.value.trim());
      
      // Verificar que se ha agregado correctamente
      console.log('Contraseña agregada al FormData:', passwordInput.value.trim());
    } else {
      alert('El campo contraseña no puede estar vacío');
      document.getElementById('step-4').classList.remove('active');
      document.getElementById('step-1').classList.add('active');
      return;
    }

    const requiredFields = [
      { name: 'nombre', label: 'Nombre' },
      { name: 'apellidos', label: 'Apellidos' },
      { name: 'correo', label: 'Correo electrónico' },
      { name: 'contrasena', label: 'Contraseña' },
      { name: 'pais', label: 'País' },
      { name: 'numeroTelefono', label: 'Número telefónico' },
      { name: 'provincia', label: 'Provincia' },
      { name: 'ciudad', label: 'Ciudad' },
      { name: 'organizacion', label: 'Organización' },
      { name: 'descripcion', label: 'Descripción' }
    ];

    // Depurar todos los campos del FormData
    console.log('Contenido del FormData:');
    for (const [key, value] of formData.entries()) {
      if (key === 'contrasena') {
        console.log(key + ': *****');
      } else if (key === 'profileImg') {
        console.log(key + ': [Archivo]');
      } else {
        console.log(key + ':', value);
      }
    }

    for (const field of requiredFields) {
      const value = formData.get(field.name);
      if (!value || value.trim() === '') {
        alert(`El campo ${field.label} no puede estar vacío`);
        if (['nombre', 'apellidos', 'correo', 'contrasena'].includes(field.name)) {
          document.getElementById('step-4').classList.remove('active');
          document.getElementById('step-1').classList.add('active');
        } else if (['pais', 'numeroTelefono', 'provincia', 'ciudad'].includes(field.name)) {
          document.getElementById('step-4').classList.remove('active');
          document.getElementById('step-3').classList.add('active');
        }
        return;
      }
    }

    try {
      // Confirmación visual
      document.getElementById('step-4').classList.remove('active');
      document.getElementById('step-5').classList.add('active');

      console.log("Enviando datos al servidor (FormData)...");

      const response = await fetch('/awaq/api/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log("Respuesta:", data);

      if (response.ok) {
        if (data.token) {
          //localStorage.setItem('authToken', data.token);
          console.log("Token guardado en localStorage");
        }
      } else {
        alert(data.message || 'Error al registrar usuario');
        console.error("Error de registro:", data);
        document.getElementById('step-5').classList.remove('active');
        document.getElementById('step-1').classList.add('active');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
      document.getElementById('step-5').classList.remove('active');
      document.getElementById('step-1').classList.add('active');
    }
  });
});
