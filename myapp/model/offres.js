var db = require('./db.js');

module.exports = {
    // Lire toutes les offres
    readall: function (callback) {
        db.query("SELECT * FROM Offre", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Lire une offre par ID
    readById: function(id_offre, callback) {
        const query = `SELECT * FROM Offre o
                    JOIN Fiche_de_poste f
                    WHERE o.fiche_de_poste = f.id_fiche_de_poste
                    AND id_offre = ?`;
        const data = [id_offre];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(new Error('Offer not found'), null);
            }
            return callback(null, results[0]);
        });
    },

    readAllWithDetails: function(callback) {
        let sql = 'SELECT o.*, \
                fp.id_fiche_de_poste, fp.nom AS fiche_nom, fp.rythme_heures, fp.salaire_min, fp.salaire_max, fp.description_mission, \
                a.num AS adresse_num, a.rue AS adresse_rue, a.ville AS adresse_ville, a.pays AS adresse_pays,  \
                org.nom AS organisation_nom \
                FROM Offre o \
                JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste \
                JOIN Adresse a ON fp.adresse = a.id_add \
                JOIN Organisation org ON fp.organisation = org.siren \
                WHERE o.etat = "publiee" AND o.date_validite > NOW()';

        db.query(sql, function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readAllWithDetailsById: function(id, callback) {
        let sql = `SELECT o.*, 
                fp.*, 
                a.num AS adresse_num, a.rue AS adresse_rue, a.ville AS adresse_ville, a.pays AS adresse_pays, 
                org.nom AS organisation_nom, org.siren AS siren 
                FROM Offre o 
                JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste 
                JOIN Adresse a ON fp.adresse = a.id_add 
                JOIN Organisation org ON fp.organisation = org.siren 
                WHERE o.etat = "publiee" AND o.date_validite > NOW() AND o.id_offre = ?`;
    
        db.query(sql, [id], function(err, results) {
            if (err) {
                console.error('Database query error:', err);
                return callback(err);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            callback(null, results[0]);
        });
    },

    // Lire toutes les offres avec pagination
    readAllWithPagination: function(limit, offset, search, sortBy, order, callback) {
        // Vérifier que limit et offset sont des nombres
        limit = parseInt(limit);
        offset = parseInt(offset);
    
        // Échapper correctement les paramètres de tri pour éviter les injections SQL
        const allowedSortByFields = ['date_validite', 'salaire_min', 'salaire_max', 'fp.nom'];
        const allowedOrderFields = ['asc', 'desc'];
    
        if (!allowedSortByFields.includes(sortBy)) {
            sortBy = 'date_validite'; // valeur par défaut si sortBy est invalide
        }
    
        if (!allowedOrderFields.includes(order)) {
            order = 'desc'; // valeur par défaut si order est invalide
        }
    
        const searchPattern = `%${search}%`;
    
        db.query(`SELECT COUNT(*) AS count
                FROM Offre o
                JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                JOIN Adresse a ON fp.adresse = a.id_add
                JOIN Organisation org ON fp.organisation = org.siren
            WHERE etat = "publiee" AND date_validite > NOW() AND (fp.nom LIKE ? OR description_mission LIKE ?)`
            , [searchPattern, searchPattern], function(err, countResult) {
            if (err) {
                return callback(err, null, null); 
            }
            var totalCount = countResult[0].count;
    
            var sql = `
                SELECT o.*, 
                    fp.nom AS fiche_nom, 
                    fp.statut_de_poste as statut_de_poste,
                    fp.resp_hierarchique as resp_hierarchique,
                    fp.rythme_heures as rythme_heures,
                    fp.teletravail_jours as teletravail_jours,
                    fp.salaire_min as salaire_min,
                    fp.salaire_max as salaire_max,
                    fp.description_mission as description_mission,
                    a.num AS adresse_num, 
                    a.rue AS adresse_rue, 
                    a.ville AS adresse_ville, 
                    a.pays AS adresse_pays, 
                    org.nom AS organisation_nom,
                    org.siren AS siren
                FROM Offre o
                JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                JOIN Adresse a ON fp.adresse = a.id_add
                JOIN Organisation org ON fp.organisation = org.siren
                WHERE o.etat = "publiee" AND o.date_validite > NOW() AND (fp.nom LIKE ? OR fp.description_mission LIKE ?)
                ORDER BY ${sortBy} ${order}
                LIMIT ? OFFSET ?`;
    
            db.query(sql, [searchPattern, searchPattern, limit, offset], function(err, results) {
                if (err) {
                    return callback(err, null, null);
                }
                callback(null, results, totalCount);
            });
        });
    },
    
    // Lire toutes les offres d'une organisation donnée avec pagination
    readAllByOrganisation: function(id_org, callback) {
        const sql = `SELECT 
                        o.*, 
                        fp.nom AS poste_nom, 
                        fp.statut_de_poste AS statut_de_poste,
                        fp.resp_hierarchique AS resp_hierarchique,
                        fp.rythme_heures AS rythme_heures,
                        fp.teletravail_jours AS teletravail_jours,
                        fp.salaire_min AS salaire_min,
                        fp.salaire_max AS salaire_max,
                        fp.description_mission AS description_mission
                    FROM Offre o
                    JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                    JOIN Adresse a ON fp.adresse = a.id_add
                    JOIN Organisation org ON fp.organisation = org.siren
                    WHERE org.siren = ?`;

        console.log('id_org:', id_org);
        console.log('sql:', sql);

        db.query(sql, [id_org], function (err, results) {
            if (err) {
                console.error('Database error:', err);
                return callback(err, null);
            }
            console.log('Query results:', results);
            callback(null, results);
        });
    },

    // Lire toutes les offres actives d'une organisation donnée avec pagination
    readAllActiveByOrganisation: function(id_org, callback) {
        const sql = `SELECT 
                        o.*, 
                        fp.nom AS poste_nom, 
                        fp.statut_de_poste AS statut_de_poste,
                        fp.resp_hierarchique AS resp_hierarchique,
                        fp.rythme_heures AS rythme_heures,
                        fp.teletravail_jours AS teletravail_jours,
                        fp.salaire_min AS salaire_min,
                        fp.salaire_max AS salaire_max,
                        fp.description_mission AS description_mission
                    FROM Offre o
                    JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                    JOIN Adresse a ON fp.adresse = a.id_add
                    JOIN Organisation org ON fp.organisation = org.siren
                    WHERE org.siren = ? AND o.date_validite > NOW()`;

        db.query(sql, [id_org], function (err, results) {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Lire toutes les offres expirées d'une organisation donnée avec pagination
    readAllExpiredByOrganisation: function(id_org, callback) {
        const sql = `SELECT 
                        o.*, 
                        fp.nom AS poste_nom, 
                        fp.statut_de_poste AS statut_de_poste,
                        fp.resp_hierarchique AS resp_hierarchique,
                        fp.rythme_heures AS rythme_heures,
                        fp.teletravail_jours AS teletravail_jours,
                        fp.salaire_min AS salaire_min,
                        fp.salaire_max AS salaire_max,
                        fp.description_mission AS description_mission
                    FROM Offre o
                    JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                    JOIN Adresse a ON fp.adresse = a.id_add
                    JOIN Organisation org ON fp.organisation = org.siren
                    WHERE org.siren = ? AND o.date_validite < NOW()`;

        db.query(sql, [id_org], function (err, results) {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    readExpiredWithPagination: function(id_org, limit, offset, search, callback) {
        const searchPattern = `%${search}%`;
        const countSql = `
            SELECT COUNT(*) AS count 
            FROM Offre o
            JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
            JOIN Organisation org ON fp.organisation = org.siren
            WHERE org.siren = ? AND (o.date_validite < NOW() OR o.date_validite IS NULL) AND (fp.nom LIKE ? OR fp.description_mission LIKE ?)`;

        db.query(countSql, [id_org, searchPattern, searchPattern], (err, countResult) => {
            if (err) return callback(err, null, null);
            const totalCount = countResult[0].count;

            const sql = `
                SELECT 
                    o.*, 
                    fp.nom AS poste_nom, 
                    fp.statut_de_poste AS statut_de_poste,
                    fp.resp_hierarchique AS resp_hierarchique,
                    fp.rythme_heures AS rythme_heures,
                    fp.teletravail_jours AS teletravail_jours,
                    fp.salaire_min AS salaire_min,
                    fp.salaire_max AS salaire_max,
                    fp.description_mission AS description_mission,
                    a.num AS adresse_num, 
                    a.rue AS adresse_rue, 
                    a.ville AS adresse_ville, 
                    a.pays AS adresse_pays, 
                    org.nom AS organisation_nom,
                    org.siren AS siren
                FROM Offre o
                JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                JOIN Adresse a ON fp.adresse = a.id_add
                JOIN Organisation org ON fp.organisation = org.siren
                WHERE org.siren = ? AND (o.date_validite < NOW() OR o.date_validite IS NULL) AND (fp.nom LIKE ? OR fp.description_mission LIKE ?)
                LIMIT ? OFFSET ?`;

            db.query(sql, [id_org, searchPattern, searchPattern, limit, offset], (err, results) => {
                if (err) return callback(err, null, null);
                callback(null, results, totalCount);
            });
        });
    },

    readActiveWithPagination: function(id_org, limit, offset, search, callback) {
        const searchPattern = `%${search}%`;
        const countSql = `
            SELECT COUNT(*) AS count 
            FROM Offre o
            JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
            JOIN Organisation org ON fp.organisation = org.siren
            WHERE org.siren = ? AND o.date_validite > NOW() AND (fp.nom LIKE ? OR fp.description_mission LIKE ?)`;

        db.query(countSql, [id_org, searchPattern, searchPattern], (err, countResult) => {
            if (err) return callback(err, null, null);
            const totalCount = countResult[0].count;

            const sql = `
                SELECT 
                    o.*, 
                    fp.nom AS poste_nom, 
                    fp.statut_de_poste AS statut_de_poste,
                    fp.resp_hierarchique AS resp_hierarchique,
                    fp.rythme_heures AS rythme_heures,
                    fp.teletravail_jours AS teletravail_jours,
                    fp.salaire_min AS salaire_min,
                    fp.salaire_max AS salaire_max,
                    fp.description_mission AS description_mission,
                    a.num AS adresse_num, 
                    a.rue AS adresse_rue, 
                    a.ville AS adresse_ville, 
                    a.pays AS adresse_pays, 
                    org.nom AS organisation_nom,
                    org.siren AS siren
                FROM Offre o
                JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
                JOIN Adresse a ON fp.adresse = a.id_add
                JOIN Organisation org ON fp.organisation = org.siren
                WHERE org.siren = ? AND o.date_validite > NOW() AND (fp.nom LIKE ? OR fp.description_mission LIKE ?)
                LIMIT ? OFFSET ?`;

            db.query(sql, [id_org, searchPattern, searchPattern, limit, offset], (err, results) => {
                if (err) return callback(err, null, null);
                callback(null, results, totalCount);
            });
        });
    },

    // Lire les offres publiées
    readactive: function (callback) {
        db.query("SELECT * FROM Offre WHERE etat = 'publiee'", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // 
    countByFicheDePoste: function(fiche_de_poste, callback) {
        const query = 'SELECT COUNT(*) AS count FROM Offre WHERE Fiche_de_poste = ?';
        db.query(query, [fiche_de_poste], function(err, results) {
            if (err) {
                return callback(err);
            }
            callback(null, results[0].count);
        });
    },

    // Créer une nouvelle offre
    create: function(newOffer, callback) {
        const query = `INSERT INTO Offre (fiche_de_poste, etat, date_validite, description_pieces, nombre_piece_obligatoire, recruteur) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            newOffer.fiche_de_poste,
            newOffer.etat,
            newOffer.date_validite,
            newOffer.description_pieces,
            newOffer.nombre_piece_obligatoire,
            newOffer.recruteur
        ];

        db.query(query, values, function(err, result) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    countByFicheDePoste: function(fiche_de_poste, callback) {
        const query = `SELECT COUNT(*) AS count FROM Offre WHERE fiche_de_poste = ?`;
        db.query(query, [fiche_de_poste], function(err, result) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result[0].count);
        });
    },

    // Mettre à jour une offre
    update: function (updatedOffer, callback) {
        const query = `UPDATE Offre 
            SET etat = ?, date_validite = ?, description_pieces = ?, nombre_piece_obligatoire = ? 
            WHERE id_offre = ?`;
        const values = [
            updatedOffer.etat,
            updatedOffer.date_validite,
            updatedOffer.description_pieces,
            updatedOffer.nombre_piece_obligatoire,
            updatedOffer.id_offre
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Supprimer une offre par ID
    delete: function(id_offre, callback) {
        const query = `DELETE FROM Offre WHERE id_offre = ?`;
        db.query(query, [id_offre], function(err, result) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result);
        });
    }
};
