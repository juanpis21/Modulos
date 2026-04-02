const currentUserId = document.getElementById('current-user-id') ? document.getElementById('current-user-id').value : null;
let currentPhotoFile = null;

// Función para formatear precios en pesos colombianos (COP)
function formatearPrecioCOP(precio) {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(precio);
}

$(document).ready(function() {

	// Función para inicializar la aplicación
	initApp();

	function initApp() {
		// Configurar menú hamburguesa
		$('.navbar-toggler').click(function() {
			$('#sidebar').toggleClass('active');
			$('main').toggleClass('active');
		});

		// Configurar navegación entre secciones
		$('.nav-link').click(function(e) {
			e.preventDefault();
			$('.nav-link').removeClass('active');
			$(this).addClass('active');

			const target = $(this).attr('href');
			$('.content-section').hide();
			$(target).show();

			// Cargar contenido específico de cada sección desde el backend
			switch (target) {
				case '#dashboard':
					loadQuickSummary();
					loadPetsPreview();
					break;
				case '#mascotas':
					loadPetsSection();
					break;
				case '#historia-clinica':
					loadMedicalHistorySection();
					break;
				case '#tratamientos':
					loadTreatmentsSection();
					break;
				case '#compras':
					loadPurchasesSection();
					break;
				case '#citas':
					loadAppointmentsSection();
					break;
				case '#adopcion':
					loadAdoptionSection();
					break;
				case '#reportes':
					loadReportsSection();
					break;
				case '#opiniones':
					loadReviewsSection();
					break;
				case '#configuracion':
					loadSettingsSection();
					break;
			}

			// Cerrar menú en móviles
			if ($(window).width() < 768) {
				$('#sidebar').removeClass('active');
				$('main').removeClass('active');
			}
		});

		// Mostrar sección de dashboard por defecto al cargar la página
		$('.nav-link.active').click();

		// Configurar botones
		$('#add-pet-btn').click(function() {
			$('#addPetModal').modal('show');
		});

		$('#new-appointment-btn').click(function() {
			window.open('https://wa.me/573204767864?text=Hola,%20me%20gustaría%20agendar%20una%20cita', '_blank');
		});

		$('#delete-account-btn').click(function() {
			eliminarCuentaUsuario();
		});

		// El formulario de perfil se envía mediante POST tradicional (th:action)

		$('#password-form').submit(function(e) {
			e.preventDefault();
			changePassword();
		});

		// Lógica para el rating de opiniones
		$('.rating i').on('click', function() {
			var rating = $(this).data('rating');
			$('#review-rating').val(rating);
			$('.rating i').each(function(index) {
				if (index < rating) {
					$(this).removeClass('far').addClass('fas');
				} else {
					$(this).removeClass('fas').addClass('far');
				}
			});
		});
	}

	// Funciones de carga de secciones (datos precargados desde servidor)
	function loadQuickSummary() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadPetsPreview() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadPetsSection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadMedicalHistorySection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadTreatmentsSection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadPurchasesSection() { 
		console.log('📦 Cargando compras del usuario...');
		
		fetch('/usuarios/api/ventas/mis-compras')
			.then(response => {
				if (!response.ok) {
					throw new Error('Error al cargar compras');
				}
				return response.json();
			})
			.then(ventas => {
				console.log('✅ Compras cargadas:', ventas);
				renderPurchases(ventas);
			})
			.catch(error => {
				console.error('❌ Error al cargar compras:', error);
				document.getElementById('purchase-history').innerHTML = `
					<tr>
						<td colspan="4" class="text-center text-danger">
							<i class="fas fa-exclamation-triangle me-2"></i>
							Error al cargar el historial de compras
						</td>
					</tr>
				`;
			});
	}
	
	function renderPurchases(ventas) {
		const container = document.getElementById('purchase-history');
		
		if (!ventas || ventas.length === 0) {
			container.innerHTML = `
				<tr>
					<td colspan="4" class="text-center text-muted">
						<i class="fas fa-shopping-bag me-2"></i>
						No tienes compras registradas
					</td>
				</tr>
			`;
			return;
		}
		
		container.innerHTML = ventas.map(venta => {
			const fecha = new Date(venta.fecha).toLocaleDateString('es-ES', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
			
			const productos = venta.detalles ? venta.detalles.map(d => 
				`${d.productoNombre} (x${d.cantidad})`
			).join(', ') : 'Sin detalles';
			
			return `
				<tr>
					<td>${fecha}</td>
					<td>
						<small>${productos}</small>
						<br>
						<span class="badge bg-info">${venta.metodoPago || 'N/A'}</span>
						${venta.referencia ? `<br><small class="text-muted">Ref: ${venta.referencia}</small>` : ''}
					</td>
					<td><strong>${formatearPrecioCOP(venta.total)}</strong></td>
					<td>
						<button class="btn btn-sm btn-primary" onclick="verDetalleCompra(${venta.id})">
							<i class="fas fa-eye"></i> Ver
						</button>
					</td>
				</tr>
			`;
		}).join('');
	}
	
	function verDetalleCompra(ventaId) {
		console.log('Ver detalle de compra:', ventaId);
		// Aquí puedes implementar un modal con más detalles si lo deseas
		alert('Funcionalidad de detalle en desarrollo');
	}
	function loadAppointmentsSection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadAdoptionSection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadReportsSection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadReviewsSection() { console.log('ℹ️ Datos cargados desde servidor'); }
	function loadSettingsSection() { console.log('✅ Configuración cargada'); }

	function changePassword() {
		console.log('⚠️ Función changePassword deshabilitada - endpoint no implementado');
		alert('La función de cambio de contraseña será implementada próximamente.');
	}

	// Funciones auxiliares
	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('es-ES', options);
	}

	function capitalizeFirstLetter(string) {
		if (!string) return '';
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function getStatusClass(status) {
		if (!status) return 'bg-secondary';
		const lowerStatus = status.toLowerCase();
		if (lowerStatus.includes('saludable') || lowerStatus.includes('disponible')) return 'bg-success';
		if (lowerStatus.includes('tratamiento') || lowerStatus.includes('en proceso')) return 'bg-warning';
		if (lowerStatus.includes('seguimiento')) return 'bg-info';
		return 'bg-secondary';
	}

	function getStatusBadgeClass(status) {
		if (!status) return 'bg-secondary';
		const lowerStatus = status.toLowerCase();
		if (lowerStatus === 'agendada' || lowerStatus === 'pendiente') return 'bg-primary';
		if (lowerStatus === 'finalizada' || lowerStatus === 'entregado' || lowerStatus === 'completado') return 'bg-success';
		if (lowerStatus === 'cancelada' || lowerStatus === 'rechazado') return 'bg-danger';
		if (lowerStatus === 'en proceso') return 'bg-info';
		return 'bg-secondary';
	}

	function getReasonText(reason) {
		const reasons = {
			'consulta': 'Consulta General',
			'vacunacion': 'Vacunación',
			'urgencia': 'Urgencia',
			'cirugia': 'Cirugía',
			'estetica': 'Estética',
			'control': 'Control',
			'otro': 'Otro'
		};
		return reasons[reason] || capitalizeFirstLetter(reason);
	}
});

// Función para eliminar mascota
function eliminarMascota(id) {
	if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
		fetch('/usuarios/perfilusuario/eliminarmascota/' + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(response => {
				console.log('Respuesta del servidor:', response.status);
				if (response.ok) {
					alert('Mascota eliminada exitosamente');
					location.reload();
				} else {
					return response.text().then(errorMessage => {
						alert('Error al eliminar la mascota: ' + errorMessage);
					});
				}
			})
			.catch(error => {
				console.error('Error en la solicitud:', error);
				alert('Error de conexión: ' + error.message);
			});
	}
}

// Función para mostrar alertas
function showAlert(message, type) {
	const alertDiv = document.createElement('div');
	alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
	alertDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

	// Buscar contenedor principal
	const mainContent = document.querySelector('.main-content');
	if (mainContent) {
		mainContent.insertBefore(alertDiv, mainContent.firstChild);
	} else {
		console.warn('No se pudo mostrar la alerta: contenedor no encontrado');
		return;
	}

	setTimeout(() => {
		if (alertDiv.parentNode) {
			alertDiv.remove();
		}
	}, 5000);
}

// Funciones para foto de perfil
window.previewProfilePicture = function(input) {
	const file = input.files && input.files[0];
	if (!file) return;

	// Validar solo tipo de archivo, sin restricción de tamaño
	const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
	if (!validTypes.includes(file.type)) {
		alert('Formato de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.');
		input.value = '';
		return;
	}

	// Mostrar información del archivo
	const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
	console.log(`📷 Imagen seleccionada: ${file.name} (${fileSizeMB}MB)`);

	currentPhotoFile = file;

	const reader = new FileReader();
	reader.onload = function(e) {
		const previewContainer = document.getElementById('new-picture-preview');
		const previewImg = document.getElementById('picture-preview');
		if (previewImg) {
			previewImg.src = e.target.result;
		}
		if (previewContainer) {
			previewContainer.style.display = 'block';
		}
	};
	reader.readAsDataURL(file);
};

window.saveProfilePicture = async function() {
	if (!currentPhotoFile) {
		alert('No hay ninguna imagen para guardar.');
		return;
	}

	const userId = document.getElementById('current-user-id').value;
	if (!userId) {
		alert('Error: No se pudo identificar el usuario.');
		return;
	}

	try {
		const saveButton = document.querySelector('#new-picture-preview .btn-success');
		if (saveButton) {
			const fileSizeMB = (currentPhotoFile.size / (1024 * 1024)).toFixed(2);
			saveButton.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>Subiendo ${fileSizeMB}MB...`;
			saveButton.disabled = true;
		}

		const reader = new FileReader();
		reader.onload = async function(e) {
			try {
				const base64String = e.target.result;
				console.log(`📤 Enviando imagen de ${(currentPhotoFile.size / (1024 * 1024)).toFixed(2)}MB al servidor...`);

				const response = await fetch('/usuarios/perfilusuario/actualizarFotoPerfil', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						fotoPerfil: base64String,
						usuarioId: userId
					})
				});

				if (response.ok) {
					const result = await response.json();
					const dataUrl = URL.createObjectURL(currentPhotoFile);
					document.getElementById('current-profile-picture').src = dataUrl;
					document.getElementById('sidebar-profile-picture').src = dataUrl;

					document.getElementById('new-picture-preview').style.display = 'none';
					document.getElementById('profile-picture-input').value = '';
					currentPhotoFile = null;

					// Mostrar mensaje de éxito con SweetAlert2 si está disponible
					if (typeof Swal !== 'undefined') {
						Swal.fire({
							title: '¡Éxito!',
							text: 'Foto de perfil actualizada correctamente',
							icon: 'success',
							timer: 2000,
							showConfirmButton: false
						});
					} else {
						alert('✅ Foto de perfil actualizada correctamente.');
					}
				} else {
					const errorText = await response.text();
					throw new Error(errorText || 'Error del servidor');
				}
			} catch (error) {
				console.error('❌ Error al guardar la foto:', error);
				if (typeof Swal !== 'undefined') {
					Swal.fire({
						title: 'Error',
						text: 'Error al guardar la foto: ' + error.message,
						icon: 'error'
					});
				} else {
					alert('❌ Error al guardar la foto: ' + error.message);
				}
			} finally {
				const saveButton = document.querySelector('#new-picture-preview .btn-success');
				if (saveButton) {
					saveButton.innerHTML = '<i class="fas fa-check me-1"></i>Guardar';
					saveButton.disabled = false;
				}
			}
		};
		reader.readAsDataURL(currentPhotoFile);

	} catch (error) {
		console.error('Error al procesar la foto:', error);
		alert('Error al procesar la foto: ' + error.message);
	}
};

window.removeProfilePicture = async function() {
	if (!confirm('¿Estás seguro de que deseas eliminar tu foto de perfil?')) {
		return;
	}

	const userId = document.getElementById('current-user-id').value;
	if (!userId) {
		alert('Error: No se pudo identificar el usuario.');
		return;
	}

	try {
		const response = await fetch('/usuarios/perfilusuario/eliminarFotoPerfil', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				usuarioId: userId
			})
		});

		if (response.ok) {
			const defaultSrc = '/assets/IMG/humano.jpg';
			document.getElementById('current-profile-picture').src = defaultSrc;
			document.getElementById('sidebar-profile-picture').src = defaultSrc;

			document.getElementById('new-picture-preview').style.display = 'none';
			document.getElementById('profile-picture-input').value = '';
			currentPhotoFile = null;

			showAlert('Foto de perfil eliminada correctamente.', 'info');
		} else {
			throw new Error('Error del servidor');
		}
	} catch (error) {
		showAlert('Error al eliminar la foto: ' + error.message, 'danger');
	}
};

window.cancelProfilePicture = function() {
	const input = document.getElementById('profile-picture-input');
	const previewContainer = document.getElementById('new-picture-preview');
	const previewImg = document.getElementById('picture-preview');
	if (input) input.value = '';
	if (previewImg) previewImg.src = '';
	if (previewContainer) previewContainer.style.display = 'none';
	currentPhotoFile = null;
};

// Función para eliminar cuenta de usuario con SweetAlert2
function eliminarCuentaUsuario() {
	Swal.fire({
		title: '⚠️ ¿Eliminar cuenta?',
		html: `
			<div class="text-start">
				<p><strong>Esta acción es permanente e irreversible.</strong></p>
				<p>Al eliminar tu cuenta:</p>
				<ul class="text-start">
					<li>Se eliminarán todos tus datos personales</li>
					<li>Se eliminarán todas tus mascotas registradas</li>
					<li>Se perderá el historial de citas y compras</li>
					<li>No podrás recuperar esta información</li>
				</ul>
				<p class="text-danger"><strong>¿Estás completamente seguro?</strong></p>
			</div>
		`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#dc3545',
		cancelButtonColor: '#6c757d',
		confirmButtonText: 'Sí, eliminar mi cuenta',
		cancelButtonText: 'Cancelar',
		background: '#fff',
		customClass: {
			popup: 'swal-popup-usuario',
			title: 'swal-title-usuario',
			content: 'swal-content-usuario'
		},
		showLoaderOnConfirm: true,
		preConfirm: async () => {
			try {
				const response = await fetch('/usuarios/perfilusuario/eliminarCuenta', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Error al eliminar la cuenta');
				}

				return await response.json();
			} catch (error) {
				Swal.showValidationMessage(`Error: ${error.message}`);
				return false;
			}
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: 'Cuenta eliminada',
				text: 'Tu cuenta ha sido eliminada exitosamente. Serás redirigido a la página principal.',
				icon: 'success',
				timer: 3000,
				showConfirmButton: false,
				background: '#fff',
				customClass: {
					popup: 'swal-popup-usuario',
					title: 'swal-title-usuario'
				}
			}).then(() => {
				window.location.href = '/';
			});
		}
	});
}

// Eventos para editar mascotas
document.addEventListener('DOMContentLoaded', function() {
	var editPetModal = document.getElementById('editPetModal');
	if (editPetModal) {
		editPetModal.addEventListener('show.bs.modal', function(event) {
			var button = event.relatedTarget;
			var mascotaId = button.getAttribute('data-id');
			console.log("🔄 Cargando mascota con ID:", mascotaId);

			var form = editPetModal.querySelector('#editPetForm');
			form.reset();

			fetch('/usuarios/perfilusuario/mascota/' + mascotaId)
				.then(response => {
					console.log("📡 Respuesta recibida, status:", response.status);
					if (!response.ok) {
						throw new Error('Error al cargar mascota: ' + response.status);
					}
					return response.json();
				})
				.then(mascota => {
					console.log("✅ Datos de mascota recibidos:", mascota);

					const setFieldValue = (id, value) => {
						const element = document.getElementById(id);
						if (element) {
							element.value = value || '';
						} else {
							console.warn(`⚠️ Campo no encontrado: ${id}`);
						}
					};

					setFieldValue('editMascotaId', mascota.id);
					setFieldValue('editNombre', mascota.nombre);
					setFieldValue('editEspecie', mascota.especie);
					setFieldValue('editRaza', mascota.raza);
					setFieldValue('editEdad', mascota.edad);
					setFieldValue('editGenero', mascota.genero);
					setFieldValue('editTamano', mascota.tamaño);
					setFieldValue('editDescripcion', mascota.descripcion);
					setFieldValue('editMascotaFotoActual', mascota.foto);
					setFieldValue('editUnidadEdad', mascota.unidadEdad || 'años');

					console.log("🎯 Formulario llenado correctamente");
				})
				.catch(error => {
					console.error('❌ Error al cargar datos de la mascota:', error);
					alert('Error al cargar datos de la mascota: ' + error.message);
					var modal = bootstrap.Modal.getInstance(editPetModal);
					modal.hide();
				});
		});
	}
});

// Sistema de temas
(function() {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTheme);
	} else {
		initTheme();
	}

	function initTheme() {
		// Obtener todos los toggles de tema
		const themeToggles = document.querySelectorAll('.theme-toggle-checkbox');
		const htmlElement = document.documentElement;

		if (themeToggles.length === 0) {
			console.error('Toggle de tema no encontrado');
			return;
		}

		// Inicializar tema claro
		htmlElement.setAttribute('data-theme', 'light');
		themeToggles.forEach(toggle => toggle.checked = false);

		// Función para sincronizar todos los toggles
		function syncToggles(checked) {
			themeToggles.forEach(toggle => toggle.checked = checked);
		}

		// Agregar event listener a cada toggle
		themeToggles.forEach(toggle => {
			toggle.addEventListener('change', function() {
				if (this.checked) {
					htmlElement.setAttribute('data-theme', 'dark');
					syncToggles(true);
					console.log('Tema oscuro activado');
				} else {
					htmlElement.setAttribute('data-theme', 'light');
					syncToggles(false);
					console.log('Tema claro activado');
				}
			});
		});

		console.log('Sistema de temas inicializado correctamente con ' + themeToggles.length + ' toggles');
	}
})();

// ===== MENÚ HAMBURGUESA Y SIDEBAR MÓVIL =====
(function() {
	// Obtener todos los botones hamburguesa
	const menuToggles = document.querySelectorAll('.menu-toggle');
	const sidebar = document.getElementById('sidebar');
	const sidebarOverlay = document.getElementById('sidebarOverlay');

	if (menuToggles.length === 0 || !sidebar || !sidebarOverlay) {
		console.warn('Elementos del menú hamburguesa no encontrados');
		return;
	}

	// Agregar event listener a cada botón hamburguesa
	menuToggles.forEach(menuToggle => {
		menuToggle.addEventListener('click', function() {
			sidebar.classList.add('active');
			sidebarOverlay.classList.add('active');
			console.log('Sidebar abierto');
		});
	});

	// Cerrar sidebar al hacer click en el overlay
	sidebarOverlay.addEventListener('click', function() {
		sidebar.classList.remove('active');
		sidebarOverlay.classList.remove('active');
		console.log('Sidebar cerrado');
	});

	// Cerrar sidebar al hacer click en un link del menú
	const navLinks = sidebar.querySelectorAll('.nav-link');
	navLinks.forEach(link => {
		link.addEventListener('click', function() {
			// Solo cerrar en móviles (cuando el overlay está visible)
			if (window.innerWidth <= 767.98) {
				sidebar.classList.remove('active');
				sidebarOverlay.classList.remove('active');
			}
		});
	});

	console.log('Sistema de menú hamburguesa inicializado con ' + menuToggles.length + ' botones');
})();

// Los datos del sidebar se cargan desde el servidor mediante Thymeleaf
// No es necesario hacer llamadas AJAX adicionales

// ===== FUNCIÓN PARA IR A LA TIENDA =====
function goToShop() {
	Swal.fire({
		title: '🛍️ ¡Ir a la Tienda!',
		html: `
			<div style="text-align: center;">
				<i class="fas fa-shopping-bag" style="font-size: 3rem; color: #018099; margin-bottom: 1rem;"></i>
				<p style="font-size: 1.1rem; margin-bottom: 1rem;">
					¿Deseas explorar nuestra tienda de productos para mascotas?
				</p>
				<p style="color: #666; font-size: 0.95rem;">
					Encuentra alimentos, juguetes, accesorios y mucho más para tu mejor amigo 🐾
				</p>
			</div>
		`,
		icon: null,
		showCancelButton: true,
		confirmButtonColor: '#018099',
		cancelButtonColor: '#6c757d',
		confirmButtonText: '<i class="fas fa-store me-2"></i>Ir a la Tienda',
		cancelButtonText: '<i class="fas fa-times me-2"></i>Cancelar',
		customClass: {
			popup: 'animated-popup',
			confirmButton: 'btn-shop-confirm',
			cancelButton: 'btn-shop-cancel'
		},
		backdrop: `
			rgba(0,123,153,0.2)
			left top
			no-repeat
		`,
		showClass: {
			popup: 'animate__animated animate__fadeInDown animate__faster'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp animate__faster'
		}
	}).then((result) => {
		if (result.isConfirmed) {
			// Mostrar mensaje de carga
			Swal.fire({
				title: 'Redirigiendo...',
				html: '<i class="fas fa-spinner fa-spin fa-3x" style="color: #018099;"></i>',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,
				allowOutsideClick: false
			}).then(() => {
				// Redirigir a la tienda
				window.location.href = '/usuarios/tienda';
			});
		}
	});
}
