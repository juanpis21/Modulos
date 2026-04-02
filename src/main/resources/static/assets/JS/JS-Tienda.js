// ===== FUNCIONALIDAD DE MODO OSCURO/CLARO =====
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

// Verificar si hay un tema guardado
const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
themeToggle.checked = savedTheme === "dark";

// Event listener para cambiar el tema
themeToggle.addEventListener("change", function() {
	if (this.checked) {
		htmlElement.setAttribute("data-theme", "dark");
		localStorage.setItem("theme", "dark");
	} else {
		htmlElement.setAttribute("data-theme", "light");
		localStorage.setItem("theme", "light");
	}
});

// Funcionalidad del carrusel
let currentSlide = 0;
let slideInterval;

function initCarousel() {
	const slides = document.querySelectorAll(".carousel-slide");
	const indicators = document.querySelectorAll(".indicator");

	slides.forEach((slide, index) => {
		slide.classList.toggle("active", index === currentSlide);
	});

	indicators.forEach((indicator, index) => {
		indicator.classList.toggle("active", index === currentSlide);
	});

	startAutoSlide();
}

function nextSlide() {
	const slides = document.querySelectorAll(".carousel-slide");
	const indicators = document.querySelectorAll(".indicator");

	currentSlide = (currentSlide + 1) % slides.length;

	slides.forEach((slide, index) => {
		slide.classList.toggle("active", index === currentSlide);
	});

	indicators.forEach((indicator, index) => {
		indicator.classList.toggle("active", index === currentSlide);
	});

	resetAutoSlide();
}

function prevSlide() {
	const slides = document.querySelectorAll(".carousel-slide");
	const indicators = document.querySelectorAll(".indicator");

	currentSlide = (currentSlide - 1 + slides.length) % slides.length;

	slides.forEach((slide, index) => {
		slide.classList.toggle("active", index === currentSlide);
	});

	indicators.forEach((indicator, index) => {
		indicator.classList.toggle("active", index === currentSlide);
	});

	resetAutoSlide();
}

function goToSlide(slideIndex) {
	currentSlide = slideIndex;
	initCarousel();
	resetAutoSlide();
}

function startAutoSlide() {
	slideInterval = setInterval(nextSlide, 3000);
}

function resetAutoSlide() {
	clearInterval(slideInterval);
	startAutoSlide();
}

function pauseCarousel() {
	clearInterval(slideInterval);
}

function resumeCarousel() {
	startAutoSlide();
}

// ===== PRODUCTOS DE LA TIENDA (CARGADOS DESDE BD) =====
let allProducts = []; // Se cargarán desde la base de datos

let cart = [];

// Función para formatear precios en pesos colombianos (COP)
function formatearPrecioCOP(precio) {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(precio);
}
let currentFilter = { category: "all", pet: "all", sort: "featured" };

// Funciones de renderizado
function createProductCard(product) {
	// Generar estrellas (rating por defecto 5 si no viene de BD)
	const rating = product.rating || 5;
	const stars = '<i class="fas fa-star star"></i>'.repeat(rating);
	
	// Badge de disponibilidad
	const badge = product.cantidadDisponible > 0
		? `<div class="product-badge">✅ Disponible (${product.cantidadDisponible})</div>`
		: '<div class="product-badge" style="background: #ff6b6b;">❌ Agotado</div>';

	// Categoría en español
	const categoriaES = getCategoryNameES(product.categoria);

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

	return `
        <div class="product-card" data-category="${product.categoria}">
            ${badge}
            <div class="product-image">
                <img src="${getImageSrc(product.imagen)}" alt="${product.nombre}" onerror="this.src='/img/default.png'">
            </div>
            <div class="product-info">
                <div class="product-category">${categoriaES}</div>
                <h3 class="product-name">${product.nombre}</h3>
                <div class="product-rating">${stars}</div>
                <p class="product-description">${product.descripcion}</p>
                <div class="product-bottom">
                    <div class="product-price">${formatearPrecioCOP(product.precio)}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.cantidadDisponible <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> ${product.cantidadDisponible > 0 ? 'Añadir' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para traducir categorías al español
function getCategoryNameES(categoria) {
	if (!categoria) return "Producto";
	
	const categorias = {
		'food': 'Alimento',
		'alimento': 'Alimento',
		'accessories': 'Accesorio',
		'accesorio': 'Accesorio',
		'medicine': 'Medicamento',
		'medicamento': 'Medicamento',
		'juguete': 'Juguete',
		'higiene': 'Higiene'
	};
	
	return categorias[categoria.toLowerCase()] || categoria;
}

function getAllProducts() {
	return allProducts; // Retorna productos cargados desde BD
}

function renderProducts() {
	const productos = getAllProducts();
	
	// Productos destacados (primeros 6 productos disponibles)
	const featured = productos.filter(p => p.cantidadDisponible > 0).slice(0, 6);

	// Productos destacados
	if (featured.length > 0) {
		document.getElementById("featuredProducts").innerHTML = featured
			.map(createProductCard)
			.join("");
	} else {
		document.getElementById("featuredProducts").innerHTML = `
			<div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
				<i class="fas fa-box-open" style="font-size: 3rem; opacity: 0.3; margin-bottom: 15px;"></i>
				<h3 style="color: var(--text-color);">No hay productos destacados</h3>
			</div>
		`;
	}

	// Todos los productos (filtrados)
	let filtered = filterProducts(productos);

	// Si no hay productos filtrados, mostrar mensaje
	if (filtered.length === 0) {
		document.getElementById("allProducts").innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;">
                    <i class="fas fa-search"></i>
                </div>
                <h3 style="color: var(--text-color); margin-bottom: 10px;">No se encontraron productos</h3>
                <p style="color: var(--text-secondary);">Intenta con otros filtros o categorías</p>
            </div>
        `;
	} else {
		document.getElementById("allProducts").innerHTML = filtered
			.map(createProductCard)
			.join("");
	}
}

function filterProducts(products) {
	let filtered = products;

	// Filtro de categoría
	if (currentFilter.category !== "all") {
		filtered = filtered.filter(
			(p) => p.categoria && p.categoria.toLowerCase() === currentFilter.category.toLowerCase()
		);
	}

	// Ordenamiento
	if (currentFilter.sort === "price-low") {
		filtered.sort((a, b) => a.precio - b.precio);
	} else if (currentFilter.sort === "price-high") {
		filtered.sort((a, b) => b.precio - a.precio);
	} else if (currentFilter.sort === "name") {
		filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
	} else if (currentFilter.sort === "featured") {
		// Ordenar por cantidad disponible (más stock primero)
		filtered.sort((a, b) => b.cantidadDisponible - a.cantidadDisponible);
	}

	return filtered;
}

// Carrito
function addToCart(productId) {
	const product = getAllProducts().find((p) => p.id === productId);
	if (!product) return;

	// Verificar si hay stock disponible
	if (product.cantidadDisponible <= 0) {
		showToast('❌ Producto agotado', 'error');
		return;
	}

	const existing = cart.find((item) => item.id === productId);
	if (existing) {
		// Verificar si al añadir una unidad más se excede el stock
		if (existing.quantity + 1 > product.cantidadDisponible) {
			showToast(`⚠️ No puedes añadir más de ${product.cantidadDisponible} unidades`, 'warning');
			return;
		}
		existing.quantity++;
	} else {
		cart.push({ ...product, quantity: 1 });
	}

	updateCart();
}

function removeFromCart(productId) {
	cart = cart.filter((item) => item.id !== productId);
	updateCart();
}

function updateQuantity(productId, change) {
	const item = cart.find((i) => i.id === productId);
	if (!item) return;

	// Obtener el producto actual para verificar stock
	const product = getAllProducts().find((p) => p.id === productId);
	if (!product) return;

	// Calcular nueva cantidad
	const newQuantity = item.quantity + change;

	// Validar que no exceda el stock disponible
	if (newQuantity > product.cantidadDisponible) {
		showToast(`⚠️ No puedes superar el límite de ${product.cantidadDisponible} unidades`, 'warning');
		return;
	}

	item.quantity = newQuantity;
	if (item.quantity <= 0) {
		removeFromCart(productId);
	} else {
		updateCart();
	}
}

// Función para mostrar notificaciones toast
function showToast(message, type = 'info') {
	// Crear el toast si no existe
	let toast = document.getElementById('toast');
	if (!toast) {
		toast = document.createElement('div');
		toast.id = 'toast';
		toast.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			padding: 15px 20px;
			border-radius: 8px;
			color: white;
			font-weight: 500;
			z-index: 10000;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		`;
		document.body.appendChild(toast);
	}

	// Establecer mensaje y estilo según tipo
	toast.textContent = message;
	
	switch(type) {
		case 'success':
			toast.style.background = '#28a745';
			break;
		case 'error':
			toast.style.background = '#dc3545';
			break;
		case 'warning':
			toast.style.background = '#ffc107';
			toast.style.color = '#212529';
			break;
		default:
			toast.style.background = '#17a2b8';
	}

	// Mostrar toast
	toast.style.opacity = '1';
	toast.style.transform = 'translateX(0)';

	// Ocultar después de 3 segundos
	setTimeout(() => {
		toast.style.opacity = '0';
		toast.style.transform = 'translateX(100%)';
	}, 3000);
}

function updateCart() {
	const badge = document.getElementById("cartBadge");
	const itemsContainer = document.getElementById("cartItems");
	const subtotalEl = document.getElementById("subtotal");
	const totalEl = document.getElementById("total");

	// Actualizar badge
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	badge.textContent = totalItems;

	// Función para construir ruta de imagen (misma que en createProductCard)
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

	// Renderizar items
	if (cart.length === 0) {
		itemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Tu carrito está vacío</p>
                <p style="font-size: 0.9rem; color: #999;">¡Agrega productos para empezar!</p>
            </div>
        `;
	} else {
		itemsContainer.innerHTML = cart
			.map(
				(item) => {
					const product = getAllProducts().find((p) => p.id === item.id);
					const maxStock = product ? product.cantidadDisponible : item.quantity;
					const isAtLimit = item.quantity >= maxStock;
					
					return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${getImageSrc(item.imagen)}" alt="${item.nombre}" onerror="this.src='/img/default.png'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nombre}</div>
                    <div class="cart-item-price">${formatearPrecioCOP(item.precio)}</div>
                    <div class="cart-item-stock-info">
                        <small style="color: #666;">Stock disponible: ${maxStock} unidades</small>
						${isAtLimit ? '<small style="color: #ffc107; font-weight: bold;"> (¡Límite alcanzado!)</small>' : ''}
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" ${isAtLimit ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
				}
			)
			.join("");
	}

	// Actualizar totales
	const subtotal = cart.reduce(
		(sum, item) => sum + item.precio * item.quantity,
		0
	);
	subtotalEl.textContent = formatearPrecioCOP(subtotal);
	totalEl.textContent = formatearPrecioCOP(subtotal);
}

// ===== NOTIFICACIONES - Usando sistema compartido desde notifications.js =====

// ===== DATOS DE TIENDAS =====
let stores = [];
let selectedStore = null;

// ===== FUNCIONES DE TIENDAS =====
async function loadStores() {
	try {
		const response = await fetch('/usuarios/api/veterinarias');
		if (!response.ok) {
			throw new Error('Error al cargar las tiendas');
		}
		stores = await response.json();
		console.log('✅ Tiendas cargadas:', stores);
		renderStores();
	} catch (error) {
		console.error('❌ Error al cargar tiendas:', error);
		// Mostrar mensaje de error al usuario
		const storesGrid = document.getElementById('storesGrid');
		storesGrid.innerHTML = `
			<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
				<i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 20px;"></i>
				<h3 style="color: var(--text-color); margin-bottom: 10px;">Error al cargar las tiendas</h3>
				<p style="color: var(--text-secondary);">Por favor, intenta recargar la página</p>
				<button onclick="loadStores()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
					<i class="fas fa-redo"></i> Reintentar
				</button>
			</div>
		`;
	}
}

function renderStores() {
	const storesGrid = document.getElementById('storesGrid');
	
	if (!stores || stores.length === 0) {
		storesGrid.innerHTML = `
			<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
				<i class="fas fa-store-slash" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
				<h3 style="color: var(--text-color);">No hay tiendas disponibles</h3>
				<p style="color: var(--text-secondary);">Por favor, contacta al administrador</p>
			</div>
		`;
		return;
	}
	
	storesGrid.innerHTML = stores.map(store => {
		// Determinar si es destacada (puedes usar el campo 'estado' o agregar lógica personalizada)
		const isFeatured = store.estado === 'Activo' || store.estado === 'activo';
		
		return `
			<div class="store-card" onclick="selectStore(${store.id})">
				${isFeatured ? '<div class="store-badge">⭐ Disponible</div>' : ''}
				<div class="store-card-image">
					<i class="fas fa-store-alt"></i>
				</div>
				<div class="store-card-content">
					<h3 class="store-card-name">${store.nombre || 'Tienda'}</h3>
					<div class="store-card-info">
						<div class="store-info-item">
							<i class="fas fa-map-marker-alt"></i>
							<span>${store.direccion || 'Dirección no disponible'}</span>
						</div>
						<div class="store-info-item">
							<i class="fas fa-phone"></i>
							<span>${store.telefono || 'Teléfono no disponible'}</span>
						</div>
						<div class="store-info-item">
							<i class="fas fa-clock"></i>
							<span>${store.horario || 'Horario no disponible'}</span>
						</div>
					</div>
					<button class="store-card-button">
						<i class="fas fa-shopping-bag"></i>
						Ver Productos
					</button>
				</div>
			</div>
		`;
	}).join('');
}

async function selectStore(storeId) {
	selectedStore = stores.find(s => s.id === storeId);
	
	console.log(`🏪 Tienda seleccionada: ${selectedStore.nombre || selectedStore.name} (ID: ${storeId})`);
	
	// Cargar productos de la veterinaria seleccionada
	const productosLoaded = await loadProductsFromStore(storeId);
	
	if (!productosLoaded) {
		showError('No se pudieron cargar los productos de esta tienda. Por favor, intenta de nuevo.');
		return;
	}
	
	// Ocultar selección de tiendas
	document.getElementById('storeSelection').style.display = 'none';
	
	// Mostrar botón de volver
	document.getElementById('btnBackToStores').style.display = 'flex';
	
	// Mostrar secciones de productos
	document.getElementById('inicio').style.display = 'flex';
	document.getElementById('benefitsSection').style.display = 'block';
	document.getElementById('filtersSection').style.display = 'block';
	document.getElementById('featuredSection').style.display = 'block';
	document.getElementById('allProductsSection').style.display = 'block';
	
	// Inicializar carrusel
	initCarousel();
	
	// Renderizar productos
	renderProducts();
	
	// Scroll suave al inicio
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CARGAR PRODUCTOS DE UNA VETERINARIA =====
async function loadProductsFromStore(veterinariaId) {
	try {
		console.log(`🔍 Cargando productos de veterinaria ID: ${veterinariaId}`);
		
		const response = await fetch(`/usuarios/api/veterinarias/${veterinariaId}/productos`);
		
		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}
		
		allProducts = await response.json();
		
		console.log(`✅ Productos cargados: ${allProducts.length}`);
		console.log('Productos:', allProducts);
		
		if (allProducts.length === 0) {
			console.warn('⚠️ Esta veterinaria no tiene productos en inventario');
		}
		
		return true;
		
	} catch (error) {
		console.error('❌ Error al cargar productos:', error);
		allProducts = [];
		return false;
	}
}

// Función para volver a la selección de tiendas
function backToStoreSelection() {
	// Ocultar botón de volver
	document.getElementById('btnBackToStores').style.display = 'none';
	
	// Ocultar secciones de productos
	document.getElementById('inicio').style.display = 'none';
	document.getElementById('benefitsSection').style.display = 'none';
	document.getElementById('filtersSection').style.display = 'none';
	document.getElementById('featuredSection').style.display = 'none';
	document.getElementById('allProductsSection').style.display = 'none';
	
	// Mostrar selección de tiendas
	document.getElementById('storeSelection').style.display = 'block';
	
	// Limpiar tienda seleccionada y productos
	selectedStore = null;
	allProducts = [];
	
	// Scroll suave al inicio
	window.scrollTo({ top: 0, behavior: 'smooth' });
	
	console.log('🔙 Volviendo a la selección de tiendas');
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	// Cargar tiendas desde la base de datos
	loadStores();

	// Carrito
	document.getElementById("openCart").addEventListener("click", () => {
		document.getElementById("cartSidebar").classList.add("active");
		document.getElementById("cartOverlay").classList.add("active");
	});

	document
		.getElementById("closeCart")
		.addEventListener("click", closeCartSidebar);
	document
		.getElementById("cartOverlay")
		.addEventListener("click", closeCartSidebar);

	function closeCartSidebar() {
		document.getElementById("cartSidebar").classList.remove("active");
		document.getElementById("cartOverlay").classList.remove("active");
	}

	// Checkout
	document.getElementById("checkoutBtn").addEventListener("click", () => {
		if (cart.length === 0) {
			showCheckoutNotification("Tu carrito está vacío", "warning");
			return;
		}
		
		// Guardar carrito en localStorage para la pasarela de pagos
		localStorage.setItem('checkoutCart', JSON.stringify(cart));
		
		// Redirigir a la pasarela de pagos
		window.location.href = '/usuarios/pasarela-pagos';
	});

	// ===== FUNCIONALIDAD DEL BOTÓN DE FILTRAR (SIN ALERTAS) =====
	document.getElementById("filtrar").addEventListener("click", () => {
		// Obtener valores de los filtros
		const categoryValue = document.getElementById("categoryFilter").value;
		const sortValue = document.getElementById("sortFilter").value;

		// Actualizar el objeto de filtros
		currentFilter.category = categoryValue;
		currentFilter.sort = sortValue;

		// Renderizar productos con los nuevos filtros
		renderProducts();

		// Scroll suave a la sección de productos
		document.getElementById("allProducts").scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	});

	// Filtros en tiempo real (opcional - ya los tenías pero mejoro la integración)
	document.getElementById("categoryFilter").addEventListener("change", (e) => {
		currentFilter.category = e.target.value;
		// No renderizamos aquí, esperamos al botón
	});

	document.getElementById("sortFilter").addEventListener("change", (e) => {
		currentFilter.sort = e.target.value;
		// No renderizamos aquí, esperamos al botón
	});

	// Filtros de mascota (si los tienes en el HTML)
	document.querySelectorAll(".filter-pill").forEach((pill) => {
		pill.addEventListener("click", function() {
			document
				.querySelectorAll(".filter-pill")
				.forEach((p) => p.classList.remove("active"));
			this.classList.add("active");
			currentFilter.pet = this.dataset.pet;
			renderProducts();
		});
	});

	// Menú hamburguesa
	const hamburgerBtn = document.querySelector(".hamburger-btn");
	const menuContent = document.querySelector(".menu-content");

	hamburgerBtn.addEventListener("click", () => {
		menuContent.classList.toggle("active");
	});

	document.addEventListener("click", (e) => {
		if (!menuContent.contains(e.target) && !hamburgerBtn.contains(e.target)) {
			menuContent.classList.remove("active");
		}
	});

	// Funcionalidad del calendario
	const calendarButton = document.getElementById("calendarButton");
	const calendarPopup = document.getElementById("calendarPopup");

	if (calendarButton && calendarPopup) {
		calendarButton.addEventListener("click", (e) => {
			e.stopPropagation();
			calendarPopup.classList.toggle("active");
		});

		document.addEventListener("click", (e) => {
			if (
				!calendarPopup.contains(e.target) &&
				!calendarButton.contains(e.target)
			) {
				calendarPopup.classList.remove("active");
			}
		});
	}

	// Modal emergencias
	const btnEmergencias = document.getElementById("emergencias");
	const modalEmergencias = document.getElementById("modalemergencias");

	if (btnEmergencias && modalEmergencias) {
		btnEmergencias.addEventListener("click", () => {
			modalEmergencias.style.display = "block";
		});
	}
});

// Función para cerrar modal de emergencias
function cerrarModal() {
	document.getElementById("modalemergencias").style.display = "none";
}

// Funciones de redirección para emergencias
function redirigirVideollamada() {
	showInfo("Redirigiendo a videollamada...", 2000);
	// window.location.href = 'tu-url-videollamada';
}

function redirigirWhatsApp() {
	window.open("https://wa.me/1234567890", "_blank");
}

function redirigirWhatsApp2() {
	window.open(
		"https://wa.me/1234567890?text=Necesito%20primeros%20auxilios",
		"_blank"
	);
}
