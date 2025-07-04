/**
 * Cierra el formulario emergente, limpia sus campos y oculta el contenedor JSON.
 */
function closeForm() {
    document.getElementById('form-overlay').classList.add('d-none');
    document.getElementById('dynamic-form').innerHTML = "";
    document.getElementById('record-type').value = "";
    document.getElementById('json-preview-container').style.display = 'none';
    document.getElementById('json-output').textContent = '';
  }
  
function closeJsonPreview() {
    document.getElementById('json-preview-container').style.display = 'none';
}
  
/**
 * Carga dinámicamente el formulario HTML correspondiente al tipo seleccionado.
 * 
 * @param {string} type - Tipo de registro a cargar (nombre del archivo HTML).
 */
function loadRecordTypeForm(type) {
    const container = document.getElementById('dynamic-form');
    if (!type) return container.innerHTML = "";
  
    fetch(`../partials/${type}.html`)
      .then(res => {
        if (!res.ok) throw new Error("Formulario no encontrado");
        return res.text();
      })
      .then(html => container.innerHTML = html)
      .catch(err => {
        console.error(err);
        container.innerHTML = `<div class='text-danger'>Error al cargar el formulario: ${type}</div>`;
      });
  }
  
/**
 * Genera una vista previa en formato JSON del contenido del formulario.
 */
  function generateJsonPreview() {
    const weather = document.getElementById('weather')?.value;
    const season = document.getElementById('season')?.value;
    const recordType = document.getElementById('record-type')?.value;
  
    const dynamicForm = document.getElementById('dynamic-form');
    const inputs = dynamicForm.querySelectorAll('input, select, textarea');
    const data = { weather, season, recordType };
  
    inputs.forEach(input => {
      const key = input.name || input.id || input.getAttribute("data-label") || `unnamed_${Math.random().toString(36).slice(2, 7)}`;
  
      if (input.type === 'radio' || input.type === 'checkbox') {
        if (input.checked) {
          if (data[key]) {
            if (Array.isArray(data[key])) {
              data[key].push(input.value);
            } else {
              data[key] = [data[key], input.value];
            }
          } else {
            data[key] = input.value;
          }
        }
      } else if (input.type === 'file') {
          const fileInput = document.getElementById('evidence');
          if (fileInput && fileInput.files.length > 0) {
            const fileNames = Array.from(fileInput.files).map(file => file.name);
            data['images'] = fileNames;
          }
      } else {
        data[key] = input.value;
      }
    });
  
    document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);
    document.getElementById('json-preview-container').style.display = 'block';
  }

/**
 * Envia el contenido del formulario como JSON al backend con POST.
 */
  function sendForms() {
  const weather = document.getElementById('weather')?.value;
  const season = document.getElementById('season')?.value;
  const recordType = document.getElementById('record-type')?.value;

  const dynamicForm = document.getElementById('dynamic-form');
  const inputs = dynamicForm.querySelectorAll('input, select, textarea');
  const data = { estadoTiempo: weather, estacion: season, tipoRegistro: recordType };

  let hasData = false;

  inputs.forEach(input => {
    if (input.type === 'file') return; // Ignorar archivos

    const key = input.name || input.id || input.getAttribute("data-label") || `unnamed_${Math.random().toString(36).slice(2, 7)}`;

    if (input.type === 'radio') {
      if (input.checked) {
        data[key] = input.value;
        hasData = true;
      }
    } else {
      if (input.value?.trim() !== "") {
        data[key] = input.value;
        hasData = true;
      }
    }
  });

  if (!hasData && !weather && !season && !recordType) {
    showAlert('Por favor llena al menos un campo antes de enviar el formulario.', 'warning');
    return;
  }

  fetch('/registro/subirVariableClimatica', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(respuesta => {
    if (respuesta.message?.includes('exitosamente')) {
      showAlert('Registro enviado exitosamente.', 'success');
      closeForm();
    } else {
      showAlert('Hubo un problema al enviar el formulario.', 'danger');
    }
  })
  .catch(error => {
    console.error("Error al enviar:", error);
    showAlert('Error al conectar con el servidor.', 'danger');
  });
}

/**
 * Muestra una alerta en la interfaz.
 * 
 * @param {string} message - Mensaje a mostrar.
 * @param {string} [type='info'] - Tipo de alerta ('success', 'danger', 'warning', etc).
 */
  function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
  
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
  
    container.innerHTML = ''; // Limpia alertas anteriores si hay
    container.appendChild(alert);
  
    setTimeout(() => {
      alert.classList.remove('show');
      alert.classList.add('hide');
    }, 5000); // se oculta tras 5 segundos
  }
  
  
  
