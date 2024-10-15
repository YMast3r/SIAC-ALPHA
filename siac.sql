-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-10-2024 a las 01:55:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

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
-- Estructura de tabla para la tabla `incidencia`
--

CREATE TABLE `incidencia` (
  `folio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_tipo_incidencia` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `id_status_incidencia` int(11) NOT NULL,
  `id_administardor` int(11) DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `evidencia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `incidencia`
--

INSERT INTO `incidencia` (`folio`, `id_usuario`, `id_tipo_incidencia`, `descripcion`, `fecha`, `id_status_incidencia`, `id_administardor`, `asunto`, `evidencia`) VALUES
(1, 3, 2, 'Se metió Mauricio a mi casa a comer', '2024-05-07', 1, 2, 'invasión a propiedad', '\\imagenes\\imagenesIncidencia\\1717625837807.jpg');

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
(3, 'marzo'),
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
  `id_plazo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`folio`, `id_propiedad`, `importe`, `recargo`, `año`, `mes`, `fecha`, `tipo_pago`, `numero_recibo`, `referencia`, `evidencia`, `id_administrador`, `id_plazo`) VALUES
(1, 1, 800, 100, 2024, 1, '2024-09-11', 2, 1, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1),
(2, 1, 800, 100, 2024, 2, '2024-09-11', 2, 2, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1),
(3, 1, 800, 100, 2024, 3, '2024-09-11', 2, 3, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1),
(4, 1, 800, 100, 2024, 4, '2024-09-11', 2, 4, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1),
(5, 1, 800, 100, 2024, 5, '2024-09-11', 2, 5, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1),
(6, 1, 800, 100, 2024, 6, '2024-09-11', 2, 6, '3456 7890 1234', '/imagenes/imagenesPago/1717619209683.jpg', 2, 1);

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
(1, 1, 2024, 6, 2024, 1, 2, 4800, 600, '12', '3456 7890 1234', '2024-09-11', 2, '/imagenes/imagenesPago/1717619209683.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedad`
--

CREATE TABLE `propiedad` (
  `id_propiedad` int(11) NOT NULL,
  `id_usuario` int(20) DEFAULT NULL,
  `descripcion` varchar(100) NOT NULL,
  `id_tipo_propiedad` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `propiedad`
--

INSERT INTO `propiedad` (`id_propiedad`, `id_usuario`, `descripcion`, `id_tipo_propiedad`) VALUES
(1, 3, 'Av Perseo 301, Primo Verdad Inegi, 20267 Aguascalientes, Ags.', 1),
(2, NULL, '230 Ana María Díaz de León Escobedo', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento`
--

CREATE TABLE `seguimiento` (
  `folio` int(11) NOT NULL,
  `movimiento` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `id_status_seguimiento` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `evidencia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `seguimiento`
--

INSERT INTO `seguimiento` (`folio`, `movimiento`, `id_empleado`, `comentario`, `id_status_seguimiento`, `fecha`, `evidencia`) VALUES
(1, 1, 4, 'Se llaman a las autoridades.', 2, '2024-05-08', NULL),
(1, 2, 4, 'Se arrestó de manera brusca.', 3, '2024-05-08', '\\imagenes\\imagenesSeguimiento\\1717643978162.jpeg');

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
(1, 'mantenimiento'),
(2, 'seguridad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `id_tipo_pago` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `precio` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_pago`
--

INSERT INTO `tipo_pago` (`id_tipo_pago`, `descripcion`, `precio`) VALUES
(1, 'Cuota', NULL),
(2, 'Recargo', NULL),
(3, 'Cuota extraordinaria', 1100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_propiedad`
--

CREATE TABLE `tipo_propiedad` (
  `id_tipo_propiedad` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `pago` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tipo_propiedad`
--

INSERT INTO `tipo_propiedad` (`id_tipo_propiedad`, `descripcion`, `pago`) VALUES
(1, 'casa', 800),
(2, 'terreno', 500),
(3, 'departamento', 750);

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
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Condomino '),
(4, 'Vigilante');

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
(1, 'Super Administrador', 'superAdm@gmail.com', '$2b$12$aXt.urKj5OgRLGnATTloj.siVIgmasf7uCVdWndWHyK/raktqif3a', 1, 4, '449 429 6282'),
(2, 'Ivan', 'IvanSebastian@gmail.com', '$2b$12$1SGgp4REQ8oF178B55IgfeEzFvx4gD2L1wAH6lQTW5dANqBN8X8SK', 2, 4, '449 223 9955'),
(3, 'Gael', 'GaelGabriel@gmail.com', '$2b$12$cZp3DQIUwFj8rKttO3lxC.CdFzpCvQeSE7TsMgup6iYb2osX/GMZ.', 3, 4, '449 107 7654'),
(4, 'Isaac', 'IsaacGallegos@gmail.com', '$2b$12$x12.RpNjleTnslNzHs7S3eKPGbzjuVxnyj72rWrrXR12T5zTEzCIK', 4, 4, '449 568 6105'),
(5, 'Odette', 'ReginaOdette@gmail.com', '$2b$12$NW7UbFZy20tqgoZ5xztNhO.2.OzItFkLe9W.I2iN5/0KQAEUtoOVm', 2, 4, '351 304 6049'),
(6, 'Angel', 'AngelUriel@gmail.com', '$2b$12$7Fff2WKw7GEtESTEPVkvh.kmIgyCynpqYFoz7ciVWhhW0tUXuWcFC', 3, 4, '449 539 6287'),
(7, 'Ian', 'ianYeshua@gmail.com', '$2b$12$mNtF3BfNJpMah78Dyw93i.CQYrF/tD6h7jscGgBuxtb/R4mImlqpy', 2, 4, '444 444 4444');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `incidencia`
--
ALTER TABLE `incidencia`
  ADD PRIMARY KEY (`folio`),
  ADD KEY `FK_usuarios_incidencia` (`id_usuario`),
  ADD KEY `FK_administrador_incidencia` (`id_administardor`),
  ADD KEY `FK_incidencias_tipo` (`id_tipo_incidencia`),
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
  ADD KEY `FK_id_plazo` (`id_plazo`),
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
  ADD KEY `FK_id_uasuario` (`id_usuario`),
  ADD KEY `FK_propiedad_tipo` (`id_tipo_propiedad`);

--
-- Indices de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD KEY `fk_status_seguimiento` (`id_status_seguimiento`);

--
-- Indices de la tabla `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_status`);

--
-- Indices de la tabla `status_incidencia`
--
ALTER TABLE `status_incidencia`
  ADD PRIMARY KEY (`id_status_incidencia`),
  ADD KEY `idx_id_status_incidencia` (`id_status_incidencia`);

--
-- Indices de la tabla `status_seguimiento`
--
ALTER TABLE `status_seguimiento`
  ADD PRIMARY KEY (`id_status_seguimiento`),
  ADD KEY `idx_id_status_seguimiento` (`id_status_seguimiento`);

--
-- Indices de la tabla `tipo_incidencia`
--
ALTER TABLE `tipo_incidencia`
  ADD PRIMARY KEY (`id_tipo_incidencia`),
  ADD KEY `idx_id_tipo_incidencia` (`id_tipo_incidencia`);

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
-- AUTO_INCREMENT de la tabla `incidencia`
--
ALTER TABLE `incidencia`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pago_plazos`
--
ALTER TABLE `pago_plazos`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `propiedad`
--
ALTER TABLE `propiedad`
  MODIFY `id_propiedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT de la tabla `tipo_incidencia`
--
ALTER TABLE `tipo_incidencia`
  MODIFY `id_tipo_incidencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `id_tipo_pago` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_propiedad`
--
ALTER TABLE `tipo_propiedad`
  MODIFY `id_tipo_propiedad` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `incidencia`
--
ALTER TABLE `incidencia`
  ADD CONSTRAINT `FK_administrador_incidencia` FOREIGN KEY (`id_administardor`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `FK_incidencias_status` FOREIGN KEY (`id_status_incidencia`) REFERENCES `status_incidencia` (`id_status_incidencia`),
  ADD CONSTRAINT `FK_incidencias_tipo` FOREIGN KEY (`id_tipo_incidencia`) REFERENCES `tipo_incidencia` (`id_tipo_incidencia`),
  ADD CONSTRAINT `FK_usuarios_incidencia` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FK_id_plazo` FOREIGN KEY (`id_plazo`) REFERENCES `pago_plazos` (`folio`),
  ADD CONSTRAINT `FK_pago_tipo_pago` FOREIGN KEY (`tipo_pago`) REFERENCES `tipo_pago` (`id_tipo_pago`),
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
  ADD CONSTRAINT `FK_id_uasuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `FK_propiedad_tipo` FOREIGN KEY (`id_tipo_propiedad`) REFERENCES `tipo_propiedad` (`id_tipo_propiedad`);

--
-- Filtros para la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD CONSTRAINT `fk_status_seguimiento` FOREIGN KEY (`id_status_seguimiento`) REFERENCES `status_seguimiento` (`id_status_seguimiento`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_usuarios_status` FOREIGN KEY (`status`) REFERENCES `status` (`id_status`),
  ADD CONSTRAINT `FK_usuarios_tipo` FOREIGN KEY (`tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
