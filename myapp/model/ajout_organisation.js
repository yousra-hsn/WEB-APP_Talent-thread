var db = require('./db.js');
const moment = require('moment');


module.exports = {

    printAll: function(limit, offset, callback) {
        let query = "SELECT * from Ajout_Organisation LIMIT ? OFFSET ?";

        let countQuery = "SELECT COUNT(*) AS count FROM Ajout_Organisation";
    
        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                results.forEach(user => {
                    user.date_demande = moment(user.date_creation).format('DD/MM/YYYY');
                });
                callback(results, totalCount);
            });
        });
    }, 

    selectBySiren: function (siren, callback) {
        db.query("SELECT * FROM Ajout_Organisation WHERE siren = ?", [siren], function (err, results) {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }, 

    selectByName: function (name, callback) {
        db.query("SELECT * FROM Ajout_Organisation WHERE nom = ?", [name], function (err, results) {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    readOrganizationsAlreadyReviewedAcc: function(limit, offset, callback){
        let query = "SELECT * FROM Ajout_Organisation WHERE traitement = 1 AND decision = 1 LIMIT ? OFFSET ?";
        let countQuery = "SELECT COUNT(*) AS count FROM Ajout_Organisation WHERE traitement = 1";

        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },

    readOrganizationsAlreadyReviewedRef: function(limit, offset, callback){
        let query = "SELECT * FROM Ajout_Organisation WHERE traitement = 1 AND decision = 0 LIMIT ? OFFSET ?";
        let countQuery = "SELECT COUNT(*) AS count FROM Ajout_Organisation WHERE traitement = 1";

        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },

    readOrganizationsNotReviewed: function (limit, offset, callback) {
        let query = "SELECT * FROM Ajout_Organisation WHERE traitement = 0 LIMIT ? OFFSET ?";
        let countQuery = "SELECT COUNT(*) AS count FROM Ajout_Organisation WHERE traitement = 1";

        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },

    insertRequestToAdd: function(siren, nom, type, num_ad, rue_ad, ville_ad, pays_ad, callback) {
        const query = "INSERT INTO Ajout_Organisation (siren, nom, type, num_ad, rue_ad, ville_ad, pays_ad, traitement, decision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let traitement = 0;
        let decision = 0;
        const values = [siren, nom, type, num_ad, rue_ad, ville_ad, pays_ad, traitement, decision];
        db.query(query, values, function(err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    refuseAdding: function(siren, callback) {
        console.log(siren);
        db.query("UPDATE Ajout_Organisation SET traitement = 1, decision = 0 WHERE siren = ?", [siren], function(err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    acceptAdding: function(siren, callback) {
        const traitementDemande = "UPDATE Ajout_Organisation SET traitement = 1, decision = 1 WHERE siren = ?";
        const selectInfoSiren = "SELECT * FROM Ajout_Organisation WHERE siren = ?";
        const selectBiggestId_add = "SELECT MAX(id_add) AS id FROM Adresse";
        const insertAdresseQuery = "INSERT INTO Adresse (id_add, num, rue, ville, pays) VALUES (?, ?, ?, ?, ?)";
        const insertOrganisationQuery = "INSERT INTO Organisation (siren, nom, type, siege_social) VALUES (?, ?, ?, ?)";

        // Update Ajout_Organisation
        db.query(traitementDemande, [siren], function(err, result) {
            if (err) {
                return callback(err);
            }
            // Récupère les infos associés à ce SIREN pour les injecter dans Addresse et Organisation
            db.query(selectInfoSiren, [siren], function(err, rows) {
                if (err) {
                    return callback(err);
                }

                if (rows.length === 0) {
                    return callback(new Error('No request found for this siren'));
                }
                const infos = rows[0];

                // Insert into Adresse
                db.query(selectBiggestId_add, function(err, result) {
                    if (err) {
                        return callback(err);
                    }
                    const max_id_add = result[0].id;
                    const id_add = max_id_add + 1;

                    // Select id_add from Adresse
                    db.query(insertAdresseQuery, [id_add, infos.num_ad, infos.rue_ad, infos.ville_ad, infos.pays_ad], function(err, rows) {
                        if (err) {
                            return callback(err);
                        }

                        if (rows.length === 0) {
                            return callback(new Error('No address entered'));
                        }
                        // Insert into Organisation
                        db.query(insertOrganisationQuery, [infos.siren, infos.nom, infos.type, id_add], function(err, result) {                 
                            if (err) {
                                return callback(err);
                            }
                            callback(result);
                        });
                    });
                });
            });
        });
    },
}