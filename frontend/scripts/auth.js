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
    },

    logout() {
        this.removeToken();
        // Redirigir al login o página inicial
        window.location.href = "/awaq";
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
    }
};

/**
 * Verifica si el usuario está autenticado, si no redirige al login
 */
function checkAuth() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = "/awaq";
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const publicPages = [
        "/awaq", "/awaq/", "/awaq/login", "/awaq/registro",
        "/awaq/recuperar", "/awaq/changepwd", "/awaq/confirmacion"
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
            isAdmin: payload.role_id === 1,
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
        element.textContent = roleText;

        if (user.isAdmin) {
            element.style.color = '#28a745'; // verde admin
            element.style.fontWeight = 'bold';
        } else {
            element.style.color = '#ffffff'; // blanco usuario normal
        }
    }
}
