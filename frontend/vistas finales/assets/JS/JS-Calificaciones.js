// ===== MODO OSCURO/CLARO =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

themeToggle.addEventListener('change', function () {
    if (this.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// ===== MENÚ HAMBURGUESA =====
document.querySelector('.hamburger-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    document.querySelector('.menu-content').classList.toggle('active');
});

document.addEventListener('click', function (event) {
    const menu = document.querySelector('.menu-content');
    const btn = document.querySelector('.hamburger-btn');
    if (!menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// ===== BOTÓN VOLVER AL INICIO =====
const btnInicio = document.querySelector('.btn-inicio');

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        btnInicio.style.display = 'flex';
    } else {
        btnInicio.style.display = 'none';
    }
});

// ===== SISTEMA DE ESTRELLAS =====
const starRatings = document.querySelectorAll('.star-rating');

starRatings.forEach(rating => {
    const stars = rating.querySelectorAll('.fa-star');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const value = parseInt(this.getAttribute('data-rating'));
            const parent = this.parentNode;
            const stars = parent.querySelectorAll('.fa-star');

            stars.forEach(s => {
                s.classList.remove('fas', 'active');
                s.classList.add('far');
            });

            for (let i = 0; i < value; i++) {
                stars[i].classList.remove('far');
                stars[i].classList.add('fas', 'active');
            }
        });

        star.addEventListener('mouseover', function () {
            const value = parseInt(this.getAttribute('data-rating'));
            const parent = this.parentNode;
            const stars = parent.querySelectorAll('.fa-star');

            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                }
            });
        });

        star.addEventListener('mouseout', function () {
            const parent = this.parentNode;
            const stars = parent.querySelectorAll('.fa-star');
            const activeStars = parent.querySelectorAll('.active');

            if (activeStars.length === 0) {
                stars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
            } else {
                const lastActive = parseInt(activeStars[activeStars.length - 1].getAttribute('data-rating'));
                stars.forEach((s, index) => {
                    if (index < lastActive) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            }
        });
    });
});

// ===== ENVÍO DE CALIFICACIONES =====
const submitButtons = document.querySelectorAll('.btn-submit');

submitButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.card') || this.closest('.rating-section');
        const rating = card.querySelectorAll('.active').length;
        const comment = card.querySelector('textarea') ? card.querySelector('textarea').value : '';

        if (rating === 0 && !comment) {
            alert('Por favor selecciona una calificación o escribe un comentario');
            return;
        }

        alert(`¡Gracias por tu calificación${rating > 0 ? ' de ' + rating + ' estrellas' : ''}!${comment ? '\nComentario: ' + comment : ''}`);

        if (card.querySelector('textarea')) {
            card.querySelector('textarea').value = '';
        }

        const stars = card.querySelectorAll('.fa-star');
        stars.forEach(s => {
            s.classList.remove('fas', 'active');
            s.classList.add('far');
        });
    });
});

// ===== EMERGENCIAS =====
const btnEmergencias = document.getElementById('emergencias');

btnEmergencias.addEventListener('click', function () {
    alert('Funcionalidad de Emergencias - Aquí iría el modal o redirección a emergencias');
});








 document.addEventListener('DOMContentLoaded', function () {
            // Función para manejar las calificaciones con estrellas
            const starRatings = document.querySelectorAll('.star-rating');

            starRatings.forEach(rating => {
                const stars = rating.querySelectorAll('.fa-star');

                stars.forEach(star => {
                    star.addEventListener('click', function () {
                        const value = parseInt(this.getAttribute('data-rating'));
                        const parent = this.parentNode;
                        const stars = parent.querySelectorAll('.fa-star');

                        // Remover todas las clases active primero
                        stars.forEach(s => {
                            s.classList.remove('fas');
                            s.classList.remove('active');
                            s.classList.add('far');
                        });

                        // Añadir clase active a las estrellas seleccionadas
                        for (let i = 0; i < value; i++) {
                            stars[i].classList.remove('far');
                            stars[i].classList.add('fas', 'active');
                        }
                    });

                    // Efecto hover
                    star.addEventListener('mouseover', function () {
                        const value = parseInt(this.getAttribute('data-rating'));
                        const parent = this.parentNode;
                        const stars = parent.querySelectorAll('.fa-star');

                        stars.forEach((s, index) => {
                            if (index < value) {
                                s.classList.remove('far');
                                s.classList.add('fas');
                            }
                        });
                    });

                    star.addEventListener('mouseout', function () {
                        const parent = this.parentNode;
                        const stars = parent.querySelectorAll('.fa-star');
                        const activeStars = parent.querySelectorAll('.active');

                        // Si no hay estrellas seleccionadas, volver al estado inicial
                        if (activeStars.length === 0) {
                            stars.forEach(s => {
                                s.classList.remove('fas');
                                s.classList.add('far');
                            });
                        } else {
                            // Si hay estrellas seleccionadas, mantenerlas
                            const lastActive = parseInt(activeStars[activeStars.length - 1].getAttribute('data-rating'));

                            stars.forEach((s, index) => {
                                if (index < lastActive) {
                                    s.classList.remove('far');
                                    s.classList.add('fas');
                                } else {
                                    s.classList.remove('fas');
                                    s.classList.add('far');
                                }
                            });
                        }
                    });
                });
            });

            // Manejo del envío de formularios (simulado)
            const submitButtons = document.querySelectorAll('.btn-submit');

            submitButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    const card = this.closest('.card');
                    const rating = card.querySelectorAll('.active').length;
                    const comment = card.querySelector('textarea') ? card.querySelector('textarea').value : '';

                    if (rating === 0) {
                        alert('Por favor selecciona una calificación');
                        return;
                    }

                    // Aquí iría la lógica para enviar los datos al servidor
                    alert(`¡Gracias por tu calificación de ${rating} estrellas!${comment ? '\nComentario: ' + comment : ''}`);

                    // Resetear el formulario
                    if (card.querySelector('textarea')) {
                        card.querySelector('textarea').value = '';
                    }

                    const stars = card.querySelectorAll('.fa-star');
                    stars.forEach(s => {
                        s.classList.remove('fas', 'active');
                        s.classList.add('far');
                    });
                });
            });
        });


        //  inicialización del carrusel
        document.addEventListener('DOMContentLoaded', function () {
            const vetCarousel = new bootstrap.Carousel(document.getElementById('vetsCarousel'), {
            });

        });

        document.addEventListener('DOMContentLoaded', function () {
            const submitBtn = document.querySelector('.btn-submit');

            submitBtn.addEventListener('click', function () {
                const selectedOption = document.querySelector('input[name="recommendation"]:checked');

                if (!selectedOption) {
                    alert('Por favor selecciona una opción (Sí/No)');
                    return;
                }

                const recommendation = selectedOption.id === 'recommend-yes' ? 'Sí' : 'No';
                const comment = document.querySelector('textarea').value;

                // Aquí puedes enviar los datos al servidor
                alert(`Gracias por tu recomendación: ${recommendation}${comment ? '\nComentario: ' + comment : ''}`);
            });
        });