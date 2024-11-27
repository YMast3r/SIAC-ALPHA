-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-11-2024 a las 06:20:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `siac`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clasificacion_incidencia`
--

CREATE TABLE `clasificacion_incidencia` (
  `id_clasificacion_incidencia` int(11) NOT NULL,
  `tipo_incidencia` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `clasificacion_incidencia`
--

INSERT INTO `clasificacion_incidencia` (`id_clasificacion_incidencia`, `tipo_incidencia`, `descripcion`) VALUES
(0, 0, 'Otra clasificación'),
(1, 1, 'Instalaciones Eléctricas'),
(2, 1, 'Plomería'),
(3, 1, 'Jardinería'),
(4, 1, 'Infraestructura'),
(5, 2, 'Accesos'),
(6, 2, 'Personal de seguridad'),
(7, 2, 'Robo o Intrusión'),
(8, 3, 'Alumbrado Público'),
(9, 3, 'Recolección de Basura'),
(10, 3, 'Servicios de Limpieza'),
(11, 4, 'Ruido'),
(12, 4, 'Estacionamiento'),
(13, 4, 'Conducta inapropiada'),
(14, 5, 'Gimnasio'),
(15, 5, 'Piscina'),
(16, 5, 'Salón de eventos'),
(17, 6, 'Facturación'),
(18, 6, 'Atención al cliente'),
(19, 4, 'Quejas por falta de limpieza en áreas comunes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id_empleado` int(20) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `tipo_empleado` int(11) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo_electronico` varchar(50) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `fecha_baja` date DEFAULT NULL,
  `motivo_baja` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id_empleado`, `id_usuario`, `nombre`, `apellidos`, `tipo_empleado`, `salario`, `fecha_contratacion`, `telefono`, `correo_electronico`, `empresa`, `fecha_baja`, `motivo_baja`) VALUES
