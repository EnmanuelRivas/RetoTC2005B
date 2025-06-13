document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('anteproyectoForm');
  const alertContainer = document.getElementById('alertContainer');
  const token = localStorage.getItem('authToken');

  // Verifica si hay sesión activa
  if (!token) {
    alertContainer.innerHTML = '<div class="alert alert-danger">No hay sesión activa. Por favor inicia sesión primero.</div>';
    form.style.display = 'none';
    return;
  }

  // Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Construye el objeto con los datos capturados del formulario
    const data = {
      titulo: document.getElementById('title-anteproyecto').value,
      descripcion: document.getElementById('description-anteproyecto').value,
      fecha_creacion: new Date().toISOString().split('T')[0], // hoy
      fecha_limite: document.getElementById('duedate-anteproyecto').value,
      estado: 'pendiente',
      sitioweb: document.getElementById('website-anteproyecto').value,
      region: document.getElementById('region-anteproyecto').value,
      organizacion: document.getElementById('organization-anteproyecto').value,
      pais: document.getElementById('country-anteproyecto').value,
      convocatoria_id: document.getElementById('convocatoriaSelect').value
    };

    try {
      // Realiza petición POST para enviar los datos del anteproyecto
      const res = await fetch('/awaq/api/postAnteproyecto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const json = await res.json();
      alertContainer.innerHTML = '';

      if (res.ok) {
        alertContainer.innerHTML = `<div class="alert alert-success">${json.message}</div>`;
        form.reset();
      } else {
        alertContainer.innerHTML = `<div class="alert alert-danger">${json.message || json.error}</div>`;
      }
    } catch (error) {
      console.error('Error al enviar el anteproyecto:', error);
      alertContainer.innerHTML = '<div class="alert alert-danger">Error de conexión con el servidor</div>';
    }
  });
});
