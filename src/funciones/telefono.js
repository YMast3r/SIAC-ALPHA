const telefonoInput = document.getElementById('telefono');
const telefonoError = document.getElementById('telefonoError');

telefonoInput.addEventListener('input', function () {
    let telefonoValue = telefonoInput.value.replace(/\D/g, ''); // Solo números
    if (telefonoValue.length > 6) {
        telefonoValue = telefonoValue.replace(/(\d{3})(\d{3})(\d{1})/, '$1 $2 $3'); // Agrega espacios
    } else if (telefonoValue.length > 0) {
        telefonoValue = telefonoValue.replace(/(\d{3})(\d{1})/, '$1 $2'); // Agrega espacios
    }
    telefonoInput.value = telefonoValue;
});

telefonoInput.addEventListener('input', function () {
    let telefonoValue = telefonoInput.value.replace(/\D/g, ''); // Solo números
    if (telefonoValue.length !== 10) {
        telefonoError.textContent = 'El teléfono debe tener exactamente 10 dígitos.';
    } else {
        telefonoError.textContent = '';
    }
});

function telefonoValid() {
    const telefonoInput = document.getElementById('telefono');
    const telefonoError = document.getElementById('telefonoError');
    const telefonoPattern = /^\d{3} \d{3} \d{4}$/; // Patrón con espacios
    
    if (!telefonoPattern.test(telefonoInput.value)) {
        telefonoError.textContent = 'El teléfono debe tener el formato correcto (ej. 449 223 9955)';
        return false;
    } else {
        telefonoError.textContent = ''; 
        return true;
    }
}