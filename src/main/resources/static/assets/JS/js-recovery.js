 // El algoritmo JavaScript permanece EXACTAMENTE igual
document.getElementById('recoveryForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const messageEl = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    // Validación simple del email
    if (!isValidEmail(email)) {
        showMessage('Por favor ingresa un correo electrónico válido.', 'error');
        return;
    }

    // Deshabilitar botón y mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    showMessage('Enviando solicitud de recuperación...', 'info');

    try {
        const response = await fetch('/usuarios/api/password-reset/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showMessage(data.mensaje, 'success');
            document.getElementById('email').value = '';
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                window.location.href = '/usuarios/iniciarsesion';
            }, 3000);
        } else {
            showMessage(data.error || 'Error al procesar la solicitud', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Por favor verifica tu internet e intenta nuevamente.', 'error');
    } finally {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Enlace';
    }
});

function isValidEmail(email) {
    // Expresión regular simple para validar email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.style.display = 'block';

    // Estilos adicionales según el tipo de mensaje
    if (type === 'success') {
        messageEl.style.backgroundColor = '#d4edda';
        messageEl.style.color = '#155724';
        messageEl.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageEl.style.backgroundColor = '#f8d7da';
        messageEl.style.color = '#721c24';
        messageEl.style.border = '1px solid #f5c6cb';
    } else if (type === 'info') {
        messageEl.style.backgroundColor = '#d1ecf1';
        messageEl.style.color = '#0c5460';
        messageEl.style.border = '1px solid #bee5eb';
    }

    // Ocultar el mensaje después de 8 segundos para éxito e info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 8000);
    }
}