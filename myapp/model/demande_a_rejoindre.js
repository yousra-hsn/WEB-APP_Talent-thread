var db = require('./db.js');
const moment = require('moment');


module.exports = {
    // Vérifier si une demande existe déjà, peu importe l'organisation
    checkDemande: function(id_candidat, callback) {
        let query = "SELECT * FROM Demande_A_Rejoindre WHERE id_candidat = ? AND traitement = 0";
        let data = [id_candidat];
    
        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // insérer une demande à rejoindre une organisation
    insertDemande: function(id_candidat, id_organisation, date_demande, traitement, callback) {
        let query = "INSERT INTO Demande_A_Rejoindre (id_candidat, id_organisation, date_demande, traitement) VALUES (?, ?, ?, ?)";
        let data = [id_candidat, id_organisation, date_demande, traitement];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    printAll: function(limit, offset, callback) {
        let query = "SELECT Uts.id_user, Uts.nom AS uts_nom, Uts.prenom, Uts.adresse_mail, Dar.traitement, Org.nom AS org_nom \
                     FROM Demande_A_Rejoindre Dar \
                     INNER JOIN Organisation Org ON Dar.id_organisation = Org.siren \
                     INNER JOIN Utilisateur Uts ON Dar.id_candidat = Uts.id_user \
                     LIMIT ? OFFSET ?";
    
        let countQuery = "SELECT COUNT(*) AS count FROM Demande_A_Rejoindre Dar \
                          INNER JOIN Organisation Org ON Dar.id_organisation = Org.siren \
                          INNER JOIN Utilisateur Uts ON Dar.id_candidat = Uts.id_user";
    
        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;
    
            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },    

    readApplicationsAlreadyreviewed: function(limit, offset, callback){
        let query = "SELECT Uts.id_user, Uts.nom AS uts_nom, Uts.prenom, Uts.adresse_mail, Dar.*, Org.nom AS org_nom  \
                    FROM Demande_A_Rejoindre Dar \
                    INNER JOIN Organisation Org \
                    ON Dar.id_organisation = Org.siren \
                    INNER JOIN Utilisateur Uts \
                    ON Dar.id_candidat = Uts.id_user \
                    WHERE Dar.traitement = 1 \
                    LIMIT ? OFFSET ?";

        let countQuery = "SELECT COUNT(*) AS count FROM Demande_A_Rejoindre Dar \
                          INNER JOIN Organisation Org ON Dar.id_organisation = Org.siren \
                          INNER JOIN Utilisateur Uts ON Dar.id_candidat = Uts.id_user";

        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },

    readApplicationsNotReviewed: function (limit, offset, callback) {
        let query = "SELECT Uts.id_user, Uts.nom AS uts_nom, Uts.prenom, Uts.adresse_mail, Dar.*, Org.nom AS org_nom  \
                        FROM Demande_A_Rejoindre Dar \
                        INNER JOIN Organisation Org \
                        ON Dar.id_organisation = Org.siren \
                        INNER JOIN Utilisateur Uts \
                        ON Dar.id_candidat = Uts.id_user \
                        WHERE Dar.traitement = 0 \
                        LIMIT ? OFFSET ?";

        let countQuery = "SELECT COUNT(*) AS count FROM Demande_A_Rejoindre Dar \
                            INNER JOIN Organisation Org ON Dar.id_organisation = Org.siren \
                            INNER JOIN Utilisateur Uts ON Dar.id_candidat = Uts.id_user";

        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function (err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },

    refuseJoining: function(userId, callback) {
        db.query("UPDATE Demande_A_Rejoindre SET traitement = 1 WHERE id_candidat = ?", [userId], function(err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    acceptJoining: function(userId, callback) {
        const updateDemandeQuery = "UPDATE Demande_A_Rejoindre SET traitement = 1 WHERE id_candidat = ?";
        const selectOrganisationQuery = "SELECT id_organisation FROM Demande_A_Rejoindre WHERE id_candidat = ?";
        const updateUtilisateurQuery = "UPDATE Utilisateur SET type = 'recruteur', organisation = ? WHERE id_user = ?";

        // Update Demande_A_Rejoindre
        db.query(updateDemandeQuery, [userId], function(err, result) {
            if (err) {
                callback(err);
                return;
            }

            // Select organisation from Demande_A_Rejoindre
            db.query(selectOrganisationQuery, [userId], function(err, rows) {
                if (err) {
                    callback(err);
                    return;
                }

                if (rows.length === 0) {
                    callback(new Error('No organisation found for the user'));
                    return;
                }

                const organisationId = rows[0].id_organisation;

                // Update Utilisateur
                db.query(updateUtilisateurQuery, [organisationId, userId], function(err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, result);
                });
            });
        });
    },
    
    deleteDemande: function(id_candidat, id_organisation, callback) {
        let query = "DELETE FROM Demande_A_Rejoindre  \
        WHERE id_candidat = ? \
        AND id_organisation = ?";
        let data = [id_candidat, id_organisation];

        db.query(query, data, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
}

        // readApplicationsByOrganisation: function(siren, callback) { 
        //     let query = "SELECT Uts.id_user, Uts.nom AS Uts_nom, Uts.prenom, Uts.adresse_mail, Dar.*, Org.nom AS Org_nom\
        //                 FROM Demande_A_Rejoindre Dar \
        //                 INNER JOIN Organisation Org \
        //                 ON Dar.id_organisation = Org.siren \
        //                 INNER JOIN Utilisateur Uts \
        //                 ON Dar.id_candidat = Uts.id_user \
        //                 WHERE Org.siren = ?";

        //     let data = [siren];

        //     db.query(query, data, function (err, results) {
        //         if (err) throw err;
        //         callback(results);
        //     });
        // },

        // readApplicationsByRecruiter: function(email, callback) { 
        //     let query = "SELECT Uts.id_user, Uts.nom AS Uts_nom, Uts.prenom, Uts.adresse_mail, Dar.*, Org.nom AS Org_nom \
        //                 FROM Demande_A_Rejoindre Dar \
        //                 INNER JOIN Organisation Org \
        //                 ON Dar.id_organisation = Org.siren \
        //                 INNER JOIN Utilisateur Uts \
        //                 ON Dar.id_candidat = Uts.id_user \
        //                 WHERE Uts.adresse_mail = ?";

        //     let data = [email];

        //     db.query(query, data, function (err, results) {
        //         if (err) throw err;
        //         callback(results);
        //     });
        // },