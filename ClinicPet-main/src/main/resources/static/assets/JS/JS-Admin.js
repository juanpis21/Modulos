// ===== TEMA CLARO/OSCURO CON ICONOS DE BOOTSTRAP =====
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const notificationBell = document.getElementById('notificationBell');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const profileImage = document.getElementById('profileImage');
const form = document.getElementById('imageUploadForm');
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
console.log('✅ Panel administrador inicializado');
setupNavigation();
setupModals();
setupFormValidation();
setupAuthorityAssignment();
setupTabs();

// ===== MANEJO DE SUBIDA DE IMAGEN =====
if (fileInput && fileName) {
	fileInput.addEventListener('change', function(e) {
		if (this.files && this.files[0]) {
			// Actualizar nombre del archivo
			fileName.textContent = this.files[0].name;

			// Habilitar botón de subir
			if (submitBtn) {
				submitBtn.disabled = false;
			}

			// Mostrar vista previa
			if (profileImage) {
				const reader = new FileReader();
				reader.onload = function(e) {
					if (profileImage.tagName === 'IMG') {
						profileImage.src = e.target.result;
					} else if (profileImage.classList.contains('profile-image-placeholder')) {
						const newImg = document.createElement('img');
						newImg.src = e.target.result;
						newImg.alt = 'Vista previa';
						newImg.className = 'profile-large';
						newImg.id = 'profileImage';
						profileImage.replaceWith(newImg);
						profileImage = newImg;
					}
				}
				reader.readAsDataURL(this.files[0]);
			}
		} else {
			fileName.textContent = 'Selecciona una imagen';
			if (submitBtn) {
				submitBtn.disabled = true;
			}
		}
	});
}

// Manejar envío del formulario
if (form && submitBtn) {
	form.addEventListener('submit', function() {
		submitBtn.disabled = true;
		submitBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Subiendo...';
	});
}

function getInitialTheme() {
	const saved = localStorage.getItem('clinicpet-theme');
	if (saved) return saved;
	return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

function applyTheme(theme) {
	document.body.setAttribute('data-theme', theme);
	localStorage.setItem('clinicpet-theme', theme);

	if (theme === 'dark') {
		themeIcon.classList.remove('bi-moon-stars-fill');
		themeIcon.classList.add('bi-sun-fill');
	} else {
		themeIcon.classList.remove('bi-sun-fill');
		themeIcon.classList.add('bi-moon-stars-fill');
	}
}

themeToggleBtn?.addEventListener('click', () => {
	const current = document.body.getAttribute('data-theme');
	const newTheme = current === 'light' ? 'dark' : 'light';
	applyTheme(newTheme);
});

applyTheme(getInitialTheme());

//notificaciones de admin

if (notificationBell) {
	notificationBell.addEventListener('click', function() {
		// Navegar a la sección de reportes
		document.querySelector('[data-section="pets"]').click();

		// Activar tab de reportes de maltrato
		setTimeout(() => {
			const abuseTab = document.querySelector('[data-tab="abuse-tab"]');
			if (abuseTab) {
				abuseTab.click();
			}
		}, 100);
	});
}

// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener('DOMContentLoaded', () => {
	console.log('✅ Panel administrador inicializado');
	setupNavigation();
	setupModals();
	setupFormValidation();
	setupAuthorityAssignment();

	// Deshabilitar botón de subir si no hay archivo seleccionado
	if (submitBtn && (!fileInput || !fileInput.files || fileInput.files.length === 0)) {
		submitBtn.disabled = true;
	}
});

// ===== NAVEGACIÓN =====
function setupNavigation() {
	document.querySelectorAll('.nav-link').forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
			this.classList.add('active');
			document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
			const section = this.getAttribute('data-section');
			document.getElementById(section)?.classList.add('active');
		});
	});
}

// ===== MODALES =====
function abrirModal(idModal) {
	const modal = document.getElementById(idModal);
	if (modal) modal.style.display = 'flex';
}

function cerrarModal(idModal) {
	const modal = document.getElementById(idModal);
	if (modal) modal.style.display = 'none';
}

function setupModals() {
	document.getElementById('editProfileBtn')?.addEventListener('click', () => abrirModal('profileModal'));

	document.querySelectorAll('.modal .close').forEach(closeBtn => {
		closeBtn.addEventListener('click', function() {
			cerrarModal(this.closest('.modal').id);
		});
	});

	window.addEventListener('click', function(e) {
		if (e.target.classList.contains('modal')) {
			e.target.style.display = 'none';
		}
	});
}

