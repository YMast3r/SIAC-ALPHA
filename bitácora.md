# Proyecto SIAC (Sistema de Administración de Condominios)

## Registro de Cambios

### Versión 3.6 - 3.7 (24/09/2024): Back-end
- Se solucionaron problemas de Fron-end y Back-end.
- Se agregó icono de moneda.

### Versión 3.5.3 - 3.5.8 (23/09/2024): Back-end y Fron-end
- Se solucionaron problemas de Fron-end y Back-end.
- Se agregó la división de pagos en pestañas.
- Se agregó un pop en tipos.

### Versión 3.5.3 (14/09/2024): Back-end
- Formato de moneda en el precio.
- En las evidencias de pago que solo pidan Imágenes.

### Versión 3.5.2 (13/09/2024): Back-end
- Cambiar todos los errores, envés de mensaje rojo que sea una ventana.
- Usar un calendario en vez de combo box en plazo.

### Versión 3.5.1 (13/09/2024): Back-end
- Se cambió anio por años y en el backend a year.

### Versión 3.5 (12/09/2024): Back-end
- Se solucionaron errores del desarrolló de pago a plazos.

### Versión 3.4.5 (11/09/2024): Back-end
- Verificar que la fecha final sea mayor a la fecha de inicio,
  dado el caso que no lo sea mandar su mensaje de error correspondiente.
- Verificar que no se ha registrado ningún pago individual que esté en el plazo
  ejemplo: Se registra septiembre, y el usuario selecciona agosto a octubre,
  debe de mostrar el mensaje de error correspondiente.
- Debe de dar de alta los pagos de manisera individual en la tabla "pagos".
- Debe de ingresar un pago específico desde que mesI, añoI, hasata MesF y AñoF en la tabla "pagoPlazos". 
- Debe de mantener la misma estructura.

### Versión 3.4.4 (11/09/2024): Back-end
- Se acabó de agregar La estructura del formulario de pagos a plazos.
- Se agregó la función y las rutas de pago a plazos.
- Se arregló el problema de incidencia. 

### Versión 3.4.4 (11/09/2024): Back-end
- Se acabó de agregar La estructura del formulario de pagos a plazos.
- Se agregó la función y las rutas de pago a plazos.
- Se arregló el problema de incidencia. 

### Versión 3.4.3 (10/09/2024): Backend Y Frotend
- Se acabo de agregar el fronted a las tablas.
- Se agregó una nueva barra de navegación.
- Se solucionaron unos errores de backend de pagos(NO filtraba los pagos segun la propiedad).

### Versión 3.4.2 (06/09/2024): Backend Y Frotend
- Se agregó el fronted a algunas tablas.
- Se solucionaron unos errores de backend de pagos.

### Versión 3.4.1 (06/09/2024): Backend
- Se agregaron las rutas para manipular tipos.
- Se añadieron las funciones para recuperar y dar de alta tipos de pago.
- Se añadió el campo de tipo de pago en el registro de pagos.
- Se añadió la función de mostrar recargos según el tipo de pago.
- Corrección de problemas generales.

### Versión 3.4 (05/09/2024): Backend
- Se corrigieron problemas en el campo "nombre" que afectaban los números.
- Se agregó el campo "tipo de pago".

### Versión 3.3 (04/09/2024): Backend
- Se añadió el filtro de fecha por año y mes.
- Se solucionó el problema de seguimiento al registrar.

### Versión 3.2.2 (02/09/2024): Backend
- Se corrigieron problemas generales.

### Versión 3.2.1 (30/08/2024): Backend
- Se añadió un campo de búsqueda en los selectores.

### Versión 3.2 (15/08/2024): Backend
- Se solucionaron problemas en la subida de imágenes.

### Versión 3.1.2 (15/08/2024): Backend
- Se trabajó con la hoja de Excel para evaluar su funcionamiento. Aún no está terminado.

### Versión 3.1.1 (15/08/2024): Frontend y Backend
- Se implementó el filtro de búsqueda en todas las tablas.

### Versión 3.1 (15/08/2024): Frontend
- Se comenzó a añadir el filtro de búsqueda.

### Versión 3.0 (15/08/2024): Frontend
- Versión base para futuras actualizaciones.

### Versión 2.8.3 (06/06/2024): Frontend
- Versión final entregada.

### Versión 2.8 a 2.8.2 (06/06/2024): Frontend
- Se ajustaron y corrigieron detalles para la presentación final.

### Versión 2.7 (04/06/2024): Backend
- Se unificó la función de anexar imagen de evidencia en el pago y añadir propiedades al condómino con la opción de anexar condómino.
- Se agregó el menú desplegable de frontend en el login.

### Versión 2.6.4 (04/06/2024): Backend
- Función para anexar más de una propiedad al condómino.

### Versión 2.6.3 (04/06/2024): Backend
- Función para guardar las rutas de las imágenes de pago en una nueva columna llamada "imagen".

### Versión 2.6.2 (03/06/2024): Backend
- Función para almacenar las imágenes de los pagos en una carpeta del código.

