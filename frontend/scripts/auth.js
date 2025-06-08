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
    return payload.isAdmin;
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
      name: payload.name || 'Desconocido',
      email: payload.email || 'sin@email.com',
      isAdmin: payload.isAdmin || false
    };
  } catch (err) {
    console.error('Error al leer el token:', err);
    return null;
  }
}
