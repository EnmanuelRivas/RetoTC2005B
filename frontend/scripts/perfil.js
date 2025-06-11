/**
 * Script para manejar la funcionalidad del perfil de usuario
 */

let perfilData = null;
let isEditing = false;

/**
 * Inicializa la página de perfil
 */
async function initPerfil() {
    try {
        await cargarDatosPerfil();
        setupEventListeners();
        mostrarInformacionUsuario();
    } catch (error) {
        console.error('Error al inicializar perfil:', error);
        mostrarNotificacion('Error al cargar los datos del perfil', 'error');
    }
}

/**
 * Carga los datos del perfil desde el backend
 */
async function cargarDatosPerfil() {
    try {
        console.log('=== CARGANDO PERFIL ===');
        const token = localStorage.getItem('authToken');
        console.log('Token encontrado:', !!token);
        
        if (!token) {
            console.log('No hay token, redirigiendo...');
            window.location.href = '/awaq';
            return;
        }

        console.log('Haciendo petición a /awaq/api/profile');
        const response = await fetch('/awaq/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
              if (response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = '/awaq';
                return;
            }
            throw new Error(`Error ${response.status}: ${errorText}`);
        }        const responseData = await response.json();
        console.log('Datos recibidos:', responseData);
        
        if (responseData.status === 'success') {
            perfilData = responseData.data;
            mostrarDatosPerfil();
        } else {
            throw new Error(responseData.message || 'Error al obtener datos del perfil');
        }
        
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        mostrarNotificacion('Error al cargar los datos del perfil: ' + error.message, 'error');
    }
}

/**
 * Muestra los datos del perfil en la interfaz
 */
function mostrarDatosPerfil() {
    if (!perfilData) return;

    // Información de solo lectura
    const emailDisplay = document.getElementById('email-display');
    const rolDisplay = document.getElementById('rol-display');
    const fechaDisplay = document.getElementById('fecha-registro-display');
    
    if (emailDisplay) emailDisplay.value = perfilData.correo || '';
    if (rolDisplay) rolDisplay.value = perfilData.role_id === 1 ? 'Administrador' : 'Usuario';
    if (fechaDisplay) fechaDisplay.value = perfilData.fecha_registro ? new Date(perfilData.fecha_registro).toLocaleDateString('es-ES') : '';

    // Campos editables
    const campos = {
        'nombre': perfilData.nombre || '',
        'apellidos': perfilData.apellidos || '',
        'numeroTelefono': perfilData.numeroTelefono || '',
        'pais': perfilData.pais || '',
        'provincia': perfilData.provincia || '',
        'ciudad': perfilData.ciudad || '',
        'organizacion': perfilData.organizacion || '',
        'descripcion': perfilData.descripcion || ''
    };

    Object.keys(campos).forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.value = campos[campo];
    });

    // Mostrar imagen de perfil
    mostrarImagenPerfil();
}

/**
 * Muestra la imagen de perfil del usuario
 */
