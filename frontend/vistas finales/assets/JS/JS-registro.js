// Configuración del modal de términos y condiciones
const modal = document.getElementById('termsModal');
const openBtn = document.getElementById('open-terms');
const closeBtn = document.querySelector('.close');

openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Validaciones del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const edadInput = document.getElementById('edad');
    const tipoDocumentoSelect = document.getElementById('tipoDocumento');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const checkTerminos = document.getElementById('acepto');

    // Validación de edad en tiempo real
    edadInput.addEventListener('input', function() {
        const edad = parseInt(this.value);
        if (edad < 18) {
            this.setCustomValidity('Debes ser mayor de 18 años para registrarte');
            this.style.borderColor = '#dc3545';
        } else if (edad > 120) {
            this.setCustomValidity('Por favor ingresa una edad válida');
            this.style.borderColor = '#dc3545';
        } else {
            this.setCustomValidity('');
            this.style.borderColor = '#28a745';
        }
    });

    // Validación de contraseñas coincidentes
    function validatePasswords() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden');
            confirmPasswordInput.style.borderColor = '#dc3545';
        } else if (passwordInput.value.length < 6) {
            passwordInput.setCustomValidity('La contraseña debe tener al menos 6 caracteres');
            passwordInput.style.borderColor = '#dc3545';
        } else {
            confirmPasswordInput.setCustomValidity('');
            passwordInput.setCustomValidity('');
            confirmPasswordInput.style.borderColor = '#28a745';
            passwordInput.style.borderColor = '#28a745';
        }
    }

    passwordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);

    // Validación del tipo de documento
    tipoDocumentoSelect.addEventListener('change', function() {
        if (this.value === '') {
            this.setCustomValidity('Debes seleccionar un tipo de documento');
            this.style.borderColor = '#dc3545';
        } else {
            this.setCustomValidity('');
            this.style.borderColor = '#28a745';
        }
    });

    // Validación antes del envío del formulario
    form.addEventListener('submit', function(e) {
        // Verificar términos y condiciones
        if (!checkTerminos.checked) {
            e.preventDefault();
            alert('⚠️ Debes aceptar los Términos y Condiciones para continuar.');
            return false;
        }

        // Verificar edad
        const edad = parseInt(edadInput.value);
        if (edad < 18) {
            e.preventDefault();
            alert('⚠️ Debes ser mayor de 18 años para registrarte.');
            edadInput.focus();
            return false;
        }

        // Verificar tipo de documento
        if (tipoDocumentoSelect.value === '') {
            e.preventDefault();
            alert('⚠️ Debes seleccionar un tipo de documento.');
            tipoDocumentoSelect.focus();
            return false;
        }

        // Verificar contraseñas
        if (passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault();
            alert('⚠️ Las contraseñas no coinciden.');
            confirmPasswordInput.focus();
            return false;
        }

        if (passwordInput.value.length < 6) {
            e.preventDefault();
            alert('⚠️ La contraseña debe tener al menos 6 caracteres.');
            passwordInput.focus();
            return false;
        }

        // Si todo está bien, mostrar mensaje de procesamiento
        const submitBtn = form.querySelector('.btn-register');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registrando...';
        submitBtn.disabled = true;
    });
});

// Funcionalidad de botones sociales
document.querySelector('.btn-google').addEventListener('click', (e) => {
    e.preventDefault();
    alert('🔄 Funcionalidad de Google en desarrollo');
});

document.querySelector('.btn-facebook').addEventListener('click', (e) => {
    e.preventDefault();
    alert('🔄 Funcionalidad de Facebook en desarrollo');
});

// Función para mostrar información del tipo de documento seleccionado
function showDocumentInfo() {
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numDocumento = document.getElementById('numDocumento');
    
    tipoDocumento.addEventListener('change', function() {
        const selectedValue = this.value;
        let placeholder = 'Número de documento';
        let pattern = '';
        
        // Configurar placeholder y patrón según el tipo de documento
        switch(selectedValue) {
            case 'Cédula':
                placeholder = 'Ej: 12345678';
                pattern = '[0-9]{6,12}';
                break;
            case 'DNI':
                placeholder = 'Ej: 12345678';
                pattern = '[0-9]{7,9}';
                break;
            case 'Pasaporte':
                placeholder = 'Ej: AB123456';
                pattern = '[A-Z0-9]{6,12}';
                break;
            case 'Tarjeta de Identidad':
                placeholder = 'Ej: 123456789';
                pattern = '[A-Z0-9]{6,15}';
                break;
            case 'Cédula de Extranjería':
                placeholder = 'Ej: CE123456789';
                pattern = '[A-Z0-9]{8,15}';
                break;
            case 'Permiso de Residencia':
                placeholder = 'Ej: PR123456789';
                pattern = '[A-Z0-9]{8,15}';
                break;
            case 'Documento Nacional':
                placeholder = 'Ej: 123456789';
                pattern = '[A-Z0-9]{6,15}';
                break;
            case 'Licencia de Conducir':
                placeholder = 'Ej: D123456789';
                pattern = '[A-Z0-9]{6,15}';
                break;
            default:
                placeholder = 'Número de documento';
                pattern = '';
        }
        
        numDocumento.placeholder = placeholder;
        numDocumento.pattern = pattern;
    });
}

// Inicializar funcionalidad de información de documentos
showDocumentInfo();

// Función para mostrar/ocultar contraseñas
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        toggleIcon.title = 'Ocultar contraseña';
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        toggleIcon.title = 'Mostrar contraseña';
    }
}