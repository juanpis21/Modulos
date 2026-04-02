document.getElementById('passwordResetForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    // Validar longitud mínima
    if (newPassword.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Deshabilitar botón y mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.textContent = 'Restableciendo...';
    showMessage('Restableciendo contraseña...', 'info');

    try {
        const response = await fetch('/usuarios/api/password-reset/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                nuevaContrasena: newPassword
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showMessage(data.mensaje, 'success');
            
            // Limpiar formulario
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = '/usuarios/iniciarsesion';
            }, 2000);
        } else {
            showMessage(data.error || 'Error al restablecer la contraseña', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Por favor verifica tu internet e intenta nuevamente.', 'error');
    } finally {
        // Rehabilitar botón si hay error
        if (!messageEl.textContent.includes('exitosamente')) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Restablecer contraseña';
        }
    }
});

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const type = field.type === 'password' ? 'text' : 'password';
    field.type = type;

    // Cambiar icono
    const icon = field.parentElement.querySelector('.toggle-password');
    if (icon) {
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Validación de fortaleza de contraseña en tiempo real
document.getElementById('newPassword').addEventListener('input', function (e) {
    const password = e.target.value;
    const strength = checkPasswordStrength(password);
    updatePasswordStrength(strength);
    validateForm();
});

// Validación de coincidencia de contraseñas
document.getElementById('confirmPassword').addEventListener('input', validateForm);

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4);
}

function updatePasswordStrength(strength) {
    const strengthText = document.getElementById('strength-text');
    const bars = [
        document.getElementById('strength-bar-1'),
        document.getElementById('strength-bar-2'),
        document.getElementById('strength-bar-3'),
        document.getElementById('strength-bar-4')
    ];
    
    // Resetear todas las barras
    bars.forEach(bar => {
        bar.style.backgroundColor = '#ddd';
    });
    
    // Colorear barras según fortaleza
    const colors = ['#f44336', '#ff9800', '#ff9800', '#4caf50'];
    const texts = ['Muy Débil', 'Débil', 'Media', 'Fuerte'];
    
    for (let i = 0; i < strength; i++) {
        bars[i].style.backgroundColor = colors[strength - 1];
    }
    
    strengthText.textContent = texts[strength - 1] || 'Débil';
}

function validateForm() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');
    const matchMessage = document.getElementById('password-match-message');
    
    // Validar que las contraseñas coincidan
    if (confirmPassword.length > 0) {
        if (newPassword === confirmPassword) {
            matchMessage.textContent = '✓ Las contraseñas coinciden';
            matchMessage.style.color = '#4caf50';
        } else {
            matchMessage.textContent = '✗ Las contraseñas no coinciden';
            matchMessage.style.color = '#f44336';
        }
    } else {
        matchMessage.textContent = '';
    }
    
    // Habilitar/deshabilitar botón
    const isValid = newPassword.length >= 6 && 
                   newPassword === confirmPassword && 
                   confirmPassword.length > 0;
    
    submitBtn.disabled = !isValid;
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

    // Ocultar mensaje de error después de 5 segundos
    if (type === 'error') {
        setTimeout(() => {
            if (messageEl.textContent === text) {
                messageEl.style.display = 'none';
            }
        }, 5000);
    }
}