function mostrarImagenPerfil() {
    const profileImgPreview = document.getElementById('profile-img-preview');
    if (!profileImgPreview) return;

    if (perfilData && perfilData.imagen_perfil) {
        // Construir la URL completa de la imagen
        const imageUrl = `/awaq/uploads/${perfilData.imagen_perfil}`;
        profileImgPreview.innerHTML = `<img src="${imageUrl}" alt="Imagen de perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
        profileImgPreview.innerHTML = '<i class="bi bi-person" style="font-size: 48px; color: #ccc;"></i>';
    }
}

/**
 * Muestra información del usuario en el header
 */
function mostrarInformacionUsuario() {
    if (!perfilData) return;
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        const isAdmin = perfilData.role_id === 1;
        userNameElement.textContent = isAdmin ? 'Administrador' : 'Usuario';
        userNameElement.style.color = isAdmin ? '#28a745' : '#ffffff';
        userNameElement.style.fontWeight = isAdmin ? 'bold' : 'normal';
    }
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botón para editar perfil
    const btnEditar = document.getElementById('btn-editar-perfil');
    if (btnEditar) {
        btnEditar.addEventListener('click', toggleEditMode);
    }

    // Botón para cancelar edición
    const btnCancelar = document.getElementById('btn-cancelar-perfil');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cancelarEdicion);
    }

    // Formulario de perfil
    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', actualizarPerfil);
    }

    // Botón para cambiar contraseña
    const btnCambiarPassword = document.getElementById('btn-cambiar-password');
    if (btnCambiarPassword) {
        btnCambiarPassword.addEventListener('click', togglePasswordForm);
    }

    // Botón para cancelar cambio de contraseña
    const btnCancelarPassword = document.getElementById('btn-cancelar-password');
    if (btnCancelarPassword) {
        btnCancelarPassword.addEventListener('click', cancelarCambioPassword);
    }

    // Formulario de contraseña
    const formPassword = document.getElementById('form-password');
    if (formPassword) {
        formPassword.addEventListener('submit', actualizarPassword);
    }

    // Botón de logout
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('authToken');
            window.location.href = '/awaq';
        });
    }    // Sidebar logout
    const sidebarLogout = document.querySelector('.sidebar-logout');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', function() {
            localStorage.removeItem('authToken');
            window.location.href = '/awaq';
        });
    }

    // Manejo de imagen de perfil
    const profileImgInput = document.getElementById('profile-img-input');
    if (profileImgInput) {
        profileImgInput.addEventListener('change', handleImageUpload);
    }
}

/**
 * Alterna entre modo edición y modo visualización
 */
function toggleEditMode() {
    const campos = ['nombre', 'apellidos', 'numeroTelefono', 'pais', 'provincia', 'ciudad', 'organizacion', 'descripcion'];
    const btnEditar = document.getElementById('btn-editar-perfil');
    const formActions = document.querySelector('.form-actions');

    if (!isEditing) {
        // Entrar en modo edición
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) input.disabled = false;
        });
        btnEditar.style.display = 'none';
        formActions.style.display = 'flex';
        isEditing = true;
    }
}

/**
 * Cancela la edición y restaura valores originales
 */
function cancelarEdicion() {
    const campos = ['nombre', 'apellidos', 'numeroTelefono', 'pais', 'provincia', 'ciudad', 'organizacion', 'descripcion'];
    const btnEditar = document.getElementById('btn-editar-perfil');
    const formActions = document.querySelector('.form-actions');

    // Salir del modo edición
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input) input.disabled = true;
    });
    btnEditar.style.display = 'inline-block';
    formActions.style.display = 'none';
    isEditing = false;
    
    // Restaurar valores originales
    mostrarDatosPerfil();
}

/**
 * Actualiza el perfil del usuario
 */
async function actualizarPerfil(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    submitBtn.disabled = true;    try {
        const formData = new FormData();
        
        // Agregar datos del formulario
        formData.append('nombre', document.getElementById('nombre').value.trim());
        formData.append('apellidos', document.getElementById('apellidos').value.trim());
        formData.append('numeroTelefono', document.getElementById('numeroTelefono').value.trim());
        formData.append('pais', document.getElementById('pais').value.trim());
        formData.append('provincia', document.getElementById('provincia').value.trim());
        formData.append('ciudad', document.getElementById('ciudad').value.trim());
        formData.append('organizacion', document.getElementById('organizacion').value.trim());
        formData.append('descripcion', document.getElementById('descripcion').value.trim());

        // Verificar campos requeridos
        if (!formData.get('nombre') || !formData.get('apellidos')) {
            mostrarNotificacion('Nombre y apellidos son requeridos', 'error');
            return;
        }

        // Agregar imagen si se seleccionó una nueva
        const profileImgInput = document.getElementById('profile-img-input');
        if (profileImgInput && profileImgInput.files.length > 0) {
            formData.append('profileImg', profileImgInput.files[0]);
        }

        const token = localStorage.getItem('authToken');
        const response = await fetch('/awaq/api/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.message || 'Error al actualizar perfil');
        }

        if (resultado.status === 'success') {
            mostrarNotificacion('Perfil actualizado correctamente', 'success');
            
            // Recargar los datos del perfil para reflejar los cambios
            await cargarDatosPerfil();
            
            // Salir del modo edición
            cancelarEdicion();
        } else {
            throw new Error(resultado.message || 'Error al actualizar perfil');
        }} catch (error) {
        console.error('Error al actualizar perfil:', error);
        mostrarNotificacion(error.message, 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Muestra una notificación al usuario
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear o actualizar elemento de notificación
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = mensaje;
    
    // Aplicar colores según el tipo
    switch (tipo) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
    }, tipo === 'error' ? 5000 : 3000);
}

/**
 * Muestra/oculta el formulario de cambio de contraseña
 */
function togglePasswordForm() {
    const passwordForm = document.getElementById('form-password');
    const btnCambiarPassword = document.getElementById('btn-cambiar-password');
    
    if (passwordForm.style.display === 'none' || passwordForm.style.display === '') {
        passwordForm.style.display = 'block';
        btnCambiarPassword.style.display = 'none';
        // Limpiar el formulario
        passwordForm.reset();
    } else {
        passwordForm.style.display = 'none';
        btnCambiarPassword.style.display = 'inline-block';
    }
}

/**
 * Cancela el cambio de contraseña
 */
function cancelarCambioPassword() {
    const passwordForm = document.getElementById('form-password');
    const btnCambiarPassword = document.getElementById('btn-cambiar-password');
    
    passwordForm.style.display = 'none';
    btnCambiarPassword.style.display = 'inline-block';
    document.getElementById('form-password').reset();
}

/**
 * Actualiza la contraseña del usuario
 */
async function actualizarPassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
        mostrarNotificacion('Todos los campos son requeridos', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        mostrarNotificacion('Las nuevas contraseñas no coinciden', 'error');
        return;
    }

    if (newPassword.length < 6) {
        mostrarNotificacion('La nueva contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Actualizando...';
    submitBtn.disabled = true;

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/awaq/api/profile/password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword
            })
        });

        const resultado = await response.json();

        if (response.ok && resultado.status === 'success') {
            mostrarNotificacion('Contraseña actualizada correctamente', 'success');
            cancelarCambioPassword();
        } else {
            mostrarNotificacion(resultado.message || 'Error al actualizar la contraseña', 'error');
        }
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        mostrarNotificacion('Error de conexión', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Maneja la carga de imagen de perfil
 */
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        mostrarNotificacion('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        mostrarNotificacion('La imagen debe ser menor a 5MB', 'error');
        return;
    }

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = function(e) {
        const profileImgPreview = document.getElementById('profile-img-preview');
        if (profileImgPreview) {
            profileImgPreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
    };
    reader.readAsDataURL(file);

    // Subir imagen inmediatamente
    uploadProfileImage(file);
}

/**
 * Sube la imagen de perfil al servidor
 */
async function uploadProfileImage(file) {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const token = localStorage.getItem('authToken');
        const response = await fetch('/awaq/api/upload-profile-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const resultado = await response.json();

        if (response.ok && resultado.status === 'success') {
            mostrarNotificacion('Imagen de perfil actualizada correctamente', 'success');
            // Actualizar los datos del perfil
            await cargarDatosPerfil();
        } else {
            mostrarNotificacion(resultado.message || 'Error al subir la imagen', 'error');
            // Restaurar imagen anterior
            mostrarImagenPerfil();
        }
    } catch (error) {
        console.error('Error al subir imagen:', error);
        mostrarNotificacion('Error de conexión al subir la imagen', 'error');
        // Restaurar imagen anterior
        mostrarImagenPerfil();
    }
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', initPerfil);