### Versión 2.6.1 (03/06/2024): Backend
- Función para anexar una propiedad al condómino.

### Versión 2.6 (22/05/2024): Backend
- Restricción para que no se puedan registrar pagos con condóminos que no estén en estado activo.
- Se limitó la longitud de los caracteres en la fecha.
- Función de alta de propiedad.
- Función de alta de tipo de propiedad.

### Versión 2.5.4 (22/05/2024): Backend
- Estructura del backend de la página de propiedades (hbs).
- Recuperación de datos.

### Versión 2.5.3 (22/05/2024): Backend
- Integración del frontend con las nuevas rutas.

### Versión 2.5.2 (21/05/2024): Frontend
- Actualización del frontend.

### Versión 2.5.1 (21/05/2024): Backend
- Rutas de la página de manipulación de propiedades.

### Versión 2.5 (15/05/2024): Backend
- Recreación de las funciones para la página de incidencias con el usuario condómino.

### Versión 2.4 (15/05/2024): Backend
- Recreación de las funciones para la página de pagos con el usuario condómino.

### Versión 2.3 (15/05/2024): Backend
- Se finalizó la página de seguimiento.
- Se modificó el alta de seguimiento para calcular el movimiento según el folio.
- Se verifica la existencia del empleado al dar de alta.
- Se mejoró la recuperación del ID del condominio mediante una consulta.
- Se cambió la estructura de la recuperación de datos de incidencia y seguimiento para mantener algunos datos fijos, incluso si no se ha dado de alta ningún dato en la página.

### Versión 2.2.3 (14/05/2024): Backend
- Alta de seguimiento.

### Versión 2.2.2 (14/05/2024): Backend
- Se recuperaron los datos de la página.

### Versión 2.2.1 (13/05/2024): Backend
- Estructura de la página de seguimiento.

### Versión 2.2 (08/05/2024 - 13/05/2024): Backend
- Mantenimiento de la base de datos debido a la ausencia del encargado.
- Se completó el alta de incidencia.

### Versión 2.1.2 (08/05/2024): Backend
- Recuperación de datos de la incidencia.
- Se creó el alta de incidencia.
- Se desarrolló la página de la incidencia.

### Versión 2.1.1 (07/05/2024): Backend
- Mantenimiento a la estructura de la incidencia.
- Recuperación de datos de las incidencias.
- Se inició el alta de incidencia.
- Se creó la estructura de la incidencia.

### Versión 2.1 (06/05/2024 - 07/05/2024): Backend
- Creación de rutas.

### Versión 2.0 (03/05/2024 - 06/05/2024): Backend
- Solución al problema de duplicación de pagos por condominio.
- Presentación del proyecto al Product Owner, quien aprobó la versión.

### Versión 1.2 (12/04/2024 - 13/04/2024): Backend
- Finalización del desarrollo de la funcionalidad para prevenir la duplicación de pagos.
- Implementación de un sistema para almacenar los elementos ingresados en caso de detectar un error de duplicación de pago.

### Versión 1.1 (12/04/2024): Backend
- Inicio del desarrollo de una funcionalidad para evitar la repetición de pagos, permitiendo solo un pago por mes cada año.
- Actualización de la base de datos:
  - Modificación de los meses de los pagos para que no se repitan.
  - Los pagos ahora comienzan desde enero hasta abril.
  - Se detectó una repetición del mes de junio, que fue reemplazado por julio.

### Versión 1.0 (12/04/2024): Backend
- Lanzamiento inicial del proyecto al Product Owner, quien realizó algunas observaciones y aplazó la fecha de entrega al 2 de mayo.

## Contribuidores
- Iván Guerrero: Versiones 1.1 y 1.2.
- Iván, Uriel: 2.1.
- Valente, Iván, Uriel y Mar: 2.1.1 y 2.1.2.
- Mar, Iván: 2.2.
- Iván y Ángel: 2.2.1.
- Iván: 2.2.2.
- Mar: 2.2.3.
- Iván: 2.3 - 2.5.
- Ángel: 2.5.1.
- Ivon: 2.5.2.
- Iván: 2.5.3 y 2.5.4.
- Iván, Ángel, Valente y Mar: 2.6.
- Iván: 2.6.1, 2.6.4 y 2.7.
- Ángel: 2.6.2 y 2.6.3.
- Gael e Iván: 2.8 a 2.8.3.
- Iván: 3.0.
- Ángel: 3.1 y 3.1.1.
- Iván, Ángel y Mar: 3.1.2.
- Iván: 3.2 a 3.2.2.
- Iván, Ángel, Regina, Odette, Leonel, Ivon, Gabriel: 3.3.
- Iván: 3.4.
- Iván, Mar, Ángel y Valente: 3.4.1.
- Iván, Leonel y Regina: 3.4.2
- Iván, Leonel, Ivon y Regina: 3.4.3
- Iván, Angel: 3.4.4
- Iván y Regina: 3.4.5
- Iván: 3.5 - 3.5.3
- Iván, Ángel, Regina, Odette, Leonel, Ivon, Gabriel: 3.5.4 - 3.7