// ===== VARIABLES GLOBALES =====
let currentPaymentMethod = 'card';
let cartItems = [];
let subtotal = 0;
let shippingCost = 5000;
let discount = 0;

// Función para formatear precios en pesos colombianos (COP)
function formatearPrecioCOP(precio) {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(precio);
}

// ===== FUNCIONALIDAD DE MODO OSCURO/CLARO =====
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

// Verificar si hay un tema guardado
const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
if (themeToggle) {
    themeToggle.checked = savedTheme === "dark";
}

// Event listener para cambiar el tema
if (themeToggle) {
    themeToggle.addEventListener("change", function() {
        if (this.checked) {
            htmlElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    });
}

// ===== CARGAR DATOS DEL CARRITO =====
document.addEventListener('DOMContentLoaded', () => {
    loadCartData();
    formatCardNumber();
    formatExpiryDate();
    formatCVV();
    formatPhoneNumber();
});

function loadCartData() {
    // Obtener datos del carrito desde localStorage
    const cartData = localStorage.getItem('checkoutCart');
    
    if (cartData) {
        cartItems = JSON.parse(cartData);
        renderOrderItems();
        calculateTotals();
    } else {
        // Si no hay datos, mostrar mensaje
        document.getElementById('orderItems').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6C757D;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; opacity: 0.3;"></i>
                <p style="margin-top: 1rem;">No hay productos en el carrito</p>
            </div>
        `;
    }
}

// Función para construir ruta de imagen
const getImageSrc = (imagen) => {
    if (!imagen) return '/img/default.png';
    
    // Si la imagen ya empieza con /uploads/ o /img/, usarla directamente
    if (imagen.startsWith('/uploads/') || imagen.startsWith('/img/')) {
        return imagen;
    }
    
    // Si contiene un punto (extensión de archivo), asumir que es un archivo subido
    if (imagen.includes('.')) {
        return `/uploads/${imagen}`;
    }
    
    // Si no, es una imagen estática
    return `/img/${imagen}.png`;
};

function renderOrderItems() {
    const container = document.getElementById('orderItems');
    
    container.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <img src="${getImageSrc(item.imagen)}" alt="${item.nombre}" class="item-image" onerror="this.src='/img/default.png'">
            <div class="item-details">
                <div class="item-name">${item.nombre}</div>
                <div class="item-quantity">Cantidad: ${item.quantity}</div>
            </div>
            <div class="item-price">${formatearPrecioCOP(item.precio * item.quantity)}</div>
        </div>
    `).join('');
}

function calculateTotals() {
    subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const total = subtotal + shippingCost - discount;
    
    document.getElementById('summarySubtotal').textContent = formatearPrecioCOP(subtotal);
    document.getElementById('finalTotal').textContent = formatearPrecioCOP(total);
}

// ===== MÉTODOS DE PAGO =====
function selectPaymentMethod(method) {
    currentPaymentMethod = method;
    
    // Actualizar botones
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');
    
    // Mostrar formulario correspondiente
    document.querySelectorAll('.payment-method-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${method}Form`).classList.add('active');
}

// ===== CÓDIGO PROMOCIONAL =====
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const code = promoInput.value.trim().toUpperCase();
    
    const promoCodes = {
        'HELPPET10': 0.10,  // 10% descuento
        'PRIMERA15': 0.15,  // 15% descuento
        'VIP20': 0.20       // 20% descuento
    };
    
    if (promoCodes[code]) {
        discount = subtotal * promoCodes[code];
        
        // Mostrar descuento
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-${formatearPrecioCOP(discount)}`;
        
        // Recalcular total
        calculateTotals();
        
        // Mensaje de éxito
        showNotification('¡Código aplicado correctamente!', 'success');
        promoInput.value = '';
    } else if (code === '') {
        showNotification('Por favor ingresa un código', 'warning');
    } else {
        showNotification('Código inválido', 'error');
    }
}

// ===== FORMATEO DE CAMPOS =====
function formatCardNumber() {
    const input = document.getElementById('cardNumber');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

function formatExpiryDate() {
    const input = document.getElementById('expiryDate');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

function formatCVV() {
    const input = document.getElementById('cvv');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

function formatPhoneNumber() {
    const phoneInputs = document.querySelectorAll('#phoneNumber, #phone');
    
    phoneInputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3 && value.length <= 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            } else if (value.length > 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
            }
            e.target.value = value;
        });
    });
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function validateCardForm() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        showNotification('Número de tarjeta inválido', 'error');
        return false;
    }
    
    if (cardName.length < 3) {
        showNotification('Nombre en la tarjeta inválido', 'error');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showNotification('Fecha de vencimiento inválida', 'error');
        return false;
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
        showNotification('CVV inválido', 'error');
        return false;
    }
    
    return true;
}

function validatePSEForm() {
    const bank = document.getElementById('bankSelect').value;
    const personType = document.getElementById('personType').value;
    const documentNumber = document.getElementById('documentNumber').value;
    
    if (!bank) {
        showNotification('Selecciona un banco', 'error');
        return false;
    }
    
    if (!personType) {
        showNotification('Selecciona el tipo de persona', 'error');
        return false;
    }
    
    if (documentNumber.length < 6) {
        showNotification('Número de documento inválido', 'error');
        return false;
    }
    
    return true;
}

function validateNequiForm() {
    const phoneNumber = document.getElementById('phoneNumber').value.replace(/\s/g, '');
    
    if (phoneNumber.length !== 10) {
        showNotification('Número de celular inválido', 'error');
        return false;
    }
    
    return true;
}

function validateShippingInfo() {
    const fullName = document.getElementById('fullName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const phone = document.getElementById('phone').value.replace(/\s/g, '');
    
    if (fullName.length < 3) {
        showNotification('Nombre completo inválido', 'error');
        return false;
    }
    
    if (address.length < 5) {
        showNotification('Dirección inválida', 'error');
        return false;
    }
    
    if (city.length < 3) {
        showNotification('Ciudad inválida', 'error');
        return false;
    }
    
    if (phone.length !== 10) {
        showNotification('Teléfono inválido', 'error');
        return false;
    }
    
    return true;
}

// ===== PROCESAR PAGO =====
function processPayment() {
    // Validar información de envío
    if (!validateShippingInfo()) {
        return;
    }
    
    // Validar método de pago
    let isValid = false;
    
    switch (currentPaymentMethod) {
        case 'card':
            isValid = validateCardForm();
            break;
        case 'pse':
            isValid = validatePSEForm();
            break;
        case 'nequi':
            isValid = validateNequiForm();
            break;
    }
    
    if (!isValid) {
        return;
    }
    
    // Mostrar modal de procesamiento
    document.getElementById('processingModal').classList.add('active');
    
    // Generar número de orden
    const orderNumber = '#' + Math.floor(100000 + Math.random() * 900000);
    
    // Preparar datos de la venta
    const ventaData = {
        items: cartItems,
        subtotal: subtotal,
        total: subtotal + shippingCost - discount,
        metodoPago: getMetodoPagoTexto(currentPaymentMethod),
        numeroOrden: orderNumber
    };
    
    // Enviar venta al backend
    fetch('/usuarios/api/ventas/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al registrar la venta');
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Venta registrada:', data);
        
        // Ocultar modal de procesamiento
        document.getElementById('processingModal').classList.remove('active');
        
        // Mostrar número de orden
        document.getElementById('orderNumber').textContent = orderNumber;
        
        // Mostrar modal de confirmación
        document.getElementById('confirmationModal').classList.add('active');
        
        // Limpiar carrito
        localStorage.removeItem('checkoutCart');
    })
    .catch(error => {
        console.error('❌ Error al registrar venta:', error);
        document.getElementById('processingModal').classList.remove('active');
        showNotification('Error al procesar el pago. Por favor intenta de nuevo.', 'error');
    });
}

// Función auxiliar para obtener texto del método de pago
function getMetodoPagoTexto(metodo) {
    const metodos = {
        'card': 'Tarjeta de Crédito/Débito',
        'pse': 'PSE',
        'nequi': 'Nequi'
    };
    return metodos[metodo] || 'Otro';
}

// ===== CANCELAR PAGO =====
function cancelPayment() {
    if (confirm('¿Estás seguro de que deseas cancelar el pago?')) {
        window.history.back();
    }
}

// ===== VOLVER A LA TIENDA =====
function returnToStore() {
    window.location.href = '/usuarios/tienda';
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconByType(type)}"></i>
        <span>${message}</span>
    `;
    
    // Estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getColorByType(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Fredoka', sans-serif;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getIconByType(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getColorByType(type) {
    const colors = {
        'success': '#51CF66',
        'error': '#FF6B6B',
        'warning': '#FFD93D',
        'info': '#018099'
    };
    return colors[type] || '#018099';
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
