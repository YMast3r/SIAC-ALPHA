const input = document.getElementById('imagen');

    // Manejar el evento de arrastrar
    input.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy'; // Mostrar que se puede soltar
    });

    // Manejar el evento de soltar
    input.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer.files;
        const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];

        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                alert('Tipo de archivo no permitido. Por favor, sube un archivo PNG, JPG o PDF.');
                return;
            }
        }

        // Si los archivos son válidos, actualizar el input con los archivos
        input.files = files;
        });