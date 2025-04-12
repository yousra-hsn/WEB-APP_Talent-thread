-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 17 juin 2024 à 17:12
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
  `ville` varchar(75) NOT NULL,
  `pays` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Adresse`
--

INSERT INTO `Adresse` (`id_add`, `num`, `rue`, `ville`, `pays`) VALUES
(1, 123, 'Rue de la République', 'Paris', 'France'),
(2, 456, 'Avenue des Champs-Élysées', 'Paris', 'France'),
(3, 789, 'Rue du Commerce', 'Lyon', 'France'),
(4, 321, 'Boulevard de la Liberté', 'Lille', 'France'),
(5, 654, 'Avenue de la Victoire', 'Nice', 'France'),
(6, 987, 'Rue de la Paix', 'Strasbourg', 'France'),
(7, 11, 'Place Bellecour', 'Lyon', 'France'),
(8, 22, 'Avenue de la Gare', 'Bordeaux', 'France'),
(9, 33, 'Boulevard des États-Unis', 'Lille', 'France'),
(10, 44, 'Rue des Écoles', 'Nantes', 'France'),
(13, 1, 'Rue de Test', 'Ville de Test', 'Pays de Test'),
(14, 21, 'Boulevard de la République', 'Marseille', 'France'),
(27, 43, 'Avenue Saint-Maxime', 'Montpellier', 'France');

-- --------------------------------------------------------

--
-- Structure de la table `Ajout_Organisation`
--

CREATE TABLE `Ajout_Organisation` (
  `siren` char(9) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `type` enum('association','EURL','SARL','SASU','autre_orga') NOT NULL,
  `num_ad` int(11) NOT NULL,
  `rue_ad` varchar(75) NOT NULL,
  `ville_ad` varchar(75) NOT NULL,
  `pays_ad` varchar(75) NOT NULL,
  `traitement` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Ajout_Organisation`
--

INSERT INTO `Ajout_Organisation` (`siren`, `nom`, `type`, `num_ad`, `rue_ad`, `ville_ad`, `pays_ad`, `traitement`) VALUES
('234567890', 'CompanyHas', 'SASU', 321, 'Boulevard de la Liberté', 'Lille', 'France', 1),
('234567891', 'Tech Innov', 'SARL', 11, 'Place Bellecour', 'Lyon', 'France', 1),
('234567892', 'Green Energy', 'EURL', 654, 'Avenue de la Victoire', 'Nice', 'France', 1),
('234567893', 'HealthCarePlus', 'SARL', 22, 'Avenue de la Gare', 'Bordeaux', 'France', 1),
('234567894', 'EduGlobal', 'association', 33, 'Boulevard des États-Unis', 'Lille', 'France', 1),
('333444555', 'StartupHub', 'SASU', 22, 'Avenue de la Gare', 'Bordeaux', 'France', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Candidate`
--

CREATE TABLE `Candidate` (
  `id_candidat` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `date_candidature` date DEFAULT NULL,
  `infos_supp` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Candidate`
--

INSERT INTO `Candidate` (`id_candidat`, `id_offre`, `date_candidature`, `infos_supp`) VALUES
(60, 17, '2024-06-16', ''),
(60, 18, '2024-06-13', NULL),
(60, 21, '2024-06-16', ''),
(60, 22, '2024-06-16', 'CV modifié'),
(61, 14, '2024-03-21', NULL),
(61, 19, '2024-06-14', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `Demande_A_Rejoindre`
--

CREATE TABLE `Demande_A_Rejoindre` (
  `id_candidat` int(11) NOT NULL,
  `id_organisation` char(9) NOT NULL,
  `date_demande` date NOT NULL,
  `traitement` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Demande_A_Rejoindre`
--

INSERT INTO `Demande_A_Rejoindre` (`id_candidat`, `id_organisation`, `date_demande`, `traitement`) VALUES
(32, '987654321', '2024-03-15', 1),
(33, '111222333', '2024-03-16', 1),
(34, '123456789', '2024-03-17', 1),
(55, '234567890', '2024-03-15', 1),
(57, '234567891', '2024-03-16', 0),
(58, '234567892', '2024-03-17', 0),
(61, '111222333', '2024-06-08', 0),
(61, '234567893', '2024-06-08', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Fiche_de_poste`
--

CREATE TABLE `Fiche_de_poste` (
  `id_fiche_de_poste` int(11) NOT NULL,
  `organisation` char(9) NOT NULL,
  `nom` varchar(75) NOT NULL,
  `statut_de_poste` enum('cadre','ETAM','autre_statut') NOT NULL,
  `resp_hierarchique` varchar(50) NOT NULL,
  `rythme_heures` int(11) NOT NULL,
  `teletravail_jours` int(11) NOT NULL,
  `salaire_min` int(11) NOT NULL,
  `salaire_max` int(11) NOT NULL,
  `description_mission` varchar(1000) NOT NULL,
  `nombre_offres` int(11) NOT NULL,
  `adresse` int(11) NOT NULL,
  `date_fin_validite` date NOT NULL
) ;

--
-- Déchargement des données de la table `Fiche_de_poste`
--

INSERT INTO `Fiche_de_poste` (`id_fiche_de_poste`, `organisation`, `nom`, `statut_de_poste`, `resp_hierarchique`, `rythme_heures`, `teletravail_jours`, `salaire_min`, `salaire_max`, `description_mission`, `nombre_offres`, `adresse`, `date_fin_validite`) VALUES
(4, '123456789', 'Développeur Web', 'cadre', 'Chef Technique', 35, 2, 30000, 45000, 'Développement et maintenance des applications web', 3, 1, '2024-07-16'),
(5, '987654321', 'Assistant Administratif', 'ETAM', 'Directeur Administratif', 35, 1, 25000, 35000, 'Assister l’équipe administrative dans ses tâches quotidiennes', 2, 3, '2024-07-16'),
(6, '111222333', 'Animateur Jeunesse', 'autre_statut', 'Directeur Général', 25, 0, 20000, 30000, 'Organisation d’activités et d’animations pour les jeunes', 1, 2, '2024-07-16'),
(7, '234567891', 'Pilote', 'cadre', 'Chef de Flotte', 30, 0, 50000, 70000, 'Pilotage et gestion des vols commerciaux', 1, 5, '2024-07-16'),
(8, '234567892', 'Technicien Informatique', 'ETAM', 'Responsable IT', 35, 2, 28000, 40000, 'Maintenance et support des systèmes informatiques', 2, 6, '2024-07-16'),
(9, '234567893', 'Ingénieur en Énergies Renouvelables', 'cadre', 'Chef de Projet', 35, 2, 35000, 55000, 'Développement de solutions énergétiques durables', 2, 7, '2024-07-16'),
(10, '234567890', 'Consultant Santé', 'cadre', 'Directeur Santé', 35, 1, 30000, 45000, 'Consultation et conseil en services de santé', 1, 8, '2024-07-16'),
(11, '234567893', 'Enseignant', 'ETAM', 'Directeur Pédagogique', 30, 0, 25000, 35000, 'Enseignement et suivi des élèves', 1, 9, '2024-07-16'),
(12, '234567893', 'Responsable Marketing', 'cadre', 'Directeur Marketing', 35, 1, 40000, 60000, 'Développement et mise en œuvre des stratégies marketing', 2, 10, '2024-07-16'),
(13, '234567890', 'Ingénieur Électrique', 'cadre', 'Chef de Projet', 40, 3, 40000, 60000, 'Conception et supervision des systèmes électriques', 2, 4, '2024-07-31'),
(14, '111222333', 'Assistante maternelle junior', 'autre_statut', 'Chef de service', 35, 0, 20000, 30000, 'Encadrement de groupes d\'enfants', 2, 6, '2024-07-16'),
(21, '111222333', 'Assistante maternelle', 'autre_statut', 'Directrice d\'établissement', 35, 0, 20000, 30000, 'Encadrement de groupe d\'enfants', 2, 10, '2024-07-16'),
(22, '111222333', 'Ingénieur full stack', 'cadre', 'CEO', 38, 2, 35000, 40000, 'Ingénieur full stack', 2, 1, '2024-07-16'),
(23, '111222333', 'Consultant Technique', 'cadre', 'Manager d\'équipe', 37, 2, 38000, 42000, 'Consultant technique logiciel', 1, 1, '2024-07-16'),
(24, '111222333', 'Consultant data', 'cadre', 'Manager d\'équipe', 37, 2, 38000, 42000, 'Consultant data', 1, 1, '2024-07-16'),
(25, '111222333', 'Data analyst', 'cadre', 'Manager d\'équipe', 38, 2, 38000, 42000, 'Data analyst', 1, 1, '2024-07-16'),
(26, '111222333', 'Ingénieur logiciel', 'cadre', 'Manager d\'équipe', 35, 3, 37000, 43000, 'LOGICIEL', 2, 6, '2024-07-07');

-- --------------------------------------------------------

--
-- Structure de la table `Offre`
--

CREATE TABLE `Offre` (
  `id_offre` int(11) NOT NULL,
  `fiche_de_poste` int(11) NOT NULL,
  `etat` enum('non_publiee','publiee','expiree') NOT NULL,
  `date_validite` date NOT NULL,
  `description_pieces` varchar(500) NOT NULL,
  `nombre_piece_obligatoire` int(11) NOT NULL,
  `recruteur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Offre`
--

INSERT INTO `Offre` (`id_offre`, `fiche_de_poste`, `etat`, `date_validite`, `description_pieces`, `nombre_piece_obligatoire`, `recruteur`) VALUES
(13, 4, 'expiree', '2024-06-06', 'CV et lettre de motivation', 2, 32),
(14, 5, 'expiree', '2024-03-25', 'CV uniquement', 1, 33),
(17, 6, 'publiee', '2024-08-01', 'CV et lettre de motivation', 2, 60),
(18, 4, 'publiee', '2024-08-08', 'CV', 1, 60),
(19, 4, 'publiee', '2024-07-12', 'lettre de motivation', 1, 34),
(21, 21, 'publiee', '2024-07-31', 'CV + lettre de motivation', 2, 60),
(22, 4, 'expiree', '2024-06-15', 'CV', 1, 60),
(24, 6, 'publiee', '2024-06-30', 'CV', 1, 33),
(25, 14, 'publiee', '2024-06-30', 'CV', 1, 33),
(27, 14, 'publiee', '2024-07-07', 'Lettre de motivation', 1, 33),
(28, 26, 'publiee', '2024-08-04', 'CV', 1, 33),
(30, 26, 'expiree', '2024-06-15', 'CV', 1, 60);

-- --------------------------------------------------------

--
-- Structure de la table `Organisation`
--

CREATE TABLE `Organisation` (
  `siren` char(9) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `type` enum('association','EURL','SARL','SASU','autre_orga') NOT NULL,
  `siege_social` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Organisation`
--

INSERT INTO `Organisation` (`siren`, `nom`, `type`, `siege_social`) VALUES
('111222333', 'Association ABCD', 'association', 2),
('123456789', 'Entreprise ABC', 'SASU', 1),
('234567845', 'Bioelec', 'EURL', 27),
('234567890', 'CompanyHas', 'SASU', 4),
('234567891', 'Tech Innov', 'SARL', 7),
('234567892', 'Green Energy', 'EURL', 5),
('234567893', 'HealthCarePlus', 'SARL', 8),
('234567894', 'EduGlobal', 'association', 9),
('383474815', 'Airplane', 'SARL', 14),
('987654321', 'Startup XYZ', 'SARL', 3);

-- --------------------------------------------------------

--
-- Structure de la table `Piece_jointe`
--

CREATE TABLE `Piece_jointe` (
  `id_piece_jointe` int(11) NOT NULL,
  `path` varchar(100) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `id_candidat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Piece_jointe`
--

INSERT INTO `Piece_jointe` (`id_piece_jointe`, `path`, `id_offre`, `id_candidat`) VALUES
(18, 'uploads\\18\\1718315275932.pdf', 18, 60),
(19, 'uploads\\19\\1718345778352.pdf', 19, 61),
(37, 'uploads\\17\\1718531906437.pdf', 17, 60),
(38, 'uploads\\21\\1718532230653.pdf', 21, 60);

-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id_user` int(11) NOT NULL,
  `adresse_mail` varchar(50) NOT NULL,
  `mot_de_passe` varchar(100) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `tel` char(10) NOT NULL,
  `date_creation` date NOT NULL,
  `actif` tinyint(1) NOT NULL,
  `type` enum('admin','candidat','recruteur') NOT NULL,
  `organisation` char(9) DEFAULT NULL
) ;

--
-- Déchargement des données de la table `Utilisateur`
--

INSERT INTO `Utilisateur` (`id_user`, `adresse_mail`, `mot_de_passe`, `nom`, `prenom`, `tel`, `date_creation`, `actif`, `type`, `organisation`) VALUES
(32, 'recrut.AXY@example.com', '$2b$10$31q.8NnaJ3DJSrSwnblDY.Eli.i.Wk5h7NR1g6Te5kmhyH7e1MNla', 'Alain', 'Salah', '0777348795', '2024-03-24', 1, 'recruteur', '987654321'),
(33, 'recrut.ABC@example.com', '$2b$10$Kueyv0fJN80d8Hzj3qa5YermBn4BRQjO/ksLU3XB1RSrBa4ITfCBK', 'Svalenska', 'Tatiana', '0777333460', '2024-03-24', 1, 'recruteur', '111222333'),
(34, 'recrut.ABCD@example.com', '$2b$10$APavG9fbClg8IaCVvWiMauAxB.urkWDbk8rN6GGOOPqiaWs.H5Ue.', 'Ha', 'Thuan', '0776789460', '2024-03-24', 1, 'recruteur', '123456789'),
(35, 'admin@example.com', '$2b$10$nLT9Un2iWiJlEzFVr7wqd.uUM0FeHJ5ZYyM.bRD6C4cY3Z0FF6.aO', 'Admin', 'Initial', '5551234567', '2024-03-24', 1, 'admin', NULL),
(36, 'j.dupont@example.com', '$2b$10$Q.IUWd76WPWE2oeRPO129.gtOhO2YPeW1.RGBzoJB3fp6CWUC/fRm', 'Dupont', 'Julie', '0756456646', '2024-03-24', 1, 'candidat', NULL),
(47, 'yousra.hassan@gmail.com', '$2b$10$dTSfFVObJsLW8OUByDwQpO8U.7KYbIDE/7zdpeMCAGMxTAAdppwmq', 'Hassan', 'Yousra', '0654353329', '2024-06-02', 1, 'admin', NULL),
(54, 'med.assaf@assoabc.pl', '$2b$10$W8IR2Z/7aK9avyiLO.UhZeRhXAwLQgoZ5gmq6ntCjUKVRSizAsqCu', 'Assaf', 'Mohamed', '0604057868', '2024-06-02', 1, 'admin', NULL),
(55, 'imene.benyagoub@etu.utc.fr', '$2b$10$.mdVQsV4Sszp1HOzGzmUhukXIgFrUe6g2YBLnlWY7cIHiwUog80Ra', 'Benyagoub', 'Imene', '0680808080', '2024-06-06', 1, 'recruteur', '123456789'),
(57, 'user.test89@gmail.com', '$2b$10$GQ6/du3rld.CKcy.A1RAaOk.tQxN12SM6r6srgY4lqGefFAeeZ7fK', 'User', 'Test', '0789898989', '2024-06-06', 1, 'candidat', NULL),
(58, 'joe.jones@gmail.com', '$2b$10$FynPbHIvRS6sAb6SIf5xfulpnSc39h4cKaI54Yvll76BVxmVQZEb.', 'Jones', 'Joe', '0680808080', '2024-06-06', 1, 'candidat', NULL),
(59, 'admin@admin.com', '$2b$10$M0qGQAt6M9oclIBGvqojcOnzqXmo1WpHIyZq./v52BS8rVmi3UhqC', 'Admin', 'Admin', '0667676767', '2024-06-08', 1, 'admin', NULL),
(60, 'recrut@recrut.com', '$2b$10$HNhdrGimaVlk5fvJUjd4aO8FI52kS8S9nRO24O0yTMzoef7C796Uu', 'Recrut', 'Recrut', '0667676767', '2024-06-08', 1, 'recruteur', '111222333'),
(61, 'candidat@candidat.com', '$2b$10$MdPHz8D4ivRqc1fIjYM8/.229md2YjW7F.ALqsOj8/5r/YMylXlja', 'Candidat', 'Candidat', '0654545454', '2024-06-08', 1, 'candidat', NULL),
(62, 'john.jackson@gmail.com', '$2b$10$iUysw3HHN8WN/IgxK/kAhOWft4.FKzE80NjLQ1RjFZNjb.eq5ZLyG', 'Jackson', 'John', '0787878787', '2024-06-13', 1, 'candidat', NULL),
(64, 'julie.jackson@gmail.com', '$2b$10$zpK3C0kQ99xQWRNXUJ247ewnOcq.lnb9zpR4qbxaxvyRNXj8ibZ72', 'Jackson', 'Julie', '0787878787', '2024-06-13', 1, 'candidat', NULL),
(65, 'salah.mohamed@outlook.fr', '$2b$10$MdLYLKGpCSzselgu49pwIepg1U6w9GL9hVaI2fh.G48JTy27mAjXe', 'Salah', 'Mohamed', '0123232323', '2024-06-13', 1, 'candidat', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Adresse`
--
ALTER TABLE `Adresse`
  ADD PRIMARY KEY (`id_add`);

--
-- Index pour la table `Ajout_Organisation`
--
ALTER TABLE `Ajout_Organisation`
  ADD PRIMARY KEY (`siren`);

--
-- Index pour la table `Candidate`
--
ALTER TABLE `Candidate`
  ADD PRIMARY KEY (`id_candidat`,`id_offre`),
  ADD KEY `Candidate_ibfk_2` (`id_offre`);

--
-- Index pour la table `Demande_A_Rejoindre`
--
ALTER TABLE `Demande_A_Rejoindre`
  ADD PRIMARY KEY (`id_candidat`,`id_organisation`),
  ADD KEY `Demande_A_Rejoindre_ibfk_2` (`id_organisation`);

--
-- Index pour la table `Fiche_de_poste`
--
ALTER TABLE `Fiche_de_poste`
  ADD PRIMARY KEY (`id_fiche_de_poste`),
  ADD KEY `Fiche_de_poste_ibfk_1` (`organisation`),
  ADD KEY `Fiche_de_poste_ibfk_2` (`adresse`);

--
-- Index pour la table `Offre`
--
ALTER TABLE `Offre`
  ADD PRIMARY KEY (`id_offre`),
  ADD KEY `Offre_ibfk_2` (`recruteur`),
  ADD KEY `Offre_ibfk_1` (`fiche_de_poste`);

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
  ADD UNIQUE KEY `unique_path` (`path`),
  ADD KEY `fk_piece_jointe_candidature` (`id_offre`,`id_candidat`);

--
-- Index pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `adresse_mail` (`adresse_mail`),
  ADD KEY `organisation` (`organisation`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Fiche_de_poste`
--
ALTER TABLE `Fiche_de_poste`
  MODIFY `id_fiche_de_poste` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Offre`
--
ALTER TABLE `Offre`
  MODIFY `id_offre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `Piece_jointe`
--
ALTER TABLE `Piece_jointe`
  MODIFY `id_piece_jointe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

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
  ADD CONSTRAINT `Candidate_ibfk_1` FOREIGN KEY (`id_candidat`) REFERENCES `Utilisateur` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `Candidate_ibfk_2` FOREIGN KEY (`id_offre`) REFERENCES `Offre` (`id_offre`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Demande_A_Rejoindre`
--
ALTER TABLE `Demande_A_Rejoindre`
  ADD CONSTRAINT `Demande_A_Rejoindre_ibfk_1` FOREIGN KEY (`id_candidat`) REFERENCES `Utilisateur` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `Demande_A_Rejoindre_ibfk_2` FOREIGN KEY (`id_organisation`) REFERENCES `Organisation` (`siren`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Fiche_de_poste`
--
ALTER TABLE `Fiche_de_poste`
  ADD CONSTRAINT `Fiche_de_poste_ibfk_1` FOREIGN KEY (`organisation`) REFERENCES `Organisation` (`siren`) ON DELETE CASCADE,
  ADD CONSTRAINT `Fiche_de_poste_ibfk_2` FOREIGN KEY (`adresse`) REFERENCES `Adresse` (`id_add`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Offre`
--
ALTER TABLE `Offre`
  ADD CONSTRAINT `Offre_ibfk_1` FOREIGN KEY (`fiche_de_poste`) REFERENCES `Fiche_de_poste` (`id_fiche_de_poste`) ON DELETE CASCADE,
  ADD CONSTRAINT `Offre_ibfk_2` FOREIGN KEY (`recruteur`) REFERENCES `Utilisateur` (`id_user`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Organisation`
--
ALTER TABLE `Organisation`
  ADD CONSTRAINT `Organisation_ibfk_1` FOREIGN KEY (`siege_social`) REFERENCES `Adresse` (`id_add`);

--
-- Contraintes pour la table `Piece_jointe`
--
ALTER TABLE `Piece_jointe`
  ADD CONSTRAINT `fk_piece_jointe_candidature` FOREIGN KEY (`id_offre`,`id_candidat`) REFERENCES `Candidate` (`id_offre`, `id_candidat`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD CONSTRAINT `Utilisateur_ibfk_1` FOREIGN KEY (`organisation`) REFERENCES `Organisation` (`siren`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
