# Proyecto SIAC (Sistema de Administración de Condominios)

## Registro de Cambios

### Versión 2.7 (04/06/2024): Backend
- Juntar la función de anexar imagen de evidencia en el pago, anexar propiedaddes al condomino y página con la opcion de anexarcondomino condomino.
- Agregar el menu desplegable de forntend del login.

### Versión 2.6.4 (04/06/2024): Backend
- Función para anexar mas de una propiedad al condomino.

### Versión 2.6.3 (04/06/2024): Backend
- Función para guardar las rutas de las imagenes de pago guardadas en la base de datos en una nueva columna llamada imagen.

### Versión 2.6.2 (03/06/2024): Backend
- Función en pago para guardar las imagenes del alta en una carpeta del codigo.

### Versión 2.6.1 (03/06/2024): Backend
- Función para anexar una propiedad al condomino.

### Versión 2.6 (22/05/2024): Backend
- Función para que no se puedan registrar pagos con condominos diferentes al status activo.
- Se limita los caracteres de la fecha.
- Alta de propiedad.
- Alta de tipo propiedad.

### Versión 2.5.4 (22/05/2024): Backend
- Estructura del backen de la página de propiedades(hbs).
- Recuperacion de datos.

### Versión 2.5.3 (22/05/2024): Backend
- Unir el Frontend y las rutas nuevas. 

### Versión 2.5.2 (21/05/2024): Frontend
- Cambio del frontend. 

### Versión 2.5.1 (21/05/2024): Backend
- Rutas de la página de manipula propiedad. 

### Versión 2.5 (15/05/2024): Backend
- Recrear las funciones para la página de incidencias con el usuario condomino. 

### Versión 2.4 (15/05/2024): Backend
- Recrear las funciones para la página de pagos con el usuario condomino.

### Versión 2.3 (15/05/2024): Backend
- Se terminó la página de seguimiento.
- Se modificó el alta de seguimiento para calcular el movimiento dependiendo del folio.
- Se confirma si existe el empleado al momento de dar de alta.
- Se cambió la forma de recuperar el id del condominio con una consulta.
- Se cambió la estructura de cómo se recuperaban los datos de incidencia y seguimiento, para tener algunos datos fijos aun cuando no hubiera dado de alta datos en la página.

### Versión 2.3 (15/05/2024): Backend
- Se terminó la página de seguimiento.
- Se modificó el alta de seguimiento para calcular el movimiento dependiendo del folio.
- Se confirma si existe el empleado al momento de dar de alta.
- Se cambió la forma de recuperar el id del condominio con una consulta.
- Se cambió la estructura de cómo se recuperaban los datos de incidencia y seguimiento, para tener algunos datos fijos aun cuando no hubiera dado de alta datos en la página.

### Versión 2.2.3 (14/05/2024): Backend
- Alta de seguimiento.

### Versión 2.2.2 (14/05/2024): Backend
- Se recuperaron los datos de la página.

### Versión 2.2.1 (13/05/2024): Backend
- Se realizó la estructura de la página de seguimiento.

### Versión 2.2 (08/05/2024 - 13/05/2024): Backend
- Se llevó a cabo el mantenimiento de la base de datos, debido a la ausencia del encargado.
- Se completó el alta de incidencia.

### Versión 2.1.2 (08/05/2024): Backend
- Recuperación de datos de la incidencia.
- Se creó la Alta incidencia.
- Se creó la página de la incidencia.

### Versión 2.1.1 (07/05/2024): Backend
- Mantenimiento a la estructura de la incidencia.
- Recuperación de datos de las incidencias.
- Se inició el alta de incidencia.
- Se creó la estructura de la incidencia.

### Versión 2.1 (06/05/2024 - 07/05/2024): Backend
- Se crearon las rutas.

### Versión 2.0 (03/05/2024 - 06/05/2024): Backend
- Se resolvió el problema de la duplicación del pago para cada condominio.
- Se presentó el proyecto al Product Owner y lo aprobó.

### Versión 1.2 (12/04/2024 - 13/04/2024): Backend
- Se finalizó el desarrollo de la funcionalidad para prevenir la duplicación de pagos.
- Se implementó un sistema para almacenar los elementos ingresados cuando se detecta un error de duplicación de pago.

### Versión 1.1 (12/04/2024): Backend
- Se inició el desarrollo de una funcionalidad para evitar la repetición de pagos, con el objetivo de que solo haya un pago por mes cada año.
- Se actualizó la base de datos:
  - Se modificaron los meses de los pagos para que fueran diferentes en cada pago.
  - Los pagos ahora comienzan desde enero hasta abril.
  - Se detectó una repetición del mes de junio, por lo que se cambió por julio.

### Versión 1.0 (12/04/2024): Backend
- Se realizó el lanzamiento inicial del proyecto al Product Owner, quien realizó algunas observaciones y aplazó la fecha de entrega del producto al 2 de mayo.

## Contribuidores
- Iván Guerrero: Versiones 1.1 y 1.2.
- Iván, Uriel 2.1.
- Valente, Iván, Uriel y Mar 2.1.1 y 2.1.2.
- Mar, Iván 2.2.
- Iván y Ángel 2.2.1
- Iván 2.2.2
- Mar 2.2.3
- Iván 2.3 - 2.5
- Angel 2.5.1
- Ivon 2.5.2
- Iván 2.5.3 y 2.5.4
- Iván, Angel, Valente y Mar 2.6
- Iván 2.6.1, 2.6.4 y 2.7
- Angel 2.6.2 y 2.6.3