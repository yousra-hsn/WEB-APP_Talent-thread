var db = require('./db.js');

module.exports = {
    // Lire toutes les organisations
    readall: function (callback) {
        db.query("SELECT * FROM Organisation", function (err, results) {
            if (err) {
                console.error('Database query error:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Lire toutes les organisations avec leur adresse
    readallwithaddress: function (callback) {
        const query = `
            SELECT o.*, a.num, a.rue, a.ville, a.pays
            FROM Organisation o
            JOIN Adresse a ON o.siege_social = a.id_add
        `;
        db.query(query, function (err, results) {
            if (err) {
                console.error('Database query error:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    // Lire toutes les organisations avec pagination
    readallwithpagination: function(limit, offset, callback) {
        db.query('SELECT COUNT(*) AS count FROM Organisation', function(err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;
            db.query(`
                SELECT o.*, a.num, a.rue, a.ville, a.pays
                FROM Organisation o
                JOIN Adresse a ON o.siege_social = a.id_add
                LIMIT ? OFFSET ?
            `, [limit, offset], function(err, results) {
                if (err) throw err;
                callback(results, totalCount);
            });
        });
    },
    // Sélectionner tous les SIREN
    selectSiren: function (callback) {
        db.query("SELECT siren FROM Organisation", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Sélectionner tous les types d'organisation
    selectType: function (callback) {
        // console.log("Selecting all types of organisations");
        db.query("SELECT DISTINCT type FROM Organisation", function (err, results) {
            if (err) {
                console.error('Database query error:', err);
                return callback(err, null);
            }
            // console.log("Results SQL:", results);
            callback(null, results);
        });
    },

    // Lire une organisation par SIREN
    readbysiren: function (siren, callback) {
        db.query("SELECT * FROM Organisation WHERE siren = ?", [siren], function (err, results) {
            if (err) {
                return callback(err, null);
            }
            // Assurez-vous de renvoyer null si aucun résultat n'est trouvé
            if (results.length === 0) {
                return callback(null, null);
            }
            return callback(null, results[0]);
        });
    },

    readByName: function(name, callback) {
        const query = "SELECT * FROM Organisation WHERE nom = ?";
        db.query(query, [name], function(err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Créer une nouvelle organisation et son siège social
    create: function (siren, nom, type, num, rue, ville, pays, callback) {
        // Insérer l'adresse dans la table Adresse
        let sqlAdresse = "INSERT INTO Adresse (num, rue, ville, pays) VALUES (?, ?, ?, ?)";
        let valuesAdresse = [num, rue, ville, pays];
        
        console.log("Executing SQL for Adresse:", sqlAdresse);
        console.log("With values:", valuesAdresse);

        db.query(sqlAdresse, valuesAdresse, function (err, results) {
            if (err) throw err;
            let id_add = results.insertId;
            console.log("New address ID:", id_add);

            // Insérer l'organisation dans la table Organisation
            let sqlOrganisation = "INSERT INTO Organisation (siren, nom, type, siege_social) VALUES (?, ?, ?, ?)";
            let valuesOrganisation = [siren, nom, type, id_add];

            console.log("Executing SQL for Organisation:", sqlOrganisation);
            console.log("With values:", valuesOrganisation);

            db.query(sqlOrganisation, valuesOrganisation, function (err, results) {
                if (err) throw err;
                callback(results);
            });
        });
    },

    // Créer une nouvelle organisation
    insertOrg : function(siren, nom, type, siege_social, callback) {
        let sqlOrganisation = "INSERT INTO Organisation (siren, nom, type, siege_social) VALUES (?, ?, ?, ?)";
        let valuesOrganisation = [siren, nom, type, siege_social];

        console.log("Executing SQL for Organisation:", sqlOrganisation);
        console.log("With values:", valuesOrganisation);

        db.query(sqlOrganisation, valuesOrganisation, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    // Mettre à jour une organisation par SIREN
    update: function (siren, nom, type, siege_social, callback) {
        let sql = "UPDATE Organisation SET nom = ?, type = ?, siege_social = ? WHERE siren = ?";
        let values = [nom, type, siege_social, siren];
        
        db.query(sql, values, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Supprimer une organisation par SIREN
    delete: function (siren, callback) {
        db.query("DELETE FROM Organisation WHERE siren = ?", [siren], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
};
