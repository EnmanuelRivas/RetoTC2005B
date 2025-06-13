/**
 * Script específico para funcionalidades de administrador
 * Debe ser importado en páginas que requieran funcionalidades admin
 */

import { getIsAdminFromToken, getUserInfoFromToken } from './auth.js';

/**
 * Inicializa la interfaz de administrador en la página actual
 */
function initAdminInterface() {
    const isAdmin = getIsAdminFromToken();
    
    if (isAdmin) {
        document.body.classList.add('admin-user');
        addAdminQuickActions();
        showAdminAlerts();
    } else {
        document.body.classList.add('regular-user');
        hideAdminElements();
    }
}

/**
 * Agrega botones de acciones rápidas para administradores
 */
function addAdminQuickActions() {
    const quickActionsHTML = `
        <div class="admin-quick-actions">
            <div class="btn-group-vertical" role="group">
                <button type="button" class="btn btn-sm btn-primary" onclick="location.href='/awaq/dashboard'" title="Dashboard">
                    <i class="bi bi-speedometer2"></i>
                </button>
                <button type="button" class="btn btn-sm btn-warning" onclick="location.href='/awaq/gestion_usuario'" title="Gestión Usuarios">
                    <i class="bi bi-people"></i>
                </button>
                <button type="button" class="btn btn-sm btn-info" onclick="location.href='/awaq/metricas'" title="Métricas">
                    <i class="bi bi-bar-chart"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', quickActionsHTML);
}

/**
 * Muestra alertas específicas para administradores
 */
function showAdminAlerts() {
    const user = getUserInfoFromToken();
    if (user && user.isAdmin) {
        // Mostrar alerta si es necesario
        const currentPath = window.location.pathname;
        const adminPages = ['/awaq/dashboard', '/awaq/gestion_usuario', '/awaq/metricas'];
        
        if (!adminPages.includes(currentPath)) {
            const alertHTML = `
                <div class="admin-alert">
                    <strong>Modo Administrador:</strong> Tienes acceso a funciones administrativas.
                    <a href="/awaq/dashboard" class="btn btn-sm btn-outline-warning ms-2">Ir al Dashboard</a>
                </div>
            `;
            
            const container = document.querySelector('.container') || document.body;
            container.insertAdjacentHTML('afterbegin', alertHTML);
        }
    }
}

/**
 * Oculta elementos específicos de administrador para usuarios normales
 */
function hideAdminElements() {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(element => {
        element.style.display = 'none';
    });
}

/**
 * Verifica permisos antes de realizar acciones administrativas
 */
function requireAdminAction(callback) {
    const isAdmin = getIsAdminFromToken();
    
    if (isAdmin) {
        callback();
    } else {
        alert('Esta acción requiere permisos de administrador.');
        return false;
    }
}

/**
 * Crea menú contextual para administradores
 */
function createAdminContextMenu(targetElement) {
    const isAdmin = getIsAdminFromToken();
    
    if (!isAdmin) return;
    
    targetElement.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // Remover menús existentes
        const existingMenu = document.querySelector('.admin-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menuHTML = `
            <div class="admin-context-menu" style="
                position: fixed;
                top: ${e.clientY}px;
                left: ${e.clientX}px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px 0;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
            ">
                <div class="context-item" onclick="location.href='/awaq/dashboard'" style="padding: 8px 12px; cursor: pointer;">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </div>
                <div class="context-item" onclick="location.href='/awaq/gestion_usuario'" style="padding: 8px 12px; cursor: pointer;">
                    <i class="bi bi-people"></i> Gestión Usuarios
                </div>
                <div class="context-item" onclick="location.href='/awaq/metricas'" style="padding: 8px 12px; cursor: pointer;">
                    <i class="bi bi-bar-chart"></i> Métricas
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        
        // Agregar event listener para cerrar el menú
        document.addEventListener('click', function closeMenu() {
            const menu = document.querySelector('.admin-context-menu');
            if (menu) {
                menu.remove();
            }
            document.removeEventListener('click', closeMenu);
        });
    });
}

/**
 * Agrega loggers para acciones administrativas
 */
function logAdminAction(action, details = '') {
    const user = getUserInfoFromToken();
    const isAdmin = getIsAdminFromToken();
    
    if (isAdmin) {
        const logData = {
            timestamp: new Date().toISOString(),
            user: user.email,
            action: action,
            details: details,
            page: window.location.pathname
        };
        
        console.log('Admin Action:', logData);
        
        // Aquí podrías enviar el log al servidor si fuera necesario
        // fetch('/awaq/api/admin-logs', { method: 'POST', body: JSON.stringify(logData) });
    }
}

// Hacer funciones globalmente disponibles
window.initAdminInterface = initAdminInterface;
window.requireAdminAction = requireAdminAction;
window.createAdminContextMenu = createAdminContextMenu;
window.logAdminAction = logAdminAction;

// Exportar función para inicializar automáticamente
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en una página que lo requiera
    const autoInit = document.querySelector('[data-admin-init="true"]');
    if (autoInit) {
        initAdminInterface();
    }
});
