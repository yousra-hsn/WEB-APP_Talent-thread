-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : dim. 24 mars 2024 à 11:53
-- Version du serveur :  10.5.19-MariaDB-0+deb11u2
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sr10p043`
--

-- --------------------------------------------------------

--
-- Structure de la table `Adresse`
--

CREATE TABLE `Adresse` (
  `id_add` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `rue` varchar(75) DEFAULT NULL,
  `ville` varchar(75) DEFAULT NULL,
  `pays` varchar(75) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Adresse`
--

INSERT INTO `Adresse` (`id_add`, `num`, `rue`, `ville`, `pays`) VALUES
(1, 123, 'Rue de la République', 'Paris', 'France'),
(2, 456, 'Avenue des Champs-Élysées', 'Paris', 'France'),
(3, 789, 'Rue du Commerce', 'Lyon', 'France');

-- --------------------------------------------------------

--
-- Structure de la table `Candidate`
--

CREATE TABLE `Candidate` (
  `id_candidat` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `id_fiche_de_poste` int(11) NOT NULL,
  `date_candidature` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Candidate`
--

INSERT INTO `Candidate` (`id_candidat`, `id_offre`, `id_fiche_de_poste`, `date_candidature`) VALUES
(36, 13, 4, '2024-03-20'),
(36, 14, 5, '2024-03-21'),
(36, 15, 6, '2024-03-22');

-- --------------------------------------------------------

--
-- Structure de la table `Demande_A_Rejoindre`
--

CREATE TABLE `Demande_A_Rejoindre` (
  `id_candidat` int(11) NOT NULL,
  `id_organisation` char(9) NOT NULL,
  `date_demande` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Demande_A_Rejoindre`
--

INSERT INTO `Demande_A_Rejoindre` (`id_candidat`, `id_organisation`, `date_demande`) VALUES
(32, '987654321', '2024-03-15'),
(33, '111222333', '2024-03-16'),
(34, '123456789', '2024-03-17');

-- --------------------------------------------------------

--
-- Structure de la table `Fiche_de_poste`
--

CREATE TABLE `Fiche_de_poste` (
  `id_fiche_de_poste` int(11) NOT NULL,
  `organisation` char(9) DEFAULT NULL,
  `nom` varchar(75) DEFAULT NULL,
  `statut_de_poste` enum('cadre','ETAM','autre_statut') DEFAULT NULL,
  `resp_hierarchique` varchar(50) DEFAULT NULL,
  `rythme_heures` int(11) DEFAULT NULL,
  `teletravail_jours` int(11) DEFAULT NULL,
  `salaire_min` int(11) DEFAULT NULL,
  `salaire_max` int(11) DEFAULT NULL,
  `description_mission` varchar(1000) DEFAULT NULL,
  `duree_validite_jours` int(11) DEFAULT NULL,
  `nombre_offres` int(11) DEFAULT NULL,
  `adresse` int(11) NOT NULL
) ;

--
-- Déchargement des données de la table `Fiche_de_poste`
--

INSERT INTO `Fiche_de_poste` (`id_fiche_de_poste`, `organisation`, `nom`, `statut_de_poste`, `resp_hierarchique`, `rythme_heures`, `teletravail_jours`, `salaire_min`, `salaire_max`, `description_mission`, `duree_validite_jours`, `nombre_offres`, `adresse`) VALUES
(4, '123456789', 'Développeur Web', 'cadre', 'Chef Technique', 35, 2, 30000, 45000, 'Développement et maintenance des applications web', 30, 3, 1),
(5, '987654321', 'Assistant Administratif', 'ETAM', 'Directeur Administratif', 35, 1, 25000, 35000, 'Assister l’équipe administrative dans ses tâches quotidiennes', 30, 2, 3),
(6, '111222333', 'Animateur Jeunesse', 'autre_statut', 'Directeur Général', 25, 0, 20000, 30000, 'Organisation d’activités et d’animations pour les jeunes', 30, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `Offre`
--

CREATE TABLE `Offre` (
  `id_offre` int(11) NOT NULL,
  `fiche_de_poste` int(11) DEFAULT NULL,
  `etat` enum('non_publiee','publiee','expiree') NOT NULL,
  `date_validite` date DEFAULT NULL,
  `description_pieces` varchar(500) DEFAULT NULL,
  `nombre_piece_obligatoire` int(11) DEFAULT NULL,
  `recruteur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Offre`
--

INSERT INTO `Offre` (`id_offre`, `fiche_de_poste`, `etat`, `date_validite`, `description_pieces`, `nombre_piece_obligatoire`, `recruteur`) VALUES
(13, 4, 'publiee', '2024-03-30', 'CV et lettre de motivation', 2, 32),
(14, 5, 'expiree', '2024-03-25', 'CV uniquement', 1, 33),
(15, 6, 'non_publiee', NULL, 'CV et lettre de recommandation', 2, 34);

-- --------------------------------------------------------

--
-- Structure de la table `Organisation`
--

CREATE TABLE `Organisation` (
  `siren` char(9) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `type` enum('association','EURL','SARL','SASU','autre_orga') DEFAULT NULL,
  `siege_social` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Organisation`
--

INSERT INTO `Organisation` (`siren`, `nom`, `type`, `siege_social`) VALUES
('111222333', 'Association ABCD', 'association', 2),
('123456789', 'Entreprise ABC', 'SASU', 1),
('987654321', 'Startup XYZ', 'SARL', 3);

-- --------------------------------------------------------

--
-- Structure de la table `Piece_jointe`
--

CREATE TABLE `Piece_jointe` (
  `id_piece_jointe` int(11) NOT NULL,
  `id_candidat` int(11) DEFAULT NULL,
  `id_offre` int(11) DEFAULT NULL,
  `id_fiche_de_poste` int(11) DEFAULT NULL,
  `categorie` enum('cv','lettre_motivation','lettre_recommandation','autre') DEFAULT NULL,
  `format` enum('pdf','txt','doc','autre_format') DEFAULT NULL,
  `path` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Piece_jointe`
--

INSERT INTO `Piece_jointe` (`id_piece_jointe`, `id_candidat`, `id_offre`, `id_fiche_de_poste`, `categorie`, `format`, `path`) VALUES
(13, 36, 13, 4, 'cv', 'pdf', '/chemin/vers/cv_john_doe.pdf'),
(14, 36, 14, 5, 'cv', 'pdf', '/chemin/vers/cv_jane_smith.pdf'),
(15, 36, 14, 5, 'lettre_motivation', 'pdf', '/chemin/vers/lettre_motivation.pdf');

-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id_user` int(11) NOT NULL,
  `adresse_mail` varchar(50) NOT NULL,
  `mot_de_passe` varchar(50) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `tel` char(10) DEFAULT NULL,
  `date_creation` date DEFAULT NULL,
  `actif` tinyint(1) DEFAULT NULL,
  `type` enum('admin','candidat','recruteur') NOT NULL,
  `organisation` char(9) DEFAULT NULL
) ;

--
-- Déchargement des données de la table `Utilisateur`
--

INSERT INTO `Utilisateur` (`id_user`, `adresse_mail`, `mot_de_passe`, `nom`, `prenom`, `tel`, `date_creation`, `actif`, `type`, `organisation`) VALUES
(32, 'recrut.AXY@example.com', 'MdpPro23@', 'Alain', 'Salah', '0777348795', '2024-03-24', 1, 'recruteur', '123456789'),
(33, 'recrut.ABC@example.com', 'Jerecrute&', 'Svalenska', 'Tatiana', '0777333460', '2024-03-24', 1, 'recruteur', '987654321'),
(34, 'recrut.ABCD@example.com', 'Talentfinder0305', 'Ha', 'Thuan', '0776789460', '2024-03-24', 1, 'recruteur', '111222333'),
(35, 'admin@example.com', 'adminpass', 'Admin', 'Super', '5551234567', '2024-03-24', 1, 'admin', NULL),
(36, 'j.dupont@example.com', 'julie556', 'Dupont', 'Julie', '0756456646', '2024-03-24', 1, 'candidat', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Adresse`
--
ALTER TABLE `Adresse`
  ADD PRIMARY KEY (`id_add`);

--
-- Index pour la table `Candidate`
--
ALTER TABLE `Candidate`
  ADD PRIMARY KEY (`id_candidat`,`id_offre`,`id_fiche_de_poste`),
  ADD KEY `id_offre` (`id_offre`),
  ADD KEY `id_fiche_de_poste` (`id_fiche_de_poste`);

--
-- Index pour la table `Demande_A_Rejoindre`
--
ALTER TABLE `Demande_A_Rejoindre`
  ADD PRIMARY KEY (`id_candidat`,`id_organisation`),
  ADD KEY `id_organisation` (`id_organisation`);

--
-- Index pour la table `Fiche_de_poste`
--
ALTER TABLE `Fiche_de_poste`
  ADD PRIMARY KEY (`id_fiche_de_poste`),
  ADD KEY `organisation` (`organisation`),
  ADD KEY `adresse` (`adresse`);

--
-- Index pour la table `Offre`
--
ALTER TABLE `Offre`
  ADD PRIMARY KEY (`id_offre`),
  ADD KEY `fiche_de_poste` (`fiche_de_poste`),
  ADD KEY `recruteur` (`recruteur`);

--
-- Index pour la table `Organisation`
--
ALTER TABLE `Organisation`
  ADD PRIMARY KEY (`siren`),
  ADD UNIQUE KEY `nom` (`nom`),
  ADD UNIQUE KEY `siege_social` (`siege_social`);

--
-- Index pour la table `Piece_jointe`
--
ALTER TABLE `Piece_jointe`
  ADD PRIMARY KEY (`id_piece_jointe`),
  ADD KEY `id_candidat` (`id_candidat`,`id_offre`,`id_fiche_de_poste`);

--
-- Index pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `adresse_mail` (`adresse_mail`),
  ADD UNIQUE KEY `mot_de_passe` (`mot_de_passe`),
  ADD KEY `organisation` (`organisation`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Adresse`
--
ALTER TABLE `Adresse`
  MODIFY `id_add` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `Fiche_de_poste`
--
ALTER TABLE `Fiche_de_poste`
  MODIFY `id_fiche_de_poste` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Offre`
--
ALTER TABLE `Offre`
  MODIFY `id_offre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `Piece_jointe`
--
ALTER TABLE `Piece_jointe`
  MODIFY `id_piece_jointe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Candidate`
--
ALTER TABLE `Candidate`
  ADD CONSTRAINT `Candidate_ibfk_1` FOREIGN KEY (`id_candidat`) REFERENCES `Utilisateur` (`id_user`),
  ADD CONSTRAINT `Candidate_ibfk_2` FOREIGN KEY (`id_offre`) REFERENCES `Offre` (`id_offre`),
  ADD CONSTRAINT `Candidate_ibfk_3` FOREIGN KEY (`id_fiche_de_poste`) REFERENCES `Fiche_de_poste` (`id_fiche_de_poste`);

--
-- Contraintes pour la table `Demande_A_Rejoindre`
--
ALTER TABLE `Demande_A_Rejoindre`
  ADD CONSTRAINT `Demande_A_Rejoindre_ibfk_1` FOREIGN KEY (`id_candidat`) REFERENCES `Utilisateur` (`id_user`),
  ADD CONSTRAINT `Demande_A_Rejoindre_ibfk_2` FOREIGN KEY (`id_organisation`) REFERENCES `Organisation` (`siren`);

--
-- Contraintes pour la table `Fiche_de_poste`
--
ALTER TABLE `Fiche_de_poste`
  ADD CONSTRAINT `Fiche_de_poste_ibfk_1` FOREIGN KEY (`organisation`) REFERENCES `Organisation` (`siren`),
  ADD CONSTRAINT `Fiche_de_poste_ibfk_2` FOREIGN KEY (`adresse`) REFERENCES `Adresse` (`id_add`);

--
-- Contraintes pour la table `Offre`
--
ALTER TABLE `Offre`
  ADD CONSTRAINT `Offre_ibfk_1` FOREIGN KEY (`fiche_de_poste`) REFERENCES `Fiche_de_poste` (`id_fiche_de_poste`),
  ADD CONSTRAINT `Offre_ibfk_2` FOREIGN KEY (`recruteur`) REFERENCES `Utilisateur` (`id_user`);

--
-- Contraintes pour la table `Organisation`
--
ALTER TABLE `Organisation`
  ADD CONSTRAINT `Organisation_ibfk_1` FOREIGN KEY (`siege_social`) REFERENCES `Adresse` (`id_add`);

--
-- Contraintes pour la table `Piece_jointe`
--
ALTER TABLE `Piece_jointe`
  ADD CONSTRAINT `Piece_jointe_ibfk_1` FOREIGN KEY (`id_candidat`,`id_offre`,`id_fiche_de_poste`) REFERENCES `Candidate` (`id_candidat`, `id_offre`, `id_fiche_de_poste`);

--
-- Contraintes pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD CONSTRAINT `Utilisateur_ibfk_1` FOREIGN KEY (`organisation`) REFERENCES `Organisation` (`siren`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
