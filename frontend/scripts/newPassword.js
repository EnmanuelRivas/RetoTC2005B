document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      document.getElementById('alertError').textContent = 'Token inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.';
      document.getElementById('alertError').style.display = 'block';
      document.getElementById('nueva-contrasena').disabled = true;
      document.getElementById('confirmar-contrasena').disabled = true;
      document.getElementById('guardarBtn').disabled = true;
      return;
    }
    
    // Verificar si el token es válido
    verificarToken(token);
    
    // Manejar el envío del formulario
    document.getElementById('guardarBtn').addEventListener('click', function() {
      cambiarPassword(token);
    });
  });
  
  // Función para verificar si el token es válido
  async function verificarToken(token) {
    try {
      const response = await fetch('/awaq/api/verificar-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        document.getElementById('alertError').textContent = 'Token inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.';
        document.getElementById('alertError').style.display = 'block';
        document.getElementById('nueva-contrasena').disabled = true;
        document.getElementById('confirmar-contrasena').disabled = true;
        document.getElementById('guardarBtn').disabled = true;
      }
    } catch (error) {
      document.getElementById('alertError').textContent = 'Error de conexión. Por favor, intenta nuevamente.';
      document.getElementById('alertError').style.display = 'block';
    }
  }
  
  // Función para cambiar la contraseña
  async function cambiarPassword(token) {
    const nueva = document.getElementById('nueva-contrasena').value;
    const confirmar = document.getElementById('confirmar-contrasena').value;
    
    // Validar que las contraseñas no estén vacías
    if (!nueva || !confirmar) {
      document.getElementById('alertError').textContent = 'Por favor, completa todos los campos.';
      document.getElementById('alertError').style.display = 'block';
      document.getElementById('alertSuccess').style.display = 'none';
      return;
    }
    
    // Validar que las contraseñas coincidan
    if (nueva !== confirmar) {
      document.getElementById('alertError').textContent = 'Las contraseñas no coinciden.';
      document.getElementById('alertError').style.display = 'block';
      document.getElementById('alertSuccess').style.display = 'none';
      return;
    }
    
    try {
      const response = await fetch('/awaq/api/restablecer-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          nuevaContraseña: nueva
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        document.getElementById('alertSuccess').style.display = 'block';
        document.getElementById('alertError').style.display = 'none';
        document.getElementById('nueva-contrasena').value = '';
        document.getElementById('confirmar-contrasena').value = '';
        
        // Redirigir al login después de 3 segundos
        setTimeout(function() {
          window.location.href = '/awaq';
        }, 3000);
      } else {
        document.getElementById('alertError').textContent = data.message || 'Ha ocurrido un error. Por favor, intenta nuevamente.';
        document.getElementById('alertError').style.display = 'block';
        document.getElementById('alertSuccess').style.display = 'none';
      }
    } catch (error) {
      document.getElementById('alertError').textContent = 'Error de conexión. Por favor, intenta nuevamente.';
      document.getElementById('alertError').style.display = 'block';
      document.getElementById('alertSuccess').style.display = 'none';
    }
  }