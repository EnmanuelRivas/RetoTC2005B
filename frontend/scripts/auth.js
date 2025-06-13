/**
 * Servicio de autenticación para el frontend
 */
const AuthService = {
    getToken() {
        return localStorage.getItem("authToken");
    },

    setToken(token) {
        localStorage.setItem("authToken", token);
    },

    removeToken() {
        localStorage.removeItem("authToken");
    },

    isAuthenticated() {
        return !!this.getToken();
    },    logout() {
        this.removeToken();
        // Redirigir al login
        window.location.href = "/awaq/login.html";
    },

    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Authorization': `Bearer ${token}`,  // Corregido el template string
            'Content-Type': 'application/json'
        };
    },

    async fetchWithAuth(url, options = {}) {
        const headers = {
            ...options.headers,
            ...this.getAuthHeaders()
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401 || response.status === 403) {
            // Token expirado o inválido: cerrar sesión
            this.logout();
            return null;
        }

        return response;
    },

    // Función para mostrar el rol del usuario en todas las páginas
    displayUserRole(elementId = 'user-name', showAdminAlert = false) {
        const user = getUserInfoFromToken();
        if (user) {
            const nameElement = document.getElementById(elementId);
            if (nameElement) {                if (user.isAdmin) {
                    // Para administradores: texto en verde + ícono de escudo
                    nameElement.innerHTML = '<span style="color: #00ff00; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Administrador</span> <i class="bi bi-shield-check" style="color: #00ff00;"></i>';

                    // Mostrar alerta solo en página home o si se especifica
                    if (showAdminAlert) {
                        this.showAdminAlert();
                    }
                } else {
                    // Para usuarios normales: texto blanco + ícono de persona
                    nameElement.innerHTML = '<span style="color: #ffffff; font-weight: normal; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Usuario</span> <i class="bi bi-person-fill" style="color: #ffffff;"></i>';
                }
            }
        }
    },

    // Función para mostrar la alerta de modo administrador
    showAdminAlert() {
        const adminAlertHTML = `
            <div class="admin-alert mb-4" style="
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                border: 2px solid #28a745; 
                color: #155724; 
                padding: 20px; 
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
                animation: slideInFromTop 0.5s ease-out;
            ">
                <i class="bi bi-shield-check text-success me-2 fs-5"></i>
                <strong>Modo Administrador:</strong> Tienes acceso a funciones administrativas avanzadas.
                <a href="/awaq/metricas" class="btn btn-sm btn-success ms-3 shadow-sm">
                    <i class="bi bi-speedometer2 me-1"></i>Ir al Dashboard
                </a>
            </div>
        `;
        
        const container = document.querySelector('.container');
        if (container && !document.querySelector('.admin-alert')) {
            container.insertAdjacentHTML('afterbegin', adminAlertHTML);
        }
    },    // Función flexible para mostrar el rol en elementos con contenido mixto
    displayUserRoleInElement(elementId, iconClass = 'bi-person-fill') {
        const user = getUserInfoFromToken();
        if (user) {
            const element = document.getElementById(elementId);
            if (element) {
                const roleName = user.isAdmin ? 'Administrador' : 'Usuario';
                const roleColor = user.isAdmin ? '#00ff00' : '#ffffff';
                const roleClass = user.isAdmin ? 'admin-role' : 'user-role';
                const roleIcon = user.isAdmin ? 'bi-shield-check' : iconClass;
                
                element.innerHTML = `<span class="${roleClass}" style="color: ${roleColor}; font-weight: ${user.isAdmin ? 'bold' : 'normal'}; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${roleName}</span> <i class="bi ${roleIcon}" style="color: ${roleColor};"></i>`;
            }
        }
    },
};

/**
 * Verifica si el usuario está autenticado, si no redirige al login
 */
function checkAuth() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = "/awaq/login.html";
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const publicPages = [
        "/awaq", "/awaq/", "/awaq/login.html", "/awaq/registro.html",
        "/awaq/recuperar.html", "/awaq/changepwd.html", "/awaq/confirmacion.html"
    ];

    const currentPath = window.location.pathname;

    if (!publicPages.includes(currentPath)) {
        checkAuth();
        checkAdminAccess();
    }

    const logoutButton = document.querySelector(".logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            AuthService.logout();
        });
    }
});

// Decodifica JWT para obtener rol administrador
function getIsAdminFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role_id === 1;
    } catch (error) {
        console.error('Token inválido:', error);
        return false;
    }
}

// Obtiene info básica del usuario desde token
function getUserInfoFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.id,
            name: payload.username || 'Desconocido',
            email: payload.username || 'sin@email.com',
            isAdmin: Number(payload.role_id) === 1,
            role_id: payload.role_id
        };
    } catch (err) {
        console.error('Error al leer el token:', err);
        return null;
    }
}

// Muestra u oculta elemento según rol admin
function toggleAdminElement(elementId, showForAdmin = true) {
    const element = document.getElementById(elementId);
    const isAdmin = getIsAdminFromToken();

    if (element) {
        element.style.display = showForAdmin ? (isAdmin ? 'block' : 'none') : (isAdmin ? 'none' : 'block');
    }
}

// Oculta varios elementos si no es admin
function hideForNonAdmins(elementIds) {
    const isAdmin = getIsAdminFromToken();

    if (!isAdmin) {
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'none';
        });
    }
}

// Verifica acceso admin y redirige si no tiene permisos
function checkAdminAccess() {
    const isAdmin = getIsAdminFromToken();
    const currentPath = window.location.pathname;

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

// Agrega botones admin dinámicamente
function addAdminButtons(containerId) {
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

// Muestra info del usuario con estilo según rol
function displayUserInfo(elementId) {
    const user = getUserInfoFromToken();
    const element = document.getElementById(elementId);

    if (user && element) {
        const roleText = user.isAdmin ? 'Administrador' : 'Usuario';
        const roleColor = user.isAdmin ? '#00ff00' : '#ffffff';
        const roleIcon = user.isAdmin ? 'bi-shield-check' : 'bi-person-fill';
        
        element.innerHTML = `<span style="color: ${roleColor}; font-weight: ${user.isAdmin ? 'bold' : 'normal'};">${roleText}</span> <i class="bi ${roleIcon}" style="color: ${roleColor};"></i>`;
    }
}

// Exporta para su uso
export { 
    AuthService, 
    checkAuth,
    getIsAdminFromToken, 
    getUserInfoFromToken,
    toggleAdminElement,
    hideForNonAdmins,
    checkAdminAccess,
    addAdminButtons,
    displayUserInfo
};
