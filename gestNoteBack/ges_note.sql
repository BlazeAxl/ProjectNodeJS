-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 29 avr. 2025 à 06:21
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ges_note`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `nom`, `email`, `password`, `role`) VALUES
(1, 'admin1', 'yvanmoko3@gmail.com', '$2b$10$6Ohuqj/ev5.TxyuhLVuutuulac4/p2r4p3hlCly.3b1refWjTVi9.', 1);

-- --------------------------------------------------------

--
-- Structure de la table `assignation`
--

DROP TABLE IF EXISTS `assignation`;
CREATE TABLE IF NOT EXISTS `assignation` (
  `id_assign` int NOT NULL AUTO_INCREMENT,
  `id_cour` int DEFAULT NULL,
  `id_enseignant` int DEFAULT NULL,
  `id_fil` int DEFAULT NULL,
  `id_mod` int DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id_assign`),
  KEY `id_cour` (`id_cour`,`id_enseignant`),
  KEY `id_enseignant` (`id_enseignant`),
  KEY `id_fil` (`id_fil`),
  KEY `id_mod` (`id_mod`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `assignation`
--

INSERT INTO `assignation` (`id_assign`, `id_cour`, `id_enseignant`, `id_fil`, `id_mod`, `date`) VALUES
(1, 2, 1, NULL, NULL, '0000-00-00');

-- --------------------------------------------------------

--
-- Structure de la table `classe`
--

DROP TABLE IF EXISTS `classe`;
CREATE TABLE IF NOT EXISTS `classe` (
  `id_classe` int NOT NULL AUTO_INCREMENT,
  `label_class` varchar(250) NOT NULL,
  PRIMARY KEY (`id_classe`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `classe`
--

INSERT INTO `classe` (`id_classe`, `label_class`) VALUES
(1, 'CF-145');

-- --------------------------------------------------------

--
-- Structure de la table `cour`
--

DROP TABLE IF EXISTS `cour`;
CREATE TABLE IF NOT EXISTS `cour` (
  `id_cour` int NOT NULL AUTO_INCREMENT,
  `label_cour` varchar(250) NOT NULL,
  `duree` int NOT NULL,
  `credit` int NOT NULL,
  `id_module` int NOT NULL,
  `id_filiere` int NOT NULL,
  PRIMARY KEY (`id_cour`),
  KEY `id_module` (`id_module`,`id_filiere`),
  KEY `id_filiere` (`id_filiere`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cour`
--

INSERT INTO `cour` (`id_cour`, `label_cour`, `duree`, `credit`, `id_module`, `id_filiere`) VALUES
(2, 'JavaPOO', 18, 3, 1, 5);

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

DROP TABLE IF EXISTS `departement`;
CREATE TABLE IF NOT EXISTS `departement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `departement`
--

INSERT INTO `departement` (`id`, `nom`) VALUES
(1, '3IAC'),
(2, 'ICIA');

-- --------------------------------------------------------

--
-- Structure de la table `enseignant`
--

DROP TABLE IF EXISTS `enseignant`;
CREATE TABLE IF NOT EXISTS `enseignant` (
  `code` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_departement` int DEFAULT NULL,
  `type` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'T',
  PRIMARY KEY (`code`),
  KEY `id_departement` (`id_departement`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `enseignant`
--

INSERT INTO `enseignant` (`code`, `nom`, `email`, `password`, `id_departement`, `type`) VALUES
(1, 'NKONJOH', 'Armel237@gmail.com', '$2b$10$N9Ha6.1DwEl08G.cvZr1peeKfNKpd9XTrZPOLQ2FDk1JV1c/j6GB.', 1, 'T');

-- --------------------------------------------------------

--
-- Structure de la table `etudiant`
--

DROP TABLE IF EXISTS `etudiant`;
CREATE TABLE IF NOT EXISTS `etudiant` (
  `id_etud` int NOT NULL AUTO_INCREMENT,
  `matricule` varchar(250) NOT NULL,
  `nom` varchar(250) NOT NULL,
  `prenom` varchar(250) NOT NULL,
  `sexe` varchar(6) NOT NULL,
  `date_naiss` date NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tel` int NOT NULL,
  `email_parent` varchar(250) NOT NULL,
  `id_filiere` int NOT NULL,
  `niveau` int NOT NULL,
  `id_classe` int DEFAULT NULL,
  `role` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_etud`),
  KEY `id_classe` (`id_classe`),
  KEY `id_filiere` (`id_filiere`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `etudiant`
--

INSERT INTO `etudiant` (`id_etud`, `matricule`, `nom`, `prenom`, `sexe`, `date_naiss`, `email`, `password`, `tel`, `email_parent`, `id_filiere`, `niveau`, `id_classe`, `role`) VALUES
(1, 'IUC22E0079995', 'NTUMSI', 'Audrey', 'F', '2004-07-31', 'yvanmoko6@gmail.com', '$2b$10$lj.WLo5CTxLSo7.lSQ2rU.CMOgKYJSbE4r5drysjaqgjCLFU0wq/K', 654458996, 'SiaBram3@gmail.com', 2, 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `evaluation`
--

DROP TABLE IF EXISTS `evaluation`;
CREATE TABLE IF NOT EXISTS `evaluation` (
  `id_eva` int NOT NULL AUTO_INCREMENT,
  `id_type` int NOT NULL,
  `date` date NOT NULL,
  `id_cour` int NOT NULL,
  `id_filiere` int NOT NULL,
  PRIMARY KEY (`id_eva`),
  KEY `id_cour` (`id_cour`),
  KEY `id_filiere` (`id_filiere`),
  KEY `id_type` (`id_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filiere`
--

DROP TABLE IF EXISTS `filiere`;
CREATE TABLE IF NOT EXISTS `filiere` (
  `id_filiere` int NOT NULL AUTO_INCREMENT,
  `nom_fil` varchar(250) NOT NULL,
  `id_departement` int DEFAULT NULL,
  PRIMARY KEY (`id_filiere`),
  KEY `id_departement` (`id_departement`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `filiere`
--

INSERT INTO `filiere` (`id_filiere`, `nom_fil`, `id_departement`) VALUES
(1, 'TI-PAM', 1),
(2, 'GL', 1),
(3, 'LIPRO', 1),
(4, 'GSI', 1),
(5, 'DLW', 1);

-- --------------------------------------------------------

--
-- Structure de la table `module`
--

DROP TABLE IF EXISTS `module`;
CREATE TABLE IF NOT EXISTS `module` (
  `id_mod` int NOT NULL AUTO_INCREMENT,
  `nom_module` varchar(250) NOT NULL,
  `coef_module` int NOT NULL,
  `id_filiere` int NOT NULL,
  PRIMARY KEY (`id_mod`),
  KEY `id_filiere` (`id_filiere`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `module`
--

INSERT INTO `module` (`id_mod`, `nom_module`, `coef_module`, `id_filiere`) VALUES
(1, 'Developpement', 30, 5);

-- --------------------------------------------------------

--
-- Structure de la table `note`
--

DROP TABLE IF EXISTS `note`;
CREATE TABLE IF NOT EXISTS `note` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_filiere` int NOT NULL,
  `type_evaluation` int NOT NULL,
  `id_cour` int NOT NULL,
  `id_etudiant` int NOT NULL,
  `note` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_evaluation` (`type_evaluation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `requette`
--

DROP TABLE IF EXISTS `requette`;
CREATE TABLE IF NOT EXISTS `requette` (
  `id_req` int NOT NULL AUTO_INCREMENT,
  `intitule` varchar(250) NOT NULL,
  `justification` varchar(250) NOT NULL,
  `heure_depot` time NOT NULL,
  `date_depot` date NOT NULL,
  `id_etud` int NOT NULL,
  `statut` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_req`),
  KEY `id_etud` (`id_etud`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_evaluation`
--

DROP TABLE IF EXISTS `type_evaluation`;
CREATE TABLE IF NOT EXISTS `type_evaluation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `type_evaluation`
--

INSERT INTO `type_evaluation` (`id`, `type`) VALUES
(1, 'CC'),
(2, 'SN');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `assignation`
--
ALTER TABLE `assignation`
  ADD CONSTRAINT `assignation_ibfk_1` FOREIGN KEY (`id_enseignant`) REFERENCES `enseignant` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignation_ibfk_2` FOREIGN KEY (`id_cour`) REFERENCES `cour` (`id_cour`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignation_ibfk_3` FOREIGN KEY (`id_fil`) REFERENCES `filiere` (`id_filiere`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignation_ibfk_4` FOREIGN KEY (`id_mod`) REFERENCES `module` (`id_mod`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `cour`
--
ALTER TABLE `cour`
  ADD CONSTRAINT `cour_ibfk_1` FOREIGN KEY (`id_module`) REFERENCES `module` (`id_mod`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cour_ibfk_2` FOREIGN KEY (`id_filiere`) REFERENCES `filiere` (`id_filiere`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD CONSTRAINT `enseignant_ibfk_1` FOREIGN KEY (`id_departement`) REFERENCES `departement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `etudiant`
--
ALTER TABLE `etudiant`
  ADD CONSTRAINT `etudiant_ibfk_1` FOREIGN KEY (`id_classe`) REFERENCES `classe` (`id_classe`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `etudiant_ibfk_2` FOREIGN KEY (`id_filiere`) REFERENCES `filiere` (`id_filiere`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`id_filiere`) REFERENCES `filiere` (`id_filiere`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`id_cour`) REFERENCES `cour` (`id_cour`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`id_type`) REFERENCES `type_evaluation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `filiere`
--
ALTER TABLE `filiere`
  ADD CONSTRAINT `filiere_ibfk_1` FOREIGN KEY (`id_departement`) REFERENCES `departement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `module`
--
ALTER TABLE `module`
  ADD CONSTRAINT `module_ibfk_1` FOREIGN KEY (`id_filiere`) REFERENCES `filiere` (`id_filiere`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `note`
--
ALTER TABLE `note`
  ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`type_evaluation`) REFERENCES `type_evaluation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `requette`
--
ALTER TABLE `requette`
  ADD CONSTRAINT `requette_ibfk_1` FOREIGN KEY (`id_etud`) REFERENCES `etudiant` (`id_etud`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
