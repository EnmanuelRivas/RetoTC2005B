document.addEventListener('DOMContentLoaded', function() {
    // Manejo de la vista previa de la imagen
    const profileImgInput = document.getElementById('profileImgInput');
    const profileImgPreview = document.getElementById('profileImgPreview');
    
    profileImgInput.addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
          profileImgPreview.innerHTML = `<img src="${e.target.result}" alt="Imagen de perfil">`;
        }
        
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

    // Envío del formulario
    document.getElementById('submitBtn').addEventListener('click', async function(e) {
      e.preventDefault();
      
      const form = document.getElementById('registroForm');
      const formData = new FormData(form);
      
      // Validar campos requeridos
      const requiredFields = [
        { name: 'nombre', label: 'Nombre' },
        { name: 'apellidos', label: 'Apellidos' },
        { name: 'correo', label: 'Correo electrónico' },
        { name: 'contraseña', label: 'Contraseña' },
        { name: 'pais', label: 'País' },
        { name: 'numeroTelefono', label: 'Número telefónico' },
        { name: 'provincia', label: 'Provincia' },
        { name: 'ciudad', label: 'Ciudad' },
        { name: 'organizacion', label: 'Organización' },
        { name: 'descripcion', label: 'Descripción' }
      ];
      
      for (const field of requiredFields) {
        const value = formData.get(field.name);
        if (!value || value.trim() === '') {
          alert(`El campo ${field.label} no puede estar vacío`);
          // Determinar a qué paso regresar según el campo que falta
          if (['nombre', 'apellidos', 'correo', 'contraseña'].includes(field.name)) {
            document.getElementById('step-4').classList.remove('active');
            document.getElementById('step-1').classList.add('active');
          } else if (['pais', 'numeroTelefono', 'provincia', 'ciudad'].includes(field.name)) {
            document.getElementById('step-4').classList.remove('active');
            document.getElementById('step-3').classList.add('active');
          } else {
            // Campos de organización y descripción están en el paso 4, ya estamos ahí
          }
          return;
        }
      }
      
      try {
        // Navegar al paso 5 (confirmación)
        document.getElementById('step-4').classList.remove('active');
        document.getElementById('step-5').classList.add('active');
        
        // Enviar datos al servidor
        const response = await fetch('/awaq/api/register', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Guardar token en localStorage si está disponible
          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }
        } else {
          alert(data.message || 'Error al registrar usuario');
          // Volver al paso 1 si hay error
          document.getElementById('step-5').classList.remove('active');
          document.getElementById('step-1').classList.add('active');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
        // Volver al paso 1 si hay error
        document.getElementById('step-5').classList.remove('active');
        document.getElementById('step-1').classList.add('active');
      }
    });
  });