/**
 * Sistema de Notificaciones Personalizadas - HelpYourPet
 * Reemplaza todas las alertas() con notificaciones modernas y profesionales
 */

// ===== SISTEMA DE NOTIFICACIONES PERSONALIZADAS =====
function showNotification(message, type = 'info', duration = 4000) {
    // Crear contenedor de notificaciones si no existe
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Determinar icono según tipo
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icons[type] || icons.info}"></i>
        </div>
        <div class="notification-content">${message}</div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Agregar al contenedor
    container.appendChild(notification);

    // Función para cerrar notificación
    const closeNotification = () => {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };

    // Evento para cerrar con botón
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', closeNotification);

    // Auto-eliminar
    if (duration > 0) {
        setTimeout(closeNotification, duration);
    }

    return notification;
}

// Funciones de conveniencia para diferentes tipos
function showSuccess(message, duration) {
    return showNotification(message, 'success', duration);
}

function showError(message, duration) {
    return showNotification(message, 'error', duration);
}

function showWarning(message, duration) {
    return showNotification(message, 'warning', duration);
}

function showInfo(message, duration) {
    return showNotification(message, 'info', duration);
}

// Exportar para uso en otros módulos (si needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
}

// Disponibilidad global
window.HelpYourPetNotifications = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
};
