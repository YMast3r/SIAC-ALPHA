-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-04-2024 a las 00:30:05
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
-- Estructura de tabla para la tabla `mes`
--

CREATE TABLE `mes` (
  `mes` int(11) NOT NULL,
  `descripcion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id_usuario` int(11) NOT NULL,
  `importe` float NOT NULL,
  `recargo` float NOT NULL,
  `año` int(11) NOT NULL,
  `mes` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_administrador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`folio`, `id_usuario`, `importe`, `recargo`, `año`, `mes`, `fecha`, `id_administrador`) VALUES
(1, 3, 600, 0, 2024, 1, '2024/04/03', 2),
(2, 3, 600, 0, 2024, 2, '2024/04/04', 2),
(3, 3, 600, 0, 2024, 3, '2024/04/04', 2),
(4, 3, 600, 0, 2024, 4, '2024/04/05', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedad`
--

CREATE TABLE `propiedad` (
  `id_propiedad` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `tipo_propiedad` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `propiedad`
--

INSERT INTO `propiedad` (`id_propiedad`, `descripcion`, `tipo_propiedad`) VALUES
(1, 'pendiente', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `status`
--

CREATE TABLE `status` (
  `id_status` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Estructura de tabla para la tabla `tipo_propiedad`
--

CREATE TABLE `tipo_propiedad` (
  `id_tipo_propiedad` int(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_propiedad`
--

INSERT INTO `tipo_propiedad` (`id_tipo_propiedad`, `descripcion`) VALUES
(1, 'casa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(20) NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `propiedad` int(11) DEFAULT NULL,
  `telefono` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `correo_electronico`, `password`, `tipo_usuario`, `status`, `propiedad`, `telefono`) VALUES
(1, 'Super Administrador', 'superAdm@gmail.com', '$2b$12$aXt.urKj5OgRLGnATTloj.siVIgmasf7uCVdWndWHyK/raktqif3a', 1, 4, NULL, '449 429 6282'),
(2, 'Ivan', 'IvanSebastian@gmail.com', '$2b$12$1SGgp4REQ8oF178B55IgfeEzFvx4gD2L1wAH6lQTW5dANqBN8X8SK', 2, 4, NULL, '449 223 9955'),
(3, 'Gael', 'GaelGabriel@gmail.com', '$2b$12$cZp3DQIUwFj8rKttO3lxC.CdFzpCvQeSE7TsMgup6iYb2osX/GMZ.', 3, 4, NULL, '449 107 7654'),
(4, 'Isaac', 'IsaacGallegos@gmail.com', '$2b$12$x12.RpNjleTnslNzHs7S3eKPGbzjuVxnyj72rWrrXR12T5zTEzCIK', 4, 4, NULL, '449 568 6105'),
(5, 'Regina', 'ReginaOdette@gmail.com', '$2b$12$BWXyCuiBEGPQSPYCCSbD/OqPyHifeURoDVlFXf.59Uh6Zow5fCFVy', 2, 4, NULL, '351 304 6049'),
(6, 'Mar', 'marlne@gmail.com', '$2b$12$7Fff2WKw7GEtESTEPVkvh.kmIgyCynpqYFoz7ciVWhhW0tUXuWcFC', 2, 4, NULL, '449 539 6287'),
(7, 'Ian', 'ianYeshua@gmail.com', '$2b$12$mNtF3BfNJpMah78Dyw93i.CQYrF/tD6h7jscGgBuxtb/R4mImlqpy', 2, 4, NULL, '444 444 4444');
--
-- Índices para tablas volcadas
--

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
  ADD KEY `FK_usuarios_pago` (`id_usuario`),
  ADD KEY `FK_usuarios_mes` (`mes`),
  ADD KEY `FK_usuarios_administrador` (`id_administrador`);

--
-- Indices de la tabla `propiedad`
--
ALTER TABLE `propiedad`
  ADD PRIMARY KEY (`id_propiedad`),
  ADD KEY `FK_propiedad_tipo` (`tipo_propiedad`);

--
-- Indices de la tabla `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_status`);

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
  ADD KEY `FK_usuarios_propiedad` (`propiedad`),
  ADD KEY `FK_usuarios_status` (`status`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `folio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `propiedad`
--
ALTER TABLE `propiedad`
  MODIFY `id_propiedad` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `status`
--
ALTER TABLE `status`
  MODIFY `id_status` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_propiedad`
--
ALTER TABLE `tipo_propiedad`
  MODIFY `id_tipo_propiedad` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FK_usuarios_administrador` FOREIGN KEY (`id_administrador`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `FK_usuarios_mes` FOREIGN KEY (`mes`) REFERENCES `mes` (`mes`),
  ADD CONSTRAINT `FK_usuarios_pago` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `propiedad`
--
ALTER TABLE `propiedad`
  ADD CONSTRAINT `FK_propiedad_tipo` FOREIGN KEY (`tipo_propiedad`) REFERENCES `tipo_propiedad` (`id_tipo_propiedad`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_usuarios_propiedad` FOREIGN KEY (`propiedad`) REFERENCES `propiedad` (`id_propiedad`),
  ADD CONSTRAINT `FK_usuarios_status` FOREIGN KEY (`status`) REFERENCES `status` (`id_status`),
  ADD CONSTRAINT `FK_usuarios_tipo` FOREIGN KEY (`tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
