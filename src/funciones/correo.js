const correoInput = document.getElementById('correo_electronico');
const correoError = document.getElementById('correoError');
const correoPattern = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/; // Patrón de correos válidos

correoInput.addEventListener('input', function () {
    const correoValue = correoInput.value.trim();
    if (!correoPattern.test(correoValue) || correoValue.length < 16 || correoValue.length > 30) {
        correoError.textContent = 'Ingrese un correo válido (ej. usuario@gmail.com) de 6 a 30 caracteres';
    } else {
        correoError.textContent = '';
    }
});

function correoValid() {
    const correoInput = document.getElementById('correo_electronico');
    const correoError = document.getElementById('correoError');
    const correoValue = correoInput.value.trim();

    if (!correoPattern.test(correoValue) || correoValue.length < 16 || correoValue.length > 30) {
        correoError.textContent = 'Error al mandar: Ingrese un correo válido (ej. usuario@gmail.com) de 6 a 30 caracteres';
        return false;
    } else {
        correoError.textContent = '';
        return true;
    }
}
