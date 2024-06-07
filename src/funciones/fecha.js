// Selecciona el campo de entrada de fecha
var fechaInput = document.getElementById('fecha');

// Escucha el evento input en el campo de fecha
fechaInput.addEventListener('input', function(event) {
    // Verifica si la longitud actual del valor excede 10 caracteres
    if (this.value.length > 10) {
        // Limita la longitud del valor a 10 caracteres
        this.value = this.value.slice(0, 10);
    }
});
