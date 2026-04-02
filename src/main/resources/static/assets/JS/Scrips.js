/*Scrips Home*/

// Toggle del menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const calendarButton = document.getElementById('calendarButton');
    const calendarPopup = document.getElementById('calendarPopup');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    const agendarCitaBtn = document.getElementById('agendarCitaBtn');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.getElementById('calendarDays');

    // Validación de elementos
    if (!calendarButton || !calendarPopup || !prevMonthBtn || !nextMonthBtn || 
        !todayBtn || !agendarCitaBtn || !currentMonthYear || !calendarDays) {
        console.error('Error: Uno o más elementos del calendario no encontrados');
        return;
    }

    // Variables de estado
    let currentDate = new Date();
    let selectedDate = new Date();

    // Evento para mostrar/ocultar calendario
    calendarButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        calendarPopup.classList.toggle('show');
        if (calendarPopup.classList.contains('show')) {
            renderCalendar();
        }
    });

    // Cerrar calendario al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!calendarPopup.contains(e.target) && !calendarButton.contains(e.target)) {
            calendarPopup.classList.remove('show');
        }
    });

    // Prevenir cierre al hacer clic dentro del popup
    calendarPopup.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Navegación entre meses
    prevMonthBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Botón "Hoy"
    todayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
    });

    // Botón "Agendar Cita"
    agendarCitaBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const phoneNumber = "573204767864"; // Reemplaza con tu número
        const formattedDate = selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const message = `¡Hola! Quiero agendar una cita para el ${formattedDate}.`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Función para renderizar el calendario
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Actualizar mes y año en el header
        currentMonthYear.textContent = firstDay.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        // Limpiar días anteriores
        calendarDays.innerHTML = '';

        // Días del mes anterior (relleno)
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = 0; i < startingDay; i++) {
            calendarDays.appendChild(createDayElement(
                prevMonthDays - startingDay + i + 1,
                true
            ));
        }

        // Días del mes actual
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = createDayElement(i, false);
            
            // Marcar día actual
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('current-day');
            }
            
            // Marcar día seleccionado
            if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayElement.classList.add('selected-day');
            }
            
            calendarDays.appendChild(dayElement);
        }

        // Días del siguiente mes (relleno)
        const totalCells = startingDay + daysInMonth;
        const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
        
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.appendChild(createDayElement(i, true));
        }
    }

    // Función auxiliar para crear elementos de día
    function createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day' + (isOtherMonth ? ' other-month' : '');
        dayElement.textContent = day;
        
        if (!isOtherMonth) {
            dayElement.addEventListener('click', function(e) {
                e.stopPropagation();
                selectedDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                );
                renderCalendar();
            });
        }
        
        return dayElement;
    }

    // Inicializar calendario
    renderCalendar();
});
/*Fin Scrips Home*/



// Base de datos de productos
const products = {
    food: [
        {
            id: 1,
            name: "Alimento Premium para Perros",
            description: "Alimento balanceado para perros adultos de todas las razas. Con proteínas de alta calidad.",
            price: 24.99,
            image: "concentrado"
        },
        {
            id: 2,
            name: "Alimento para Gatos Sensibles",
            description: "Fórmula especial para gatos con estómagos sensibles. Sin granos ni colorantes artificiales.",
            price: 19.99,
            image: "comidaparagato"
        },
        {
            id: 3,
            name: "Snacks para Perros",
            description: "Deliciosos snacks para perro, bajos en calorías y con vitaminas esenciales.",
            price: 9.99,
            image: "snackperro"
        },
        {
            id: 4,
            name: "Alimento para Aves",
            description: "Mezcla de semillas y granos para aves domésticas. Rico en nutrientes esenciales.",
            price: 8.49,
            image: "pajaros"
        }
    ],
    accessories: [
        {
            id: 5,
            name: "Collar Ajustable",
            description: "Collar de nylon resistente con hebilla de seguridad y ajuste personalizado.",
            price: 12.99,
            image: "collar"
        },
        {
            id: 6,
            name: "Juguete para Gatos",
            description: "Varita con plumas para estimular el instinto de caza de tu gato. Ideal para juego interactivo.",
            price: 7.99,
            image: "juguetegato"
        },
        {
            id: 7,
            name: "Cama para Mascotas",
            description: "Cama suave y cómoda con base antideslizante. Disponible en varios tamaños.",
            price: 29.99,
            image: "camaperro"
        },
        {
            id: 8,
            name: "Arnés Paseo Seguro",
            description: "Arnés ergonómico con correa incluida para paseos cómodos y seguros.",
            price: 18.50,
            image: "arnes"
        }
    ],
    medicine: [
        {
            id: 9,
            name: "Antiparasitario",
            description: "Tabletas antiparasitarias para perros y gatos. Protege contra parásitos internos.",
            price: 14.95,
            image: "antiparasitario"
        },
        {
            id: 10,
            name: "Shampoo Medicado",
            description: "Shampoo para mascotas con problemas dermatológicos. Calma la piel irritada.",
            price: 11.25,
            image: "shampoo"
        },
        {
            id: 11,
            name: "Suplemento Articular",
            description: "Suplemento con glucosamina para la salud articular de perros y gatos.",
            price: 22.75,
            image: "suplemento"
        },
        {
            id: 12,
            name: "Gotas para Oídos",
            description: "Solución limpiadora para prevenir infecciones y mantener los oídos saludables.",
            price: 9.99,
            image: "gotas"
        }
    ]
};

// Carrito de compras
let cart = [];

// Elementos del DOM
const foodProductsContainer = document.getElementById('foodProducts');
const accessoryProductsContainer = document.getElementById('accessoryProducts');
const medicineProductsContainer = document.getElementById('medicineProducts');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElement = document.querySelector('.cart-count');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const checkoutButton = document.querySelector('.checkout-btn');

// Renderizar productos
function renderProducts() {
    // Alimentos
    products.food.forEach(product => {
        foodProductsContainer.innerHTML += createProductCard(product, 'food');
    });

    // Accesorios
    products.accessories.forEach(product => {
        accessoryProductsContainer.innerHTML += createProductCard(product, 'accessories');
    });

    // Medicamentos
    products.medicine.forEach(product => {
        medicineProductsContainer.innerHTML += createProductCard(product, 'medicine');
    });

    // Añadir eventos a los botones
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Crear tarjeta de producto
function createProductCard(product, category) {
    let categoryName = '';
    switch (category) {
        case 'food':
            categoryName = 'Alimento';
            break;
        case 'accessories':
            categoryName = 'Accesorio';
            break;
        case 'medicine':
            categoryName = 'Medicamento';
            break;
    }

    return `
                <div class="product-card">
        <div class="product-image">
    <img src="img/${product.image}.png" alt="${product.name}" class="product-img">
</div>
                    <div class="product-info">
                        <div class="product-category">${categoryName}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-bottom">
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <button class="add-to-cart" data-id="${product.id}" data-category="${category}">
                                <i class="fas fa-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            `;
}

// Añadir producto al carrito
function addToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const category = event.target.dataset.category;

    // Encontrar el producto
    let product;
    if (category === 'food') {
        product = products.food.find(p => p.id === productId);
    } else if (category === 'accessories') {
        product = products.accessories.find(p => p.id === productId);
    } else if (category === 'medicine') {
        product = products.medicine.find(p => p.id === productId);
    }

    if (!product) return;

    // Verificar si ya está en el carrito
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCart();

    // Animación de añadir al carrito
    const button = event.target;
    button.innerHTML = '<i class="fas fa-check"></i> Añadido';
    button.style.backgroundColor = '#4CAF';

    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir';
        button.style.backgroundColor = '#4CAF';
    }, 1500);
}

// Actualizar carrito
function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Actualizar lista de productos en el carrito
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Tu carrito está vacío</div>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            cartItemsContainer.innerHTML += createCartItem(item);
        });

        // Añadir eventos a los controles
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Actualizar resumen
    updateSummary();
}

// Crear elemento del carrito
function createCartItem(item) {
    return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="fas fa-${item.image}" style="font-size: 2rem; color: #81C784;"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
}

// Actualizar resumen del carrito
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.1; // 10% de descuento
    const total = subtotal - discount;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discount.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Disminuir cantidad
function decreaseQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCart();
    }
}

// Aumentar cantidad
function increaseQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

// Eliminar producto
function removeItem(event) {
    const productId = parseInt(event.target.closest('.remove-item').dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// ===== NOTIFICACIONES - Usando sistema compartido desde notifications.js =====

// Procesar pago
function checkout() {
    if (cart.length === 0) {
        showWarning('Tu carrito está vacío. Añade productos antes de pagar.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = total * 0.1;
    const finalTotal = total - discount;

    showSuccess(`¡Gracias por tu compra!\nTotal: $${finalTotal.toFixed(2)}\nTu pedido ha sido procesado.`, 5000);

    // Vaciar carrito
    cart = [];
    updateCart();
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Evento para botón de pago
    checkoutButton.addEventListener('click', checkout);

    // Evento para icono del carrito
    document.getElementById('cartIcon').addEventListener('click', () => {
        document.querySelector('.cart-container').scrollIntoView({ behavior: 'smooth' });
    });
});


// Toggle del menú hamburguesa
document.querySelector('.hamburger-btn').addEventListener('click', function () {
    document.querySelector('.menu-content').classList.toggle('active');
});

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', function (event) {
    const menu = document.querySelector('.menu-content');
    const btn = document.querySelector('.hamburger-btn');

    if (!menu.contains(event.target) && !btn.contains(event.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});


// Función de búsqueda
$('.search-btn').click(function (e) {
    e.preventDefault();
    var searchTerm = $('.search-input').val().toLowerCase();
    if (searchTerm.length > 0) {
        // Buscar en el contenido de la página
        var found = false;
        $('body').find('*').each(function () {
            var content = $(this).text().toLowerCase();
            if (content.indexOf(searchTerm) > -1) {
                found = true;
                // Scroll to the first match
                $('html, body').animate({
                    scrollTop: $(this).offset().top - 100
                }, 1000);
                return false; // break loop
            }
        });

        if (!found) {
            showInfo('No se encontraron resultados para: ' + searchTerm);
        }
    }
});

// Permitir buscar con Enter
$('.search-input').keypress(function (e) {
    if (e.which === 13) {
        $('.search-btn').click();
    }
});


