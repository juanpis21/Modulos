document.addEventListener("DOMContentLoaded", function() {
	// --- Modo Oscuro/Claro (Sistema Unificado) ---
	const themeToggle = document.getElementById("themeToggle");
	const savedTheme = localStorage.getItem("theme");

	if (savedTheme === "dark") {
		document.body.classList.add("dark-mode");
		themeToggle.checked = true;
	}

	themeToggle.addEventListener("change", function() {
		if (this.checked) {
			document.body.classList.add("dark-mode");
			localStorage.setItem("theme", "dark");
		} else {
			document.body.classList.remove("dark-mode");
			localStorage.setItem("theme", "light");
		}
	});

	// --- Menú Hamburguesa ---
	document
		.querySelector(".hamburger-btn")
		.addEventListener("click", function(e) {
			e.stopPropagation();
			document.querySelector(".menu-content").classList.toggle("active");
		});

	document.addEventListener("click", function(event) {
		const menu = document.querySelector(".menu-content");
		const btn = document.querySelector(".hamburger-btn");
		if (
			!menu.contains(event.target) &&
			!btn.contains(event.target) &&
			menu.classList.contains("active")
		) {
			menu.classList.remove("active");
		}
	});

	// --- Carrusel (Owl Carousel) ---
	if (typeof $ !== "undefined" && $.fn.owlCarousel) {
		$(".owl-carousel").owlCarousel({
			loop: true,
			margin: 20,
			nav: true,
			responsive: {
				0: { items: 1 },
				600: { items: 2 },
				1000: { items: 3 },
			},
		});
	}

	// --- Función de Búsqueda ---
	const searchInput = document.getElementById("searchInput");
	const searchResults = document.getElementById("searchResults");

	function getTextExcerpt(text, query, radius = 30) {
		const index = text.toLowerCase().indexOf(query.toLowerCase());
		if (index === -1) return null;

		const start = Math.max(0, index - radius);
		const end = Math.min(text.length, index + query.length + radius);
		let excerpt = text.substring(start, end);

		if (start > 0) excerpt = "..." + excerpt;
		if (end < text.length) excerpt = excerpt + "...";
		return excerpt;
	}

	function highlightText(text, query) {
		const regex = new RegExp(escapeRegExp(query), "gi");
		return text.replace(
			regex,
			(match) => `<span class="highlight">${match}</span>`
		);
	}

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	function searchContent(query) {
		searchResults.innerHTML = "";

		if (query.length < 2) {
			searchResults.classList.remove("active");
			return;
		}

		const searchableElements = document.querySelectorAll("[data-searchable]");
		const results = [];
		const regex = new RegExp(escapeRegExp(query), "gi");

		searchableElements.forEach((element) => {
			const text = element.textContent;
			if (regex.test(text)) {
				const excerpt = getTextExcerpt(text, query);
				if (!excerpt) return;

				const titleElement = element.querySelector("h2, h3");
				const title = titleElement
					? titleElement.textContent
					: "Sección sin título";

				results.push({
					element,
					title,
					excerpt: highlightText(excerpt, query),
					matches: text.match(regex).length,
				});
			}
		});

		if (results.length === 0) {
			const noResults = document.createElement("div");
			noResults.className = "search-result-item";
			noResults.textContent = "No se encontraron resultados";
			searchResults.appendChild(noResults);
		} else {
			results.forEach((result) => {
				const resultItem = document.createElement("div");
				resultItem.className = "search-result-item";
				resultItem.innerHTML = `
                    <h6>${result.title} <small class="text-muted">(${result.matches} coincidencias)</small></h6>
                    <p>${result.excerpt}</p>
                `;

				resultItem.addEventListener("click", function() {
					result.element.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});

					const originalBg = result.element.style.backgroundColor;
					result.element.style.backgroundColor = "var(--azul-pastel)";
					setTimeout(() => {
						result.element.style.backgroundColor = originalBg;
					}, 2000);

					searchResults.classList.remove("active");
				});

				searchResults.appendChild(resultItem);
			});
		}

		searchResults.classList.toggle("active", results.length > 0);
	}

	searchInput.addEventListener("input", function() {
		searchContent(this.value.trim());
	});

	searchInput.addEventListener("focus", function() {
		if (this.value.trim().length >= 2) {
			searchResults.classList.add("active");
		}
	});

	document.addEventListener("click", function(e) {
		if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
			searchResults.classList.remove("active");
		}
	});

	searchInput.addEventListener("keypress", function(e) {
		if (e.key === "Enter") {
			const firstResult = searchResults.querySelector(".search-result-item");
			if (firstResult) {
				firstResult.click();
			}
		}
	});

	// --- CALENDARIO ---
	const calendarButton = document.getElementById("calendarButton");
	const calendarPopup = document.getElementById("calendarPopup");
	const prevMonthBtn = document.getElementById("prevMonth");
	const nextMonthBtn = document.getElementById("nextMonth");
	const todayBtn = document.getElementById("todayBtn");
	const agendarCitaBtn = document.getElementById("agendarCitaBtn");
	const currentMonthYear = document.getElementById("currentMonthYear");
	const calendarDays = document.getElementById("calendarDays");

	let currentDate = new Date();
	let selectedDate = new Date();

	function renderCalendar() {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		currentMonthYear.textContent = currentDate.toLocaleDateString("es-ES", {
			month: "long",
			year: "numeric",
		});

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDay = firstDay.getDay();

		calendarDays.innerHTML = "";

		// Días del mes anterior
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = 0; i < startingDay; i++) {
			const dayElement = document.createElement("div");
			dayElement.className = "calendar-day other-month";
			dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
			calendarDays.appendChild(dayElement);
		}

		// Días del mes actual
		const today = new Date();
		for (let i = 1; i <= daysInMonth; i++) {
			const dayElement = document.createElement("div");
			dayElement.className = "calendar-day";
			dayElement.textContent = i;

			if (
				i === today.getDate() &&
				month === today.getMonth() &&
				year === today.getFullYear()
			) {
				dayElement.classList.add("current-day");
			}

			if (
				i === selectedDate.getDate() &&
				month === selectedDate.getMonth() &&
				year === selectedDate.getFullYear()
			) {
				dayElement.style.backgroundColor = "var(--verde-suave)";
				dayElement.style.fontWeight = "bold";
			}

			dayElement.addEventListener("click", function() {
				selectedDate = new Date(year, month, i);
				renderCalendar();
			});

			calendarDays.appendChild(dayElement);
		}

		// Días del siguiente mes
		const daysToShow = 42 - (startingDay + daysInMonth);
		for (let i = 1; i <= daysToShow; i++) {
			const dayElement = document.createElement("div");
			dayElement.className = "calendar-day other-month";
			dayElement.textContent = i;
			calendarDays.appendChild(dayElement);
		}
	}

	// Event listeners del calendario
	calendarButton.addEventListener("click", function(e) {
		e.stopPropagation();
		calendarPopup.classList.toggle("active");
		renderCalendar();
	});

	calendarPopup.addEventListener("click", function(e) {
		e.stopPropagation();
	});

	document.addEventListener("click", function() {
		calendarPopup.classList.remove("active");
	});

	prevMonthBtn.addEventListener("click", function() {
		currentDate.setMonth(currentDate.getMonth() - 1);
		renderCalendar();
	});

	nextMonthBtn.addEventListener("click", function() {
		currentDate.setMonth(currentDate.getMonth() + 1);
		renderCalendar();
	});

	todayBtn.addEventListener("click", function() {
		currentDate = new Date();
		selectedDate = new Date();
		renderCalendar();
	});

	agendarCitaBtn.addEventListener("click", function() {
		const formattedDate = selectedDate.toLocaleDateString("es-ES", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const phoneNumber = "573204767864";
		const message = `¡Hola! Quiero agendar una cita para mi mascota el día ${formattedDate}. Por favor confírmame disponibilidad.`;
		const encodedMessage = encodeURIComponent(message);

		window.open(
			`https://wa.me/${phoneNumber}?text=${encodedMessage}`,
			"_blank"
		);
		calendarPopup.classList.remove("active");
	});

	renderCalendar();

	// --- MODAL DE EMERGENCIAS ---
	const modalEmergencias = document.getElementById("modalemergencias");
	const btnEmergencias = document.getElementById("emergencias");
	const closeBtn = document.querySelector(".close");

	if (btnEmergencias) {
		btnEmergencias.addEventListener("click", function() {
			modalEmergencias.style.display = "block";
		});
	}

	if (closeBtn) {
		closeBtn.addEventListener("click", function() {
			modalEmergencias.style.display = "none";
		});
	}

	window.addEventListener("click", function(event) {
		if (event.target === modalEmergencias) {
			modalEmergencias.style.display = "none";
		}
	});

	document.addEventListener("keydown", function(event) {
		if (event.key === "Escape") {
			modalEmergencias.style.display = "none";
		}
	});

	// --- WHATSAPP ---
	window.redirigirWhatsApp = function() {
		const numero = "573222473652";
		const mensaje = encodeURIComponent(
			"Hola, necesito una cita de emergencia para mi mascota"
		);
		const url = `https://wa.me/${numero}?text=${mensaje}`;
		window.open(url, "_blank");
	};

	window.redirigirWhatsApp2 = function() {
		const numero = "573222473652";
		const mensaje = encodeURIComponent(
			"Hola, necesito primeros auxilios para mi mascota"
		);
		const url = `https://wa.me/${numero}?text=${mensaje}`;
		window.open(url, "_blank");
	};

	window.redirigirVideollamada = function() {
		const enlace = "https://meet.google.com/abc-defg-hij";
		window.open(enlace, "_blank");
	};
});

// --MODAL DE SERVICIOS--
// Funciones para abrir/cerrar modal de servicios
function abrirServicios() {
	const modal = document.getElementById("serviciosModal");
	modal.classList.add("active");
}

function cerrarServicios() {
	const modal = document.getElementById("serviciosModal");
	modal.classList.remove("active");
}

// Event listener para el botón "Conoce Nuestros Servicios"
const btnServicios = document.querySelector(".btn-hero");
if (btnServicios) {
	btnServicios.addEventListener("click", function(e) {
		e.preventDefault();
		abrirServicios();
	});
}

// Cerrar modal al hacer clic fuera
const serviciosModal = document.getElementById("serviciosModal");
if (serviciosModal) {
	serviciosModal.addEventListener("click", function(e) {
		if (e.target === this) {
			cerrarServicios();
		}
	});
}

// Cerrar modal con tecla Escape
document.addEventListener("keydown", function(e) {
	if (e.key === "Escape") {
		cerrarServicios();
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
