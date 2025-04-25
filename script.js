  function sendMessage() {
      const input = document.querySelector('.input-bar input');
      const message = input.value.trim();
      if (message) {
        alert(`Mensaje enviado: ${message}`);
        input.value = ''; // Limpiar el campo de texto
      }
      }