/**
 * Sistema de Contacto al Soporte
 */

class SupportSystem {
    constructor() {
        this.ensureBootstrap();
        this.initializeModal();
        this.attachEventListeners();
    }    ensureBootstrap() {
        // Verificar si Bootstrap JS está cargado
        if (typeof bootstrap === 'undefined') {
            // Cargar Bootstrap JS si no está presente
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
            script.onload = () => {
                console.log('Bootstrap JS cargado para el sistema de soporte');
            };
            document.head.appendChild(script);
        }
        
        // Cargar CSS de soporte si no está presente
        if (!document.querySelector('link[href*="support.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../styles/support.css';
            document.head.appendChild(link);
        }
    }

    initializeModal() {
        // Crear el modal si no existe
        if (!document.getElementById('supportModal')) {            const modalHTML = `
                <div class="modal fade" id="supportModal" tabindex="-1" aria-labelledby="supportModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="supportModalLabel">
                                    <i class="bi bi-headset text-success me-2"></i> 
                                    <span class="gradient-text">Contactar Soporte AWAQ</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="support-info-alert mb-4">
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-info-circle me-3 fs-4 text-info"></i>
                                        <div>
                                            <strong>¿Necesitas ayuda?</strong>
                                            <p class="mb-0">Completa este formulario y nuestro equipo te responderá en las próximas 24-48 horas.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <form id="supportForm">
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="supportName" class="form-label">
                                                <i class="bi bi-person me-1"></i>Nombre completo *
                                            </label>
                                            <input type="text" class="form-control" id="supportName" required 
                                                   placeholder="Tu nombre completo">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="supportEmail" class="form-label">
                                                <i class="bi bi-envelope me-1"></i>Email *
                                            </label>
                                            <input type="email" class="form-control" id="supportEmail" required
                                                   placeholder="tu.email@ejemplo.com">
                                        </div>
                                    </div>
                                    
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label for="supportCategory" class="form-label">
                                                <i class="bi bi-tags me-1"></i>Categoría *
                                            </label>
                                            <select class="form-select" id="supportCategory" required>
                                                <option value="">Selecciona una categoría</option>
                                                <option value="tecnico">🔧 Problema Técnico</option>
                                                <option value="cuenta">👤 Problemas de Cuenta</option>
                                                <option value="juego">🎮 Problemas con el Juego</option>
                                                <option value="datos">📊 Problemas con Datos/Formularios</option>
                                                <option value="sugerencia">💡 Sugerencia de Mejora</option>
                                                <option value="otro">❓ Otro</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="supportPriority" class="form-label">
                                                <i class="bi bi-flag me-1"></i>Prioridad
                                            </label>
                                            <select class="form-select" id="supportPriority">
                                                <option value="baja">🟢 Baja</option>
                                                <option value="media" selected>🟡 Media</option>
                                                <option value="alta">🟠 Alta</option>
                                                <option value="urgente">🔴 Urgente</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="supportSubject" class="form-label">
                                            <i class="bi bi-chat-square-text me-1"></i>Asunto *
                                        </label>
                                        <input type="text" class="form-control" id="supportSubject" required 
                                               placeholder="Describe brevemente tu consulta">
                                    </div>

                                    <div class="mb-4">
                                        <label for="supportMessage" class="form-label">
                                            <i class="bi bi-card-text me-1"></i>Descripción detallada *
                                        </label>
                                        <textarea class="form-control" id="supportMessage" rows="5" required
                                                  placeholder="Describe tu problema o consulta de manera detallada. Incluye pasos para reproducir el problema si aplica."></textarea>
                                        <div class="form-text">Proporciona la mayor cantidad de detalles posible para ayudarnos a resolver tu consulta más rápidamente.</div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="supportBrowser" class="form-label text-white">Información técnica</label>
                                        <input type="text" class="form-control" id="supportBrowser" readonly
                                               style="background-color: #444; color: #ccc; border: 1px solid #666; font-size: 12px;">
                                    </div>

                                    <div class="mb-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="supportConsent" required
                                                   style="background-color: #555; border-color: #666;">
                                            <label class="form-check-label text-white" for="supportConsent">
                                                <i class="bi bi-shield-check text-success me-1"></i>
                                                Acepto que AWAQ procese mis datos para atender esta solicitud de soporte *
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer" style="background-color: #1f1f1f; border-top: 1px solid #444;">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                        style="background-color:rgb(60, 66, 70); border-color:rgb(59, 64, 68);">
                                    <i class="bi bi-x-circle"></i> Cancelar
                                </button>
                                <button type="button" class="btn btn-success" id="submitSupportBtn"
                                        style="background-color:rgb(84, 149, 99); border-color:rgb(33, 71, 42);">
                                    <i class="bi bi-send"></i> Enviar Solicitud
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.fillBrowserInfo();
        }
    }    attachEventListeners() {
        // Escuchar clics específicamente en botones de soporte con validación estricta
        document.addEventListener('click', (e) => {
            // Solo buscar elementos específicos de soporte
            const supportElement = e.target.closest('[data-support="true"], .support-button, button[data-support]');
            
            // Validación estricta para evitar falsas activaciones
            if (supportElement && this.isValidSupportElement(supportElement, e.target)) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎫 Abriendo modal de soporte desde:', supportElement.tagName, supportElement.className);
                this.openSupportModal();
            }
        });

        // Manejar el envío del formulario
        document.addEventListener('click', (e) => {
            if (e.target.id === 'submitSupportBtn') {
                e.preventDefault();
                e.stopPropagation();
                this.submitSupportRequest();
            }        });
    }

    isValidSupportElement(supportElement, clickedElement) {
        // Validar que el elemento tenga atributos específicos de soporte
        const hasDataSupport = supportElement.hasAttribute('data-support');
        const hasSupportClass = supportElement.classList.contains('support-button');
        
        // Verificar que el clic fue directo en el botón o en un elemento hijo permitido
        const isDirectClick = clickedElement === supportElement;
        const isIconClick = clickedElement.tagName === 'I' && clickedElement.parentElement === supportElement;
        const isTextClick = clickedElement.tagName === 'SPAN' && clickedElement.parentElement === supportElement;
        
        return (hasDataSupport || hasSupportClass) && (isDirectClick || isIconClick || isTextClick);
    }

    openSupportModal() {
        // Llenar datos del usuario si está autenticado
        this.fillUserInfo();
        
        // Crear efecto de aparición suave
        const modal = new bootstrap.Modal(document.getElementById('supportModal'), {
            backdrop: 'static',
            keyboard: true
        });
        
        // Agregar animación personalizada
        const modalElement = document.getElementById('supportModal');
        modalElement.addEventListener('shown.bs.modal', () => {
            modalElement.querySelector('.modal-dialog').style.animation = 'modalSlideIn 0.3s ease-out';
            // Enfocar el primer campo
            document.getElementById('supportName').focus();
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            // Limpiar animación
            modalElement.querySelector('.modal-dialog').style.animation = '';
        });
        
        modal.show();
        console.log('🎫 Modal de soporte abierto');
    }

    fillUserInfo() {
        try {
            // Importar getUserInfoFromToken dinámicamente
            if (window.getUserInfoFromToken) {
                const user = window.getUserInfoFromToken();
                if (user) {
                    document.getElementById('supportName').value = user.name || '';
                    document.getElementById('supportEmail').value = user.email || '';
                }
            }
        } catch (error) {
            console.log('No se pudo obtener info del usuario:', error);
        }
    }

    fillBrowserInfo() {
        const browserInfo = `${navigator.userAgent} | Resolución: ${screen.width}x${screen.height} | URL: ${window.location.href}`;
        document.getElementById('supportBrowser').value = browserInfo;
    }

    async submitSupportRequest() {
        const form = document.getElementById('supportForm');
        const submitBtn = document.getElementById('submitSupportBtn');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Deshabilitar botón durante el envío
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';

        const formData = {
            name: document.getElementById('supportName').value,
            email: document.getElementById('supportEmail').value,
            category: document.getElementById('supportCategory').value,
            priority: document.getElementById('supportPriority').value,
            subject: document.getElementById('supportSubject').value,
            message: document.getElementById('supportMessage').value,
            browserInfo: document.getElementById('supportBrowser').value,
            timestamp: new Date().toISOString(),
            userId: this.getCurrentUserId()
        };

        try {
            const response = await fetch('/api/support/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccessMessage(result.ticketId);
                this.resetForm();
                this.closeModal();
            } else {
                throw new Error('Error al enviar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage('No se pudo enviar la solicitud. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Enviar Solicitud';
        }
    }

    getCurrentUserId() {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id;
            }
        } catch (error) {
            console.log('No se pudo obtener ID del usuario');
        }
        return null;
    }

    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }    showSuccessMessage(ticketId) {
        const alertHTML = `
            <div class="alert alert-dismissible fade show position-fixed" role="alert" 
                 style="top: 20px; right: 20px; z-index: 9999; max-width: 400px;
                        background-color: #1f4f1f; border: 1px solid #28a745; color: #b8e6b8;">
                <h4 class="alert-heading" style="color: #28a745;">
                    <i class="bi bi-check-circle-fill"></i> ¡Solicitud enviada!
                </h4>
                <p>Tu solicitud de soporte ha sido enviada exitosamente.</p>
                <hr style="border-color: #28a745;">
                <p class="mb-0"><strong>Número de ticket:</strong> #${ticketId}</p>
                <p class="mb-0">Recibirás una respuesta en tu email en las próximas 24-48 horas.</p>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', alertHTML);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            const alert = document.querySelector('.alert[style*="background-color: #1f4f1f"]');
            if (alert) alert.remove();
        }, 10000);
    }

    showErrorMessage(message) {
        const alertHTML = `
            <div class="alert alert-dismissible fade show position-fixed" role="alert"
                 style="top: 20px; right: 20px; z-index: 9999; max-width: 400px;
                        background-color: #4f1f1f; border: 1px solid #dc3545; color: #f8b8b8;">
                <h4 class="alert-heading" style="color: #dc3545;">
                    <i class="bi bi-exclamation-triangle-fill"></i> Error
                </h4>
                <p class="mb-0">${message}</p>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', alertHTML);
        
        // Auto-remover después de 8 segundos
        setTimeout(() => {
            const alert = document.querySelector('.alert[style*="background-color: #4f1f1f"]');
            if (alert) alert.remove();
        }, 8000);
    }

    resetForm() {
        document.getElementById('supportForm').reset();
        this.fillBrowserInfo();
        this.fillUserInfo();
    }

    closeModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('supportModal'));
        if (modal) modal.hide();
    }
}

// Inicializar el sistema de soporte cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SupportSystem();
});

// Exportar para uso como módulo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupportSystem;
}