(1, 2, 'Ivan Sebastián', 'Guerrero Basurto', 1, 30000.00, '2020-01-15', '449 223 9955', 'IvanSebastian@gmail.com', 'Empresa falsa', NULL, NULL),
(2, 5, 'Regina Odette', 'Hernández Buenrostro', 1, 20000.00, '2020-01-15', '351 304 6049', 'ReginaOdette@condominio.com', 'Empresa falsa', NULL, NULL),
(3, 4, 'Isaac', 'Gallegos Mena', 2, 10000.00, '2020-01-15', '449 568 6105', 'IsaacGallegos@condominio.com', 'Empresa falsa', NULL, NULL),
(4, 7, 'Ian Yeshua', 'López Garcia', 3, 15000.00, '2019-05-20', '449 429 6282', 'ianYeshua@condominio.com', 'Empresa falsa', NULL, NULL),
(5, 20, 'Erick', 'Garcia', 3, 15500.00, '2019-06-30', '555 123 4567', 'Ercik@gmail.com', 'Grupo Talento', NULL, NULL),
(6, 21, 'Juan ', 'Pérez Gómez', 1, 30000.00, '2024-10-31', '555 123 4568', 'juan.perez@gmail.com', 'Subcontrataciones Globales S.A.', NULL, NULL),
(7, 22, 'Carlos', 'García', 1, 44450.00, '2018-07-19', '449 338 2333', 'carlos@gmail.com', 'Manpower Group', NULL, NULL),
(8, 23, 'luisa Martinez', 'Gómez', 2, 15000.00, '2019-10-31', '555 234 5678', 'luisaMartinez@gmail.com', 'Adecco México', NULL, NULL),
(9, 24, 'María ', 'García López', 2, 10000.00, '2024-10-31', '555 234 5674', 'maria.garcia@gmail.com', 'Soluciones Integrales de Outsourcing', NULL, NULL),
(10, 25, 'Oliver', 'Diaz', 2, 99999999.99, '2024-10-28', '423 242 4524', 'asdfgauf@gmail.com', 'Alianzas de Servicios Globales', NULL, NULL),
(11, 26, 'José Hernández', 'Pérez', 1, 30500.00, '2017-10-31', '555 345 6789', 'JosePerez@gmail.com', 'Randstad México', NULL, NULL),
(12, 27, 'Javier Oliver ', 'Hernández Diaz', 2, 12000.00, '2024-10-30', '423 245 2234', 'OliverDiaz@gmail.com', 'Expertos en Outsourcing', NULL, NULL),
(13, 28, 'Luis Angel', 'Moreno Ruiz', 3, 20000.00, '2024-10-25', '449 425 2454', 'Luisangel@gmail.com', 'Asesoría Integral de Servicios', NULL, NULL),
(14, 29, 'Jorge Ramírez', 'Díaz', 1, 31000.00, '2020-07-25', '555 789 0199', 'jorgeRamirez@gmail.com', ' Korn Ferry México', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidencia`
--

CREATE TABLE `incidencia` (
  `folio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_tipo_incidencia` int(11) NOT NULL,
  `clasificacion_incidencia` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `hora` time DEFAULT NULL,
  `id_status_incidencia` int(11) NOT NULL,
  `id_administardor` int(11) DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `evidencia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `incidencia`
--

INSERT INTO `incidencia` (`folio`, `id_usuario`, `id_tipo_incidencia`, `clasificacion_incidencia`, `descripcion`, `fecha`, `hora`, `id_status_incidencia`, `id_administardor`, `asunto`, `evidencia`) VALUES
(1, 3, 2, 7, 'Se metió Mauricio a mi casa a comer', '2024-05-07', '00:00:00', 1, NULL, 'invasión a propiedad', '\\imagenes\\imagenesIncidencia\\1717625837807.jpg'),
(2, 8, 6, 18, 'El día de ayer me atendieron de mala gana solo por por que pregunte sobre los servicios que me brinden y no me respondieron y me atendieron grosero', '2024-10-30', '00:00:00', 1, NULL, 'Por atención al cliente', NULL),
(3, 14, 1, 1, 'Ayer en la tarde se fue la luz en toda la colonia y sigue sin regresar', '2024-10-31', '00:00:00', 1, NULL, 'se fue la luz en toda la colonia', NULL),
(4, 19, 3, 8, 'Hoy pasaba por la calle illinois a las 12:30 pm y note que los focos de las farolas no estaban prendidos', '2024-11-02', '00:00:00', 1, NULL, 'Focos de farolas fundidos por la calle Illinois', NUll),
(5, 17, 1, 1, ' El sistema de refrigeración no está funcionando correctamente, lo que pone en riesgo los servidores.', '2024-10-29', '00:00:00', 1, NULL, 'Fallo en el sistema de refrigeración en el Departamento de IT', null),
(6, 15, 4, 11, 'Los empleados han reportado ruidos constantes debido a obras nocturnas en la zona. Esto está afectando la productividad.', '2024-11-06', '00:00:00', 1, 2, 'Ruidos molestos durante la noche por obras cercana', null),
(7, 16, 1, 1, ' Las luces de la oficina principal no encienden correctamente, lo que dificulta el trabajo de los empleados.', '2024-11-02', '00:00:00', 1, 2, 'Problema con la iluminación en el área de oficinas', null),
(8, 6, 3, 10, 'Solicitud para fumigar el departamento debido a la presencia de insectos.', '2024-11-01', '00:00:00', 1, 2, 'Solicitud de fumigación', NULL),
(9, 18, 2, 6, ' El sistema de cámaras en el estacionamiento no está funcionando correctamente, lo que aumenta el riesgo de incidentes.', '2024-10-29', '00:00:00', 1, 2, 'Fallo en el sistema de cámaras de seguridad en el estacionamiento', NULL),
(10, 9, 5, 16, 'Solicitud de limpieza adicional en el salón de eventos.', '2024-10-23', '00:00:00', 1, 2, 'Solicitud de limpieza en la sala', NULL),
(11, 10, 1, 2, 'Reporte de un goteo de agua en la tubería de la cocina del departamento.', '2024-10-18', '00:00:00', 1, 2, 'Goteo en la cocina', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mes`
--

CREATE TABLE `mes` (
  `mes` int(11) NOT NULL,
  `descripcion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `mes`
--

INSERT INTO `mes` (`mes`, `descripcion`) VALUES
(1, 'Enero'),
(2, 'Febrero'),
(3, 'Marzo'),
(4, 'Abril'),
(5, 'Mayo'),
(6, 'Junio'),
(7, 'Julio'),
(8, 'Agosto'),
(9, 'Septiembre'),
(10, 'Octubre'),
(11, 'Noviembre'),
(12, 'Diciembre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `folio` int(11) NOT NULL,
  `id_propiedad` int(11) NOT NULL,
  `importe` float NOT NULL,
  `recargo` float NOT NULL,
  `año` int(11) NOT NULL,
  `mes` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `tipo_pago` int(20) NOT NULL,
  `numero_recibo` int(11) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `evidencia` text DEFAULT NULL,
  `id_administrador` int(11) DEFAULT NULL,
  `id_plazo` int(11) DEFAULT NULL,
  `Cancelado_Activo` varchar(20) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`folio`, `id_propiedad`, `importe`, `recargo`, `año`, `mes`, `fecha`, `tipo_pago`, `numero_recibo`, `referencia`, `evidencia`, `id_administrador`, `id_plazo`, `Cancelado_Activo`) VALUES
(1, 1, 800, 0, 2024, 1, '2024-09-11', 1, 1, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1, 'Activo'),
(2, 1, 800, 0, 2024, 2, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1, 'Activo'),
(3, 1, 800, 0, 2024, 3, '2024-09-11', 1, 3, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1, 'Activo'),
(4, 1, 800, 0, 2024, 4, '2024-09-11', 1, 4, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1, 'Activo'),
(5, 1, 800, 0, 2024, 5, '2024-09-11', 1, 5, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1, 'Activo'),
(6, 1, 800, 0, 2024, 6, '2024-09-11', 1, 6, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1, 'Activo'),
(7, 1, 800, 200, 2024, 7, '2024-09-11', 1, 7, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, NULL, 'Activo'),
(8, 1, 800, 200, 2024, 8, '2024-09-11', 1, 8, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, NULL, 'Activo'),
(9, 1, 800, 200, 2024, 9, '2024-09-11', 1, 9, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, NULL, 'Activo'),
(10, 2, 500, 0, 2024, 1, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', NULL, NULL, 'Activo'),
(11, 2, 500, 0, 2024, 2, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', NULL, NULL, 'Activo'),
(12, 2, 500, 0, 2024, 3, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', NULL, NULL, 'Activo'),
(13, 2, 500, 0, 2024, 4, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', NULL, NULL, 'Activo'),
(14, 2, 500, 0, 2024, 5, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', NULL, NULL, 'Activo'),
(15, 2, 500, 0, 2024, 6, '2024-09-11', 1, NULL, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', NULL, NULL, 'Activo'),
(16, 1, 800, 200, 2024, 10, '2024-09-11', 1, 10, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 2, 'Activo'),
(17, 1, 800, 0, 2024, 11, '2024-09-11', 1, 11, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 2, 'Activo'),
(18, 1, 800, 0, 2024, 12, '2024-09-11', 1, 12, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, NULL, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_plazos`
--

CREATE TABLE `pago_plazos` (
  `folio` int(11) NOT NULL,
  `mes_inicio` int(11) NOT NULL,
  `año_Inicio` int(11) NOT NULL,
  `mes_final` int(11) NOT NULL,
  `año_final` int(11) NOT NULL,
  `id_propiedad` int(11) NOT NULL,
  `id_tipo_pago` int(11) NOT NULL,
  `importe` float NOT NULL,
  `recargo` float NOT NULL,
  `numero_recibo` varchar(255) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `fecha` date NOT NULL,
  `id_administrador` int(11) DEFAULT NULL,
  `comprobante` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `pago_plazos`
--

INSERT INTO `pago_plazos` (`folio`, `mes_inicio`, `año_Inicio`, `mes_final`, `año_final`, `id_propiedad`, `id_tipo_pago`, `importe`, `recargo`, `numero_recibo`, `referencia`, `fecha`, `id_administrador`, `comprobante`) VALUES
(1, 1, 2024, 6, 2024, 1, 2, 4800, 0, '12', '3456 7890 1234', '2024-09-11', 2, '/imagenes/imagenesPago/1717619209683.jpg'),
(2, 10, 2024, 11, 2024, 1, 2, 1600, 400, '12', '3456 7890 1234', '2024-09-11', 2, '/imagenes/imagenesPago/1717619209683.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedad`
--

CREATE TABLE `propiedad` (
  `id_propiedad` int(11) NOT NULL,
  `id_usuario` int(20) DEFAULT NULL,
  `descripcion` varchar(100) NOT NULL,
  `id_tipo_propiedad` int(20) NOT NULL,
  `fecha_anexo` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `propiedad`
--

INSERT INTO `propiedad` (`id_propiedad`, `id_usuario`, `descripcion`, `id_tipo_propiedad`, `fecha_anexo`) VALUES
(1, 3, 'Av Perseo 301, Primo Verdad Inegi, 20267 Aguascalientes, Ags.', 1, '2024-01-01'),
(2, 3, '230 Ana María Díaz de León Escobedo', 2, '2024-01-01'),
(3, NULL, 'Calle Falsa 123, Ciudad Inventada', 3, NULL),
(4, NULL, 'Calle Sin Rumbo No. 123, Colonia Espejismo, Ciudad del Olvido, CP 00000, México', 1, NULL),
(5, NULL, 'Avenida Desvío Infinito No. 789, Fraccionamiento Espectral, Pueblo Fantasía, CP 22222, México', 1, NULL),
(6, NULL, 'Calle García Márquez, 45 Colonia Lomas Verdes Ciudad de México, CP 53700 México', 1, NULL),
(7, NULL, 'Pasaje de la Nada No. 101, Colonia Fantasma, Ciudad Sin Nombre, CP 33333, México', 3, NULL),
(8, NULL, 'Bulevar del Viento Errante No. 202, Residencial Ilusión, Villa de los Desaparecidos, CP 44444, Méxic', 3, NULL),
(9, NULL, 'Sendero del Espejismo No. 303, Colinas del Engaño, Rancho Invisible, CP 55555, México', 3, NULL),
(10, NULL, 'Vereda del Desvarío No. 404, Fraccionamiento Olvido, Ciudad Ilusoria, CP 66666, México', 3, NULL),
(11, NULL, 'Callejón del Sin Fin No. 505, Colonia Perpetua, Pueblo de la Quimera, CP 77777, México', 1, NULL),
(12, NULL, 'Paseo del Engaño No. 606, Residencial Mirage, Ciudad Inexistente, CP 88888, México', 3, NULL),
(13, NULL, 'Camino de los Desvanecidos No. 707, Barrio Sombras, Villa Fantasma, CP 99999, México', 2, NULL),
(14, NULL, 'Avenida de los Sueños Rotos No. 808, Fraccionamiento Imaginario, Pueblo Perdido, CP 12345, México', 2, NULL),
(15, NULL, 'Ruta del Eco Perdido No. 909, Barrio Silencio, Ciudad del Vacio, CP 10101, México', 3, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento`
--

CREATE TABLE `seguimiento` (
  `folio` int(11) NOT NULL,
  `movimiento` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `comentario` text NOT NULL,
  `id_status_seguimiento` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `evidencia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `seguimiento`
--

INSERT INTO `seguimiento` (`folio`, `movimiento`, `id_empleado`, `comentario`, `id_status_seguimiento`, `fecha`, `hora`, `evidencia`) VALUES
(1, 1, 4, 'Se llaman a las autoridades.', 2, '2024-05-08', '00:00:00', NULL),
(1, 2, 4, 'Se arrestó de manera brusca.', 3, '2024-05-08', '00:00:00', '\\imagenes\\imagenesSeguimiento\\1717643978162.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `status`
--

CREATE TABLE `status` (
  `id_status` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `status`
--

INSERT INTO `status` (`id_status`, `descripcion`) VALUES
(1, 'Pendiente'),
(2, 'Inactivo'),
(3, 'Suspendido'),
(4, 'Activo'),
(5, 'Baja');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `status_incidencia`
--

CREATE TABLE `status_incidencia` (
  `id_status_incidencia` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `status_incidencia`
--

INSERT INTO `status_incidencia` (`id_status_incidencia`, `descripcion`) VALUES
(1, 'Pendiente'),
(2, 'En proceso'),
(3, 'Resuelto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `status_seguimiento`
--

CREATE TABLE `status_seguimiento` (
  `id_status_seguimiento` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `status_seguimiento`
--

INSERT INTO `status_seguimiento` (`id_status_seguimiento`, `descripcion`) VALUES
(1, 'Pendiente'),
(2, 'En proceso'),
(3, 'Resuelto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_empleado`
--

CREATE TABLE `tipo_empleado` (
  `id_tipo_empleado` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `salario` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_empleado`
--

INSERT INTO `tipo_empleado` (`id_tipo_empleado`, `descripcion`, `salario`) VALUES
(1, 'Administrador', 30000),
(2, 'Vigilante', 10000),
(3, 'Plomero', 15000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_incidencia`
--

CREATE TABLE `tipo_incidencia` (
  `id_tipo_incidencia` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_incidencia`
--

INSERT INTO `tipo_incidencia` (`id_tipo_incidencia`, `descripcion`) VALUES
(0, 'Otro'),
(1, 'Mantenimiento'),
(2, 'Seguridad'),
(3, 'Servicios'),
(4, 'Quejas de vecinos'),
(5, 'Áreas comunes'),
(6, 'Problemas administrativos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `id_tipo_pago` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `precio` float DEFAULT NULL,
  `recargo` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_pago`
--

INSERT INTO `tipo_pago` (`id_tipo_pago`, `descripcion`, `precio`, `recargo`) VALUES
(1, 'Cuota', NULL, NULL),
(2, 'Cuota extraordinaria', 1100, 400);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_propiedad`
--

CREATE TABLE `tipo_propiedad` (
  `id_tipo_propiedad` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `pago` float NOT NULL,
  `recargo` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_propiedad`
--

INSERT INTO `tipo_propiedad` (`id_tipo_propiedad`, `descripcion`, `pago`, `recargo`) VALUES
(1, 'casa', 800, 200),
(2, 'terreno', 500, 150),
(3, 'departamento', 750, 250),
(4, 'Local Comercial', 1000, 350),
(5, 'Cabaña', 500, 200),
(6, 'Penthouse', 1200, 450),
(7, 'Departamento Estándar ', 900, 300);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(20) NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`id_tipo_usuario`, `descripcion`) VALUES
(0, 'Sin tipo'),
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Condomino '),
(4, 'Empleado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo_usuario` int(20) NOT NULL,
  `status` int(20) NOT NULL,
  `telefono` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `correo_electronico`, `password`, `tipo_usuario`, `status`, `telefono`) VALUES
(0, 'Sin persona', 'SinCorreo@gmail.com', 'Sin contraseña', 0, 2, '000 000 0000'),
(1, 'Super Administrador', 'superAdm@gmail.com', '$2b$12$aXt.urKj5OgRLGnATTloj.siVIgmasf7uCVdWndWHyK/raktqif3a', 1, 4, '449 429 9878'),
(2, 'Ivan', 'IvanSebastian@gmail.com', '$2b$12$1SGgp4REQ8oF178B55IgfeEzFvx4gD2L1wAH6lQTW5dANqBN8X8SK', 2, 4, '449 223 9955'),
(3, 'Gael', 'GaelGabriel@gmail.com', '$2b$12$cZp3DQIUwFj8rKttO3lxC.CdFzpCvQeSE7TsMgup6iYb2osX/GMZ.', 3, 4, '449 107 7654'),
(4, 'Isaac', 'IsaacGallegos@gmail.com', '$2b$12$x12.RpNjleTnslNzHs7S3eKPGbzjuVxnyj72rWrrXR12T5zTEzCIK', 4, 4, '449 568 6105'),
(5, 'Odette', 'ReginaOdette@gmail.com', '$2b$12$NW7UbFZy20tqgoZ5xztNhO.2.OzItFkLe9W.I2iN5/0KQAEUtoOVm', 2, 4, '351 304 6049'),
(6, 'Martin Contreras', 'martin.contreras.romo@cetis155.edu.mx', '$2b$12$FiY7dY.GKsNP5nF9xq1JweJp57FwkBJ09fgxiS5pjz5AGfDWopgLG', 3, 4, '449 555 8755'),
(7, 'Ian', 'ianYeshua@gmail.com', '$2b$12$mNtF3BfNJpMah78Dyw93i.CQYrF/tD6h7jscGgBuxtb/R4mImlqpy', 4, 4, '449 429 6282'),
(8, 'LopezGarcia', 'LopezGarcia@gmail.com', '$2b$12$8zvs7lxKpQuku71ZNKU0Eu.rr8kjCn76Q7kqwGGb0WagqDq500GNK', 3, 4, '449 115 8901'),
(9, 'hugo', 'hugo@cetis155.edu.mx', '$2b$12$mdCy6dpPZ9KW1Aw.1aZ3iOwShkkmNn7IJGc/cdW5gJQGYb35bMtli', 3, 4, '449 032 2115'),
(10, 'Juan Pablo', 'JuanPablo@gmail.com', '$2b$12$k8x0/O3fFh0gGHXUzXFk3.QbFrVOkQFl9MHlW9dFQ1Cb7mgds8l2G', 3, 4, '558 212 1212'),
(11, 'Juan Sebastian', 'juanSebas@gmail.com', '$2b$12$w0R1l.ybfnpaLzdglNSQKOIdnvjZVvSn1WA5SI2PXoWu0KRyoFBMi', 3, 4, '449 012 4343'),
(12, 'Patricia Gómez Aguirre', 'PatriciaGA@gmail.com', '$2b$12$jtyoNswX1TO9KArp.eZOAeH3sGJh1VcNTXqSLGwP73gnuFmUnqzo.', 3, 4, '449 202 1023'),
(13, 'Hernandez Lopez', 'Hernandez@cetis155.edu.mx', '$2b$12$znCF1n0RnC8qJCvR8pHJC.H3LLwFMon/b1HoYjyBMZh04FExZuX4C', 3, 4, '449 032 9338'),
(14, 'Jose Alexis', 'Jose@gmail.com', '$2b$12$8ALN6b3DKFPkKhPJex/Uk.1ZIZ7MbSCTfreFirAAFkjPZAmgOY366', 3, 3, '449 183 3899'),
(15, 'luis', 'luis@gmail.com', '$2b$12$fi7P/qEouRGdVWKQkjwdIexj/fYxZ7gjOCg.vxlLyrHpW1XyNeUMe', 3, 1, '449 827 2722'),
(16, 'Julio César Chávez', 'julioBox@gmail.com', '$2b$12$dIoPWA0yfCCSFqS0VE3KRuUGk7GLL/D2QapZ.VjXgE/V.3MKRQfnG', 3, 4, '449 238 2119'),
(17, 'Rebeca Aguilar Peréz', 'RRaguilar@gmail.com', '$2b$12$rQxA05wza4ILvUT2oBoaxOss81a5QaoT9lX7/GiKB9SQLo1Mjz3t2', 3, 4, '499 021 2023'),
(18, 'Josefa Solorio Ruíz', 'Ruizjose@hotmail.com', '$2b$12$J.OCwSgpVwqDR3HHV3l4t.XZGyiHxFEfHt.vq266M2K/TcvSOsOhS', 3, 2, '440 332 0112'),
(19, 'Lorena Ramírez Guzmán ', 'Guz83@gmail.com', '$2b$12$57G3yKAAmc3sh9tpcGhgCOE4QYN36BWplzKocMIQm25T1GtZ9P9Wm', 3, 5, '449 530 2022'),
(20, 'Erick', 'Ercik@gmail.com', 'Cgt$2024@', 4, 1, '555 123 4567'),
(21, 'Juan ', 'juan.perez@gmail.com', 'JuAn1234.', 4, 1, '555 123 4568'),
(22, 'Carlos', 'carlos@gmail.com', 'Chsysu7.&', 4, 1, '449 338 2333'),
(23, 'luisa Martinez', 'luisaMartinez@gmail.com', 'Amg#9876!', 4, 1, '555 234 5678'),
(24, 'María ', 'maria.garcia@gmail.com', 'MaRiA5678.', 4, 1, '555 234 5674'),
(25, 'Oliver', 'asdfgauf@gmail.com', 'O23452adf#4', 4, 1, '423 242 4524'),
(26, 'José Hernández', 'JosePerez@gmail.com', 'Jhp@3210$', 4, 1, '555 345 6789'),
(27, 'Javier Oliver ', 'OliverDiaz@gmail.com', 'Oliver343#$$', 4, 1, '423 245 2234'),
(28, 'Luis Angel', 'Luisangel@gmail.com', 'LuisAngel5434#4', 4, 1, '449 425 2454'),
(29, 'Jorge Ramírez', 'jorgeRamirez@gmail.com', 'cm$6374&A', 4, 1, '555 789 0199');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clasificacion_incidencia`
--
ALTER TABLE `clasificacion_incidencia`
  ADD PRIMARY KEY (`id_clasificacion_incidencia`),
  ADD KEY `FK_tipo_incidencia_clasificacion` (`tipo_incidencia`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `FK_usuario` (`id_usuario`),
  ADD KEY `FK_tipo_empleado` (`tipo_empleado`);

--
-- Indices de la tabla `incidencia`
--
ALTER TABLE `incidencia`
  ADD PRIMARY KEY (`folio`),
  ADD KEY `FK_usuarios_incidencia` (`id_usuario`),
  ADD KEY `FK_administrador_incidencia` (`id_administardor`),
  ADD KEY `FK_incidencias_tipo` (`id_tipo_incidencia`),
  ADD KEY `FK_clasificacion_incidencia_base` (`clasificacion_incidencia`),
  ADD KEY `FK_incidencias_status` (`id_status_incidencia`);

--
-- Indices de la tabla `mes`
--
ALTER TABLE `mes`
  ADD PRIMARY KEY (`mes`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`folio`),
  ADD KEY `FK_propiedad_pago` (`id_propiedad`),
  ADD KEY `FK_usuarios_mes` (`mes`),
  ADD KEY `FK_usuarios_administrador` (`id_administrador`),
  ADD KEY `FK_plazo` (`id_plazo`),
  ADD KEY `FK_pago_tipo_pago` (`tipo_pago`);

--
-- Indices de la tabla `pago_plazos`
--
ALTER TABLE `pago_plazos`
  ADD PRIMARY KEY (`folio`),
  ADD KEY `FK_usuarios_administradorPlazo` (`id_administrador`),
  ADD KEY `FK_pago_tipo_pago_plazos` (`id_tipo_pago`),
  ADD KEY `FK_plazos_propiedad` (`id_propiedad`);

--
-- Indices de la tabla `propiedad`
--
ALTER TABLE `propiedad`
  ADD PRIMARY KEY (`id_propiedad`),
  ADD KEY `FK_uasuario` (`id_usuario`),
  ADD KEY `FK_propiedad_tipo` (`id_tipo_propiedad`);

--
-- Indices de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD KEY `FK_status_seguimiento` (`id_status_seguimiento`);

--
-- Indices de la tabla `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_status`);

--
-- Indices de la tabla `status_incidencia`
--
ALTER TABLE `status_incidencia`
  ADD PRIMARY KEY (`id_status_incidencia`);

--
-- Indices de la tabla `status_seguimiento`
--
ALTER TABLE `status_seguimiento`
  ADD PRIMARY KEY (`id_status_seguimiento`);

--
-- Indices de la tabla `tipo_empleado`
--
ALTER TABLE `tipo_empleado`
  ADD PRIMARY KEY (`id_tipo_empleado`);

--
-- Indices de la tabla `tipo_incidencia`
--
ALTER TABLE `tipo_incidencia`
  ADD PRIMARY KEY (`id_tipo_incidencia`);

--
-- Indices de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`id_tipo_pago`);

--
-- Indices de la tabla `tipo_propiedad`
--
ALTER TABLE `tipo_propiedad`
  ADD PRIMARY KEY (`id_tipo_propiedad`);

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`id_tipo_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `FK_usuarios_tipo` (`tipo_usuario`),
  ADD KEY `FK_usuarios_status` (`status`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clasificacion_incidencia`
--
ALTER TABLE `clasificacion_incidencia`
  MODIFY `id_clasificacion_incidencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id_empleado` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `incidencia`
--
ALTER TABLE `incidencia`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `pago_plazos`
--
ALTER TABLE `pago_plazos`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `propiedad`
--
ALTER TABLE `propiedad`
  MODIFY `id_propiedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `status`
--
ALTER TABLE `status`
  MODIFY `id_status` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `status_incidencia`
--
ALTER TABLE `status_incidencia`
  MODIFY `id_status_incidencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `status_seguimiento`
--
ALTER TABLE `status_seguimiento`
  MODIFY `id_status_seguimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_empleado`
--
ALTER TABLE `tipo_empleado`
  MODIFY `id_tipo_empleado` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_incidencia`
--
ALTER TABLE `tipo_incidencia`
  MODIFY `id_tipo_incidencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `id_tipo_pago` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_propiedad`
--
ALTER TABLE `tipo_propiedad`
  MODIFY `id_tipo_propiedad` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clasificacion_incidencia`
--
ALTER TABLE `clasificacion_incidencia`
  ADD CONSTRAINT `FK_tipo_incidencia_clasificacion` FOREIGN KEY (`tipo_incidencia`) REFERENCES `tipo_incidencia` (`id_tipo_incidencia`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `FK_tipo_empleado` FOREIGN KEY (`tipo_empleado`) REFERENCES `tipo_empleado` (`id_tipo_empleado`),
  ADD CONSTRAINT `FK_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `incidencia`
--
ALTER TABLE `incidencia`
  ADD CONSTRAINT `FK_administrador_incidencia` FOREIGN KEY (`id_administardor`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `FK_clasificacion_incidencia_base` FOREIGN KEY (`clasificacion_incidencia`) REFERENCES `clasificacion_incidencia` (`id_clasificacion_incidencia`),
  ADD CONSTRAINT `FK_incidencias_status` FOREIGN KEY (`id_status_incidencia`) REFERENCES `status_incidencia` (`id_status_incidencia`),
  ADD CONSTRAINT `FK_incidencias_tipo` FOREIGN KEY (`id_tipo_incidencia`) REFERENCES `tipo_incidencia` (`id_tipo_incidencia`),
  ADD CONSTRAINT `FK_usuarios_incidencia` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FK_pago_tipo_pago` FOREIGN KEY (`tipo_pago`) REFERENCES `tipo_pago` (`id_tipo_pago`),
  ADD CONSTRAINT `FK_plazo` FOREIGN KEY (`id_plazo`) REFERENCES `pago_plazos` (`folio`),
  ADD CONSTRAINT `FK_propiedad_pago` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  ADD CONSTRAINT `FK_usuarios_administrador` FOREIGN KEY (`id_administrador`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `FK_usuarios_mes` FOREIGN KEY (`mes`) REFERENCES `mes` (`mes`);

--
-- Filtros para la tabla `pago_plazos`
--
ALTER TABLE `pago_plazos`
  ADD CONSTRAINT `FK_pago_tipo_pago_plazos` FOREIGN KEY (`id_tipo_pago`) REFERENCES `tipo_pago` (`id_tipo_pago`),
  ADD CONSTRAINT `FK_plazos_propiedad` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  ADD CONSTRAINT `FK_usuarios_administradorPlazo` FOREIGN KEY (`id_administrador`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `propiedad`
--
ALTER TABLE `propiedad`
  ADD CONSTRAINT `FK_propiedad_tipo` FOREIGN KEY (`id_tipo_propiedad`) REFERENCES `tipo_propiedad` (`id_tipo_propiedad`),
  ADD CONSTRAINT `FK_uasuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD CONSTRAINT `FK_status_seguimiento` FOREIGN KEY (`id_status_seguimiento`) REFERENCES `status_seguimiento` (`id_status_seguimiento`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_usuarios_status` FOREIGN KEY (`status`) REFERENCES `status` (`id_status`),
  ADD CONSTRAINT `FK_usuarios_tipo` FOREIGN KEY (`tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
