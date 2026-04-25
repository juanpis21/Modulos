// ===== FUNCIONALIDAD DE MODO OSCURO/CLARO =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
	htmlElement.setAttribute('data-theme', 'dark');
	themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
	if (this.checked) {
		htmlElement.setAttribute('data-theme', 'dark');
		localStorage.setItem('theme', 'dark');
	} else {
		htmlElement.setAttribute('data-theme', 'light');
		localStorage.setItem('theme', 'light');
	}
});

// ===== MENÚ HAMBURGUESA =====
document.querySelector('.hamburger-btn').addEventListener('click', function() {
	document.querySelector('.menu-content').classList.toggle('active');
});

document.addEventListener('click', function(event) {
	const menu = document.querySelector('.menu-content');
	const btn = document.querySelector('.hamburger-btn');
	if (!menu.contains(event.target) && !btn.contains(event.target) && menu.classList.contains('active')) {
		menu.classList.remove('active');
	}
});

// ===== MOSTRAR BOTÓN DE VOLVER AL INICIO =====
const btnInicio = document.querySelector('.btn-inicio');

window.addEventListener('scroll', function() {
	if (window.scrollY > 300) {
		btnInicio.style.display = 'flex';
	} else {
		btnInicio.style.display = 'none';
	}
});

// Ocultar al cargar la página
btnInicio.style.display = 'none';

// ==================
// MODAL DE PUBLICAR
// ==================
document.addEventListener('DOMContentLoaded', function() {
	const btnDarAdopcion = document.getElementById('btnDarAdopcion');
	const modalAdopcion = document.getElementById('modalAdopcion');
	const closeModal = document.getElementById('closeModal');
	const archivoImagen = document.getElementById('archivoImagen');
	const fileName = document.getElementById('fileName');

	// Abrir modal
	if (btnDarAdopcion) {
		btnDarAdopcion.addEventListener('click', function() {
			modalAdopcion.classList.add('active');
		});
	}

	// Cerrar modal
	if (closeModal) {
		closeModal.addEventListener('click', function() {
			modalAdopcion.classList.remove('active');
		});
	}

	// Cerrar modal al hacer clic fuera
	if (modalAdopcion) {
		modalAdopcion.addEventListener('click', function(e) {
			if (e.target === modalAdopcion) {
				modalAdopcion.classList.remove('active');
			}
		});
	}

	// Mostrar nombre del archivo seleccionado
	if (archivoImagen) {
		archivoImagen.addEventListener('change', function(e) {
			if (e.target.files.length > 0) {
				const file = e.target.files[0];
				fileName.textContent = file.name;
				fileName.style.color = '#28a745';

				// Validar tipo de archivo
				const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
				if (!tiposPermitidos.includes(file.type)) {
					Swal.fire({
						icon: 'error',
						title: 'Formato no válido',
						text: 'Solo se permiten archivos JPG, JPEG o PNG',
						confirmButtonText: 'Entendido',
						confirmButtonColor: '#667eea'
					});
					fileName.textContent = 'Ningún archivo seleccionado';
					fileName.style.color = '#666';
					archivoImagen.value = '';
					return;
				}

				// Validar tamaño (5MB)
				const maxSize = 5 * 1024 * 1024;
				if (file.size > maxSize) {
					Swal.fire({
						icon: 'error',
						title: 'Archivo muy grande',
						text: 'El tamaño máximo permitido es 5MB',
						confirmButtonText: 'Entendido',
						confirmButtonColor: '#667eea'
					});
					fileName.textContent = 'Ningún archivo seleccionado';
					fileName.style.color = '#666';
					archivoImagen.value = '';
					return;
				}
			} else {
				fileName.textContent = 'Ningún archivo seleccionado';
				fileName.style.color = '#666';
			}
		});
	}

	// ==================
	// ALERTAS CON SWEETALERT
	// ==================
	const successAlert = document.querySelector('.alert-success');
	const errorAlert = document.querySelector('.alert-danger');

	if (successAlert) {
		const message = successAlert.querySelector('span').textContent;
		Swal.fire({
			icon: 'success',
			title: '¡Éxito!',
			text: message,
			timer: 4000,
			timerProgressBar: true,
			showConfirmButton: false,
			toast: true,
			position: 'top-end',
			background: '#d1f2eb',
			iconColor: '#28a745'
		});
		successAlert.remove();
	}

	if (errorAlert) {
		const message = errorAlert.querySelector('span').textContent;
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: message,
			confirmButtonText: 'Entendido',
			confirmButtonColor: '#667eea'
		});
		errorAlert.remove();
	}
});

// ==================
// FUNCIÓN VER DETALLES MEJORADA
// ==================
// ==================
// FUNCIÓN VER DETALLES MEJORADA
// ==================
function verDetalles(id) {
	// Mostrar loading
	Swal.fire({
		title: 'Cargando...',
		text: 'Obteniendo información de la mascota',
		allowOutsideClick: false,
		showConfirmButton: false,
		didOpen: () => {
			Swal.showLoading();
		}
	});

	fetch(`/adopciones/${id}/detalles`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Error al obtener los detalles');
			}
			return response.json();
		})
		.then(data => {
			Swal.close();
			console.log('Datos recibidos:', data);

			// Llenar nombre principal
			document.getElementById('detalle-nombre').textContent = data.nombreMascota || 'Sin nombre';

			// Publicador
			const nombreCompleto = ((data.usuario?.nombres || '') + ' ' + (data.usuario?.apellidos || '')).trim();
			document.getElementById('detalle-publicador').textContent = nombreCompleto || 'No especificado';

			// Tipo de mascota
			document.getElementById('detalle-tipo').textContent = data.tipoMascota || 'No especificado';

			// Raza
			document.getElementById('detalle-raza').textContent = data.raza || 'Mestizo / No especificada';

			// Edad
			const edad = data.edad ? `${data.edad} año${data.edad > 1 ? 's' : ''}` : 'No especificada';
			document.getElementById('detalle-edad').textContent = edad;

			// Género
			document.getElementById('detalle-genero').textContent = data.genero || 'No especificado';

			// Tamaño
			document.getElementById('detalle-tamano').textContent = data.tamano || 'No especificado';

			// Contacto
			document.getElementById('detalle-contacto').textContent = data.contacto || 'No especificado';

			// Descripción
			document.getElementById('detalle-descripcion').textContent = data.descripcion || 'Sin descripción disponible.';

			// Fecha de publicación
			if (data.fechaPublicacion) {
				const fecha = new Date(data.fechaPublicacion);
				const fechaFormateada = fecha.toLocaleDateString('es-CO', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				});
				document.getElementById('detalle-fecha').textContent = fechaFormateada;
			} else {
				document.getElementById('detalle-fecha').textContent = 'No especificada';
			}

			// Estado con badge
			const estadoBadge = document.getElementById('detalle-estado-badge');
			let estadoHTML = '';

			switch (data.estado) {
				case 'DISPONIBLE':
					estadoHTML = '<span class="badge-estado-modal disponible"><i class="fas fa-check-circle"></i> En Espera de Adopción</span>';
					break;
				case 'EN_PROCESO':
					estadoHTML = '<span class="badge-estado-modal proceso"><i class="fas fa-clock"></i> Proceso de Adopción</span>';
					break;
				case 'ADOPTADO':
					estadoHTML = '<span class="badge-estado-modal adoptado"><i class="fas fa-heart"></i> Ya fue Adoptado</span>';
					break;
				default:
					estadoHTML = '<span class="badge-estado-modal disponible">No especificado</span>';
			}
			estadoBadge.innerHTML = estadoHTML;

			// Cargar imagen
			const imgUrl = data.imagen && data.imagen !== 'default.jpg'
				? `/uploads/${data.imagen}`
				: '/uploads/default.jpg';

			const imgElement = document.getElementById('detalle-imagen');
			imgElement.src = imgUrl;
			imgElement.alt = `Foto de ${data.nombreMascota}`;
			imgElement.onerror = function() {
				this.src = '/uploads/default.jpg';
				this.alt = 'Imagen no disponible';
			};

			// Mostrar el modal con animación
			const modalDetalles = document.getElementById('modalDetalles');
			modalDetalles.classList.add('show');
			modalDetalles.style.display = 'flex';
		})
		.catch(error => {
			console.error('Error:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudieron cargar los detalles de la mascota. Por favor, intenta nuevamente.',
				confirmButtonText: 'Entendido',
				confirmButtonColor: '#dc143c'
			});
		});
}

// Función para cerrar el modal de detalles
function cerrarModalDetalles() {
	const modalDetalles = document.getElementById('modalDetalles');
	modalDetalles.classList.remove('show');
	// Pequeño delay para la animación de salida
	setTimeout(() => {
		modalDetalles.style.display = 'none';
	}, 300);
}

// Cerrar modal de detalles al hacer clic fuera
document.addEventListener('click', function(e) {
	const modalDetalles = document.getElementById('modalDetalles');
	if (e.target === modalDetalles) {
		cerrarModalDetalles();
	}
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
	if (e.key === 'Escape') {
		const modalDetalles = document.getElementById('modalDetalles');
		if (modalDetalles.classList.contains('show')) {
			cerrarModalDetalles();
		}
	}
});
// ==================
// CONFIRMACIÓN DE ELIMINACIÓN CON SWEETALERT
// ==================
document.addEventListener('DOMContentLoaded', function() {
	// Interceptar formularios de eliminación
	const deleteButtons = document.querySelectorAll('form[action*="/eliminar"] button[type="submit"]');

	deleteButtons.forEach(button => {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			const form = this.closest('form');

			Swal.fire({
				title: '¿Estás seguro?',
				text: 'Esta acción no se puede deshacer',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#667eea',
				cancelButtonColor: '#f5576c',
				confirmButtonText: 'Sí, eliminar',
				cancelButtonText: 'Cancelar',
				reverseButtons: true
			}).then((result) => {
				if (result.isConfirmed) {
					form.submit();
				}
			});
		});
	});

	// Confirmación de cambio de estado
	const estadoButtons = document.querySelectorAll('form[action*="/cambiar-estado"] button[type="submit"]');

	estadoButtons.forEach(button => {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			const form = this.closest('form');
			const nuevoEstado = form.querySelector('input[name="nuevoEstado"]').value;

			let estadoTexto = '';
			let icon = 'question';

			switch (nuevoEstado) {
				case 'DISPONIBLE':
					estadoTexto = 'En espera';
					icon = 'info';
					break;
				case 'EN_PROCESO':
					estadoTexto = 'En Proceso';
					icon = 'warning';
					break;
				case 'ADOPTADO':
					estadoTexto = 'Adoptado';
					icon = 'success';
					break;
			}

			Swal.fire({
				title: '¿Cambiar estado?',
				text: `La mascota pasará a estado: ${estadoTexto}`,
				icon: icon,
				showCancelButton: true,
				confirmButtonColor: '#667eea',
				cancelButtonColor: '#f5576c',
				confirmButtonText: 'Sí, cambiar',
				cancelButtonText: 'Cancelar'
			}).then((result) => {
				if (result.isConfirmed) {
					form.submit();
				}
			});
		});
	});
});
// ==================
// FUNCIONALIDAD DE FILTRADO DE MASCOTAS
// ==================

document.addEventListener('DOMContentLoaded', function() {
	const btnFiltrar = document.getElementById('filtrar');

	if (btnFiltrar) {
		btnFiltrar.addEventListener('click', function() {
			filtrarMascotas();
		});

		// Agregar botón de limpiar filtros
		const filtrosGrid = document.querySelector('.filtros-grid');
		if (filtrosGrid && !document.getElementById('limpiar-filtros')) {
			const limpiarBtn = document.createElement('div');
			limpiarBtn.className = 'filtro-group';
			limpiarBtn.innerHTML = `
				<button id="limpiar-filtros" class="btn-filtrar" style="background: #6c757d;">
					<i class="fas fa-redo"></i> Limpiar Filtros
				</button>
			`;
			filtrosGrid.appendChild(limpiarBtn);

			// Event listener para limpiar
			document.getElementById('limpiar-filtros').addEventListener('click', function() {
				document.getElementById('tipo-mascota').value = 'todos';
				document.getElementById('tamanio-mascota').value = 'todos';
				location.reload(); // Recargar la página para mostrar todas las mascotas
			});
		}
	}
});

function filtrarMascotas() {
	const tipoSelect = document.getElementById('tipo-mascota');
	const tamanoSelect = document.getElementById('tamanio-mascota');

	const tipo = tipoSelect.value;
	const tamano = tamanoSelect.value;

	// Mostrar loading
	Swal.fire({
		title: 'Buscando mascotas...',
		text: 'Aplicando filtros',
		allowOutsideClick: false,
		showConfirmButton: false,
		didOpen: () => {
			Swal.showLoading();
		}
	});

	// Construir URL con parámetros
	let url = '/adopciones/filtrar?';
	if (tipo) url += `tipo=${encodeURIComponent(tipo)}&`;
	if (tamano) url += `tamano=${encodeURIComponent(tamano)}`;

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('Error al filtrar mascotas');
			}
			return response.json();
		})
		.then(data => {
			Swal.close();

			if (data.error) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: data.error,
					confirmButtonColor: '#667eea'
				});
				return;
			}

			// Actualizar la sección de mascotas disponibles
			actualizarListaMascotas(data.adopciones, data.total);

			// Mostrar mensaje de resultados
			const tipoTexto = tipo === 'todos' ? 'todas las mascotas' : tipo + 's';
			const tamanoTexto = tamano === 'todos' ? 'todos los tamaños' : 'tamaño ' + tamano;

			Swal.fire({
				icon: 'success',
				title: 'Búsqueda completada',
				text: `Se encontraron ${data.total} mascota(s) - ${tipoTexto}, ${tamanoTexto}`,
				timer: 3000,
				timerProgressBar: true,
				showConfirmButton: false,
				toast: true,
				position: 'top-end'
			});
		})
		.catch(error => {
			console.error('Error:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudo realizar la búsqueda. Por favor, intenta nuevamente.',
				confirmButtonColor: '#667eea'
			});
		});
}

function actualizarListaMascotas(adopciones, total) {
	console.log('Actualizando lista con', total, 'mascotas');

	// Buscar todos los elementos necesarios
	const seccionesMascotas = document.querySelectorAll('.mascotas-section');
	let seccionMascotasDisponibles = null;

	// Encontrar la sección correcta (la última o la que tiene el título correcto)
	seccionesMascotas.forEach(seccion => {
		const titulo = seccion.querySelector('.titulo-seccion');
		if (titulo && titulo.textContent.includes('Mascotas Disponibles')) {
			seccionMascotasDisponibles = seccion;
		}
	});

	// Si no se encuentra por título, usar la última sección
	if (!seccionMascotasDisponibles) {
		seccionMascotasDisponibles = seccionesMascotas[seccionesMascotas.length - 1];
	}

	const mascotasContainer = seccionMascotasDisponibles.querySelector('.mascotas-container');
	let listaMascotas = seccionMascotasDisponibles.querySelector('.lista-mascotas');
	let noMascotas = seccionMascotasDisponibles.querySelector('.no-mascotas');

	if (adopciones.length === 0) {
		// No hay resultados
		console.log('No hay resultados para mostrar');
		if (listaMascotas) {
			listaMascotas.style.display = 'none';
		}

		if (noMascotas) {
			noMascotas.style.display = 'flex';
			noMascotas.innerHTML = `
				<i class="fas fa-search fa-3x"></i>
				<p>No se encontraron mascotas con los filtros seleccionados</p>
			`;
		} else {
			// Crear el mensaje si no existe
			const nuevoNoMascotas = document.createElement('div');
			nuevoNoMascotas.className = 'no-mascotas';
			nuevoNoMascotas.innerHTML = `
				<i class="fas fa-search fa-3x"></i>
				<p>No se encontraron mascotas con los filtros seleccionados</p>
			`;
			mascotasContainer.appendChild(nuevoNoMascotas);
		}
		return;
	}

	// Hay resultados - MOSTRAR LAS MASCOTAS
	console.log('Mostrando', adopciones.length, 'mascotas');

	// Ocultar mensaje de "no mascotas" si existe
	if (noMascotas) {
		noMascotas.style.display = 'none';
	}

	// Asegurarse de que existe el contenedor de lista
	if (!listaMascotas) {
		listaMascotas = document.createElement('div');
		listaMascotas.className = 'lista-mascotas';
		mascotasContainer.appendChild(listaMascotas);
	}

	// Mostrar y limpiar la lista
	listaMascotas.style.display = 'grid';
	listaMascotas.innerHTML = '';

	// Agregar las tarjetas de mascotas filtradas
	adopciones.forEach(adopcion => {
		console.log('Creando tarjeta para:', adopcion.nombreMascota);
		const card = crearTarjetaMascota(adopcion);
		listaMascotas.appendChild(card);
	});

	// Ocultar paginación si existe
	const paginacion = seccionMascotasDisponibles.querySelector('.pagination-nav');
	if (paginacion) {
		paginacion.style.display = 'none';
	}

	// Scroll suave hacia los resultados
	setTimeout(() => {
		seccionMascotasDisponibles.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, 100);
}

function crearTarjetaMascota(adopcion) {
	const card = document.createElement('div');
	card.className = 'card-mascota';

	const imagenUrl = adopcion.imagen && adopcion.imagen !== 'default.jpg'
		? `/uploads/${adopcion.imagen}`
		: '/uploads/default.jpg';

	const edad = adopcion.edad ? `${adopcion.edad} Año${adopcion.edad > 1 ? 's' : ''}` : '';
	const tamano = adopcion.tamano || '';
	const raza = adopcion.raza || 'Mestizo / No especificada';
	const descripcion = adopcion.descripcion || 'Sin descripción disponible.';
	const descripcionCorta = descripcion.length > 150 ? descripcion.substring(0, 150) + '...' : descripcion;

	card.innerHTML = `
		<div class="mascota-imagen-container">
			<span class="badge-estado bg-success">En espera</span>
			<img src="${imagenUrl}" alt="${adopcion.nombreMascota}" onerror="this.src='/uploads/default.jpg'">
		</div>
		<div class="mascota-info">
			<h3 class="mascota-nombre">${adopcion.nombreMascota}</h3>
			<div class="mascota-detalles">
				<span>${adopcion.tipoMascota}</span>
				${tamano ? `<span>${tamano}</span>` : ''}
				${edad ? `<span>${edad}</span>` : ''}
			</div>
			<h6 class="mascota-raza">Raza: ${raza}</h6>
			<p class="mascota-descripcion">${descripcionCorta}</p>
			<div class="mascota-acciones">
				<button class="btn-ver-detalles" onclick="verDetalles(${adopcion.id})">
					<i class="fas fa-eye"></i> Ver Detalles
				</button>
			</div>
		</div>
	`;

	return card;
}