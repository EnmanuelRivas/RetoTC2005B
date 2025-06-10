/**
 * Servicio de autenticación para el frontend
 */
const AuthService = {
    /**
     * Obtiene el token de autenticación del localStorage
     * @returns {string|null} El token JWT o null si no existe
     */
    getToken() {
        return localStorage.getItem("authToken");
    },

    /**
     * Guarda el token de autenticación en localStorage
     * @param {string} token - El token JWT a guardar
     */
    setToken(token) {
        localStorage.setItem("authToken", token);
    },

    /**
     * Elimina el token de autenticación (cierra sesión)
     */
    removeToken() {
        localStorage.removeItem("authToken");
    },

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} true si hay un token guardado
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        this.removeToken();
        window.location.href = "/awaq";
    },

    /**
     * Obtiene los headers de autenticación para las peticiones
     * @returns {Object} Headers con el token de autenticación
     */
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },

    /**
     * Realiza una petición autenticada
     * @param {string} url - URL de la petición
     * @param {Object} options - Opciones de fetch
     * @returns {Promise} Resultado de la petición
     */
    async fetchWithAuth(url, options = {}) {
        const headers = {
            ...options.headers,
            ...this.getAuthHeaders()
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        // Si recibimos un 401 o 403, el token ha expirado o es inválido
        if (response.status === 401 || response.status === 403) {
            this.logout();
            return null;
        }

        return response;
    }
};

/**
 * Verifica si el usuario está autenticado, si no lo está redirige al login
 */
function checkAuth() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = "/awaq";
        return false;
    }
    return true;
}

// Ejecutar verificación de autenticación en páginas protegidas
document.addEventListener("DOMContentLoaded", () => {
    // Lista de páginas que no requieren autenticación
    const publicPages = ["/awaq", "/awaq/", "/awaq/login", "/awaq/registro", "/awaq/recuperar", "/awaq/changepwd", "/awaq/confirmacion"];
    
    // Verificar si la página actual requiere autenticación
    const currentPath = window.location.pathname;
    
    // Si no estamos en una página pública, verificar autenticación
    if (!publicPages.includes(currentPath)) {
        checkAuth();
        // Verificar permisos de administrador para páginas admin
        checkAdminAccess();
    }
    
    // Agregar manejador para el botón de cerrar sesión si existe
    const logoutButton = document.querySelector(".logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            AuthService.logout();
        });
    }
});

// Para leer y decodificar el jwt
export function getIsAdminFromToken() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role_id === 1; // Verificar que sea exactamente 1 (administrador)
  } catch (error) {
    console.error('Token inválido:', error);
    return false;
  }
}

export function getUserInfoFromToken() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      name: payload.username || 'Desconocido',
      email: payload.username || 'sin@email.com',
      isAdmin: payload.role_id === 1, // Verificar que sea exactamente 1 (administrador)
      role_id: payload.role_id // Agregar role_id para referencia
    };
  } catch (err) {
    console.error('Error al leer el token:', err);
    return null;
  }
}

/**
 * Función para mostrar u ocultar elementos basados en el rol de administrador
 * @param {string} elementId - ID del elemento a mostrar/ocultar
 * @param {boolean} showForAdmin - Si true, muestra el elemento solo para admins; si false, lo oculta para admins
 */
export function toggleAdminElement(elementId, showForAdmin = true) {
  const element = document.getElementById(elementId);
  const isAdmin = getIsAdminFromToken();
  
  if (element) {
    if (showForAdmin) {
      // Mostrar solo para administradores
      element.style.display = isAdmin ? 'block' : 'none';
    } else {
      // Mostrar solo para usuarios normales (ocultar para admins)
      element.style.display = isAdmin ? 'none' : 'block';
    }
  }
}

/**
 * Función para ocultar múltiples elementos para usuarios no administradores
 * @param {string[]} elementIds - Array de IDs de elementos a ocultar
 */
export function hideForNonAdmins(elementIds) {
  const isAdmin = getIsAdminFromToken();
  
  if (!isAdmin) {
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = 'none';
      }
    });
  }
}

/**
 * Función para verificar permisos y redirigir si es necesario
 */
export function checkAdminAccess() {
  const isAdmin = getIsAdminFromToken();
  const currentPath = window.location.pathname;
  
  // Páginas que requieren permisos de administrador
  const adminPages = [
    '/awaq/dashboard',
    '/awaq/gestion_usuario',
    '/awaq/gestion_ap',
    '/awaq/metricas',
    '/awaq/numAP',
    '/awaq/numBiomos',
    '/awaq/crearEcoRanger',
    '/awaq/editarEcoRanger',
    '/awaq/viewEcoRanger'
  ];
  
  if (adminPages.includes(currentPath) && !isAdmin) {
    alert('Acceso denegado. Se requieren permisos de administrador.');
    window.location.href = '/awaq/home';
  }
}

/**
 * Función para agregar botones de administrador dinámicamente
 * @param {string} containerId - ID del contenedor donde agregar los botones
 */
export function addAdminButtons(containerId) {
  const isAdmin = getIsAdminFromToken();
  const container = document.getElementById(containerId);
  
  if (isAdmin && container) {
    const adminButtonsHTML = `
      <div class="admin-controls mt-4">
        <h5>Panel de Administrador</h5>
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-primary" onclick="location.href='/awaq/dashboard'">
            <i class="bi bi-speedometer2"></i> Dashboard
          </button>
          <button type="button" class="btn btn-warning" onclick="location.href='/awaq/gestion_usuario'">
            <i class="bi bi-people"></i> Gestión Usuarios
          </button>
          <button type="button" class="btn btn-info" onclick="location.href='/awaq/gestion_ap'">
            <i class="bi bi-file-earmark-text"></i> Gestión AP
          </button>
          <button type="button" class="btn btn-success" onclick="location.href='/awaq/metricas'">
            <i class="bi bi-bar-chart"></i> Métricas
          </button>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', adminButtonsHTML);
  }
}

/**
 * Función para mostrar información del usuario con rol
 */
export function displayUserInfo(elementId) {
  const user = getUserInfoFromToken();
  const element = document.getElementById(elementId);
  
  if (user && element) {
    const roleText = user.isAdmin ? 'Administrador' : 'Usuario';
    element.textContent = roleText;
    
    // Aplicar estilos basados en el rol
    if (user.isAdmin) {
      element.style.color = '#28a745'; // Verde para administrador
      element.style.fontWeight = 'bold';
    } else {
      element.style.color = '#ffffff'; // Blanco para usuario normal
    }
  }
}
