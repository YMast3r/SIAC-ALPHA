document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar todos los elementos de contraseña
  let passwordFields = document.querySelectorAll('input[type="password"]');

  // Iterar sobre cada campo de contraseña y manejar los eventos de clic en los iconos de "ojo"
    passwordFields.forEach(function(field) {
    let eyeOpen = field.nextElementSibling.querySelector('.icon-tabler-eye');
    let eyeClosed = field.nextElementSibling.querySelector('.icon-tabler-eye-closed');

    // Asegurarse de que solo uno de los iconos esté visible al principio
    eyeOpen.style.display = 'none';
    eyeClosed.style.display = 'block';

    // Función para alternar entre la visibilidad del texto de la contraseña y la contraseña enmascarada
    function togglePasswordVisibility() {
      if (field.type === 'password') {
        field.type = 'text';
        eyeOpen.style.display = 'block'; // Cambiado de 'none' a 'block'
        eyeClosed.style.display = 'none'; // Cambiado de 'block' a 'none'
      } else {
        field.type = 'password';
        eyeClosed.style.display = 'block'; // Cambiado de 'none' a 'block'
        eyeOpen.style.display = 'none'; // Cambiado de 'block' a 'none'
      }
    }

    // Manejar eventos de clic para los iconos de "ojo"
    eyeOpen.addEventListener('click', togglePasswordVisibility);
    eyeClosed.addEventListener('click', togglePasswordVisibility);
  });
});
