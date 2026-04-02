// Toggle del menú hamburguesa
document.querySelector('.hamburger-btn').addEventListener('click', function () {
    document.querySelector('.menu-content').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to cards when they come into view
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show an alert
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
});

//calendario flotante

document.addEventListener('DOMContentLoaded', function () {
    const calendarButton = document.getElementById('calendarButton');
    const calendarPopup = document.getElementById('calendarPopup');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    const agendarCitaBtn = document.getElementById('agendarCitaBtn');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.getElementById('calendarDays');

    let currentDate = new Date();
    let selectedDate = new Date();

    // Mostrar/ocultar calendario
    calendarButton.addEventListener('click', function (e) {
        e.stopPropagation();
        calendarPopup.classList.toggle('active');
        renderCalendar();
    });

    // Cerrar calendario al hacer clic fuera
    document.addEventListener('click', function () {
        calendarPopup.classList.remove('active');
    });

    calendarPopup.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Navegación del calendario
    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    todayBtn.addEventListener('click', function () {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
    });

    // Agendar cita por WhatsApp
    agendarCitaBtn.addEventListener('click', function () {
        const formattedDate = selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Número de WhatsApp (reemplaza con el número real)
        const phoneNumber = "573204767864"; // Ejemplo: número de Colombia

        // Mensaje predefinido
        const message = `¡Hola! Quiero agendar una cita para mi mascota el día ${formattedDate}. Por favor confírmame disponibilidad.`;

        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(message);

        // Redirigir a WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

        calendarPopup.classList.remove('active');
    });

    // Renderizar calendario
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = currentDate.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        calendarDays.innerHTML = '';

        // Días del mes anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = 0; i < startingDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
            calendarDays.appendChild(dayElement);
        }

        // Días del mes actual
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;

            // Marcar día actual
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('current-day');
            }

            // Marcar día seleccionado
            if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayElement.style.backgroundColor = 'var(--verde-suave)';
                dayElement.style.fontWeight = 'bold';
            }

            dayElement.addEventListener('click', function () {
                selectedDate = new Date(year, month, i);
                renderCalendar();
            });

            calendarDays.appendChild(dayElement);
        }

        // Días del siguiente mes
        const daysToShow = 42 - (startingDay + daysInMonth);
        for (let i = 1; i <= daysToShow; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = i;
            calendarDays.appendChild(dayElement);
        }
    }

    // Inicializar calendario
    renderCalendar();
});