// ===== CARGA DE FOTO DE PERFIL =====
function cambiarFotoPerfil(event) {
	const file = event.target.files[0];
	if (!file) return;

	if (!file.type.startsWith('image/')) {
		mostrarMensaje('Por favor seleccione un archivo de imagen válido', 'error');
		return;
	}

	if (file.size > 5 * 1024 * 1024) {
		mostrarMensaje('La imagen debe ser menor a 5MB', 'error');
		return;
	}

	const formData = new FormData();
	formData.append('imagen', file);

	fetch('/admin/perfil/imagen', {
		method: 'POST',
		body: formData
	})
		.then(response => {
			if (response.ok) return response.text();
			throw new Error('Error al subir imagen');
		})
		.then(() => {
			const reader = new FileReader();
			reader.onload = function(e) {
				document.getElementById('adminProfilePic').src = e.target.result;
				document.getElementById('headerProfilePic').src = e.target.result;
			};
			reader.readAsDataURL(file);
			mostrarMensaje('Foto de perfil actualizada correctamente', 'success');
		})
		.catch(error => {
			console.error('Error:', error);
			mostrarMensaje('Error al subir la imagen', 'error');
		});
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function setupFormValidation() {
	const vetForm = document.getElementById('vetForm');
	if (vetForm) {
		vetForm.addEventListener('submit', function(e) {
			const password = document.getElementById('vetPassword')?.value;
			if (password && password.length < 6) {
				e.preventDefault();
				mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
			} else {
				mostrarMensaje('Registrando veterinario...', 'info');
			}
		});
	}

	const profileForm = document.getElementById('profileForm');
	if (profileForm) {
		profileForm.addEventListener('submit', () => mostrarMensaje('Actualizando perfil...', 'info'));
	}

	const clinicForm = document.getElementById('clinicForm');
	if (clinicForm) {
		clinicForm.addEventListener('submit', () => mostrarMensaje('Registrando veterinaria...', 'info'));
	}
}

// ===== MENSAJES AL USUARIO =====
function mostrarMensaje(mensaje, tipo = 'info') {
	if (typeof Swal !== 'undefined') {
		Swal.fire({
			text: mensaje,
			icon: tipo,
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true
		});
	} else {
		alert(mensaje);
	}
}

// ===== FUNCIONES DE CARGA DE DETALLES =====
function verMascota(id) {
	fetch(`/admin/mascota/${id}`)
		.then(res => res.json())
		.then(data => {
			document.getElementById('modalTitulo').innerText = 'Detalles de Mascota';
			document.getElementById('modalCuerpo').innerHTML = `
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>Especie:</strong> ${data.especie}</p>
                <p><strong>Edad:</strong> ${data.edad}</p>
                <p><strong>Género:</strong> ${data.genero}</p>
                <p><strong>Tamaño:</strong> ${data.tamano}</p>
                <p><strong>Descripción:</strong> ${data.descripcion}</p>
                <p><strong>Dueño:</strong> ${data.usuario.nombres} ${data.usuario.apellidos}</p>
                <img src="${data.foto || 'https://via.placeholder.com/150'}" width="150" />
            `;
			abrirModal('detalleModal');
		})
		.catch(error => {
			console.error('Error al cargar mascota:', error);
			mostrarMensaje('No se pudo cargar la información de la mascota', 'error');
		});
}

function verUsuario(id) {
	fetch(`/admin/usuario/${id}`)
		.then(res => res.json())
		.then(data => {
			document.getElementById('modalTitulo').innerText = 'Detalles de Usuario';
			document.getElementById('modalCuerpo').innerHTML = `
                <p><strong>Nombre:</strong> ${data.nombres} ${data.apellidos}</p>
                <p><strong>Correo:</strong> ${data.correo}</p>
                <p><strong>Teléfono:</strong> ${data.telefono}</p>
                <p><strong>Dirección:</strong> ${data.direccion}</p>
                <p><strong>Edad:</strong> ${data.edad}</p>
            `;
			abrirModal('detalleModal');
		});
}

function verVeterinario(id) {
	fetch(`/admin/veterinario/${id}`)
		.then(res => res.json())
		.then(data => {
			document.getElementById('modalTitulo').innerText = 'Detalles de Veterinario';
			document.getElementById('modalCuerpo').innerHTML = `
                <p><strong>Nombre:</strong> ${data.usuario.nombres} ${data.usuario.apellidos}</p>
                <p><strong>Edad:</strong> ${data.usuario.edad}</p>
                <p><strong>Documento:</strong> ${data.usuario.tipoDocumento} ${data.usuario.numDocumento}</p>
                <p><strong>Dirección:</strong> ${data.usuario.direccion}</p>
                <p><strong>Teléfono:</strong> ${data.usuario.telefono}</p>
                <p><strong>Correo:</strong> ${data.usuario.correo}</p>
                <p><strong>Especialidad:</strong> ${data.especialidad}</p>
                <p><strong>Tarjeta Profesional:</strong> ${data.tarjetaProfesional}</p>
                <p><strong>Experiencia:</strong> ${data.experiencia} años</p>
            `;
			abrirModal('detalleModal');
		});
}

function verVeterinaria(id) {
	fetch(`/admin/veterinaria/${id}`)
		.then(res => res.json())
		.then(data => {
			document.getElementById('modalTitulo').innerText = 'Detalles de Veterinaria';
			document.getElementById('modalCuerpo').innerHTML = `
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>RUT:</strong> ${data.rut}</p>
                <p><strong>Dirección:</strong> ${data.direccion}</p>
                <p><strong>Correo:</strong> ${data.correo}</p>
                <p><strong>Horario:</strong> ${data.horario}</p>
                <p><strong>Descripción:</strong> ${data.descripcion}</p>
                <p><strong>Estado:</strong> ${data.estado}</p>
            `;
			abrirModal('detalleModal');
		});
}

// ===== ASIGNACIÓN DE AUTORIDADES (REPORTES) =====
function setupAuthorityAssignment() {
	document.addEventListener('click', e => {
		if (e.target.classList.contains('btn-assign')) {
			const reportId = e.target.getAttribute('data-report-id');
			const select = document.querySelector(`.authority-select[data-report-id="${reportId}"]`);
			const selectedValue = select.value;
			const selectedText = select.options[select.selectedIndex].text;

			if (!selectedValue) return mostrarMensaje('Por favor selecciona una autoridad', 'warning');

			const row = e.target.closest('tr');
			row.querySelector('.status').textContent = 'Asignado';
			row.querySelector('.status').className = 'status assigned';
			row.querySelector('.authority-assigned').textContent = selectedText;
			row.querySelector('.authority-assigned').className = `authority-assigned ${selectedValue}`;
			row.querySelector('.authority-dropdown').innerHTML = `
                <button class="btn-action btn-reassign" data-report-id="${reportId}">Reasignar</button>
                <button class="btn-action btn-complete" data-report-id="${reportId}">Completado</button>
            `;
		}

		if (e.target.classList.contains('btn-reassign')) {
			const reportId = e.target.getAttribute('data-report-id');
			const row = e.target.closest('tr');
			row.querySelector('.status').textContent = 'Pendiente';
			row.querySelector('.status').className = 'status pending';
			row.querySelector('.authority-assigned').textContent = '-';
			row.querySelector('.authority-assigned').className = 'authority-assigned';
			row.querySelector('.authority-dropdown').innerHTML = `
                <select class="authority-select" data-report-id="${reportId}">
                    <option value="">Seleccionar autoridad...</option>
                    <option value="policia">Policía Nacional</option>
                    <option value="seguridad-animal">Seguridad Animal</option>
                    <option value="defensa-animal">Defensa Animal Municipal</option>
                    <option value="ambiental">Policía Ambiental</option>
                    <option value="fiscalia">Fiscalía</option>
                </select>
                <button class="btn-action btn-assign" data-report-id="${reportId}">Asignar</button>
            `;
		}

		if (e.target.classList.contains('btn-complete')) {
			const reportId = e.target.getAttribute('data-report-id');
			const row = e.target.closest('tr');
			row.querySelector('.status').textContent = 'Completado';
			row.querySelector('.status').className = 'status active';
			row.querySelector('.authority-dropdown').innerHTML = '<span class="status completed">Finalizado</span>';
			mostrarMensaje('Reporte marcado como completado', 'success');
		}
	});
}

// ===== CONFIGURACIÓN DE TABS =====
function setupTabs() {
	document.querySelectorAll('.tab-btn').forEach(button => {
		button.addEventListener('click', function() {
			// Obtener el contenedor padre de tabs
			const tabsContainer = this.closest('.tabs').parentElement;

			// Remover clase active de todos los botones en este contenedor
			tabsContainer.querySelectorAll('.tab-btn').forEach(btn =>
				btn.classList.remove('active')
			);

			// Agregar clase active al botón clickeado
			this.classList.add('active');

			// Obtener el ID del tab a mostrar
			const tabId = this.getAttribute('data-tab');

			// Ocultar todos los tab-content en este contenedor
			tabsContainer.querySelectorAll('.tab-content').forEach(content =>
				content.classList.remove('active')
			);

			// Mostrar el tab-content correspondiente
			const targetTab = document.getElementById(tabId);
			if (targetTab) {
				targetTab.classList.add('active');
			}
		});
	});
}

// Función para cerrar sesión
function cerrarSesion(event) {
	// Prevenir comportamiento por defecto
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}

	Swal.fire({
		title: '¿Cerrar sesión?',
		text: '¿Estás seguro de que deseas cerrar la sesión?',
		icon: 'question',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Sí, cerrar sesión',
		cancelButtonText: 'Cancelar'
	}).then((result) => {
		if (result.isConfirmed) {
			// Mostrar mensaje de despedida
			Swal.fire({
				title: 'Sesión cerrada',
				text: 'Hasta pronto, administrador',
				icon: 'success',
				timer: 1500,
				showConfirmButton: false
			}).then(() => {
				// Redirigir al logout del controlador
				window.location.href = '/admin/logout';
			});
		}
	});
}


// ===== EXPONER FUNCIONES AL HTML =====
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.verMascota = verMascota;
window.verUsuario = verUsuario;
window.verVeterinario = verVeterinario;
window.verVeterinaria = verVeterinaria;
window.cambiarFotoPerfil = cambiarFotoPerfil;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;