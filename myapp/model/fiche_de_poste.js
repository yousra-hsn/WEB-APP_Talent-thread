var db = require('./db.js');

module.exports = {

    create: function(newJobDescription, callback) {
        const query = `INSERT INTO Fiche_de_poste (organisation, nom, statut_de_poste, resp_hierarchique, rythme_heures, teletravail_jours, salaire_min, salaire_max, description_mission, date_fin_validite, nombre_offres, adresse) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            newJobDescription.organisation,
            newJobDescription.nom,
            newJobDescription.statut_de_poste,
            newJobDescription.resp_hierarchique,
            newJobDescription.rythme_heures,
            newJobDescription.teletravail_jours,
            newJobDescription.salaire_min,
            newJobDescription.salaire_max,
            newJobDescription.description_mission,
            newJobDescription.date_fin_validite,
            newJobDescription.nombre_offres,
            newJobDescription.adresse
        ];

        db.query(query, values, function(err, result) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    readAll: function(callback){
        let query = "SELECT Org.nom AS Entreprise, Fdp.*, Adr.*\
                    FROM Fiche_de_poste Fdp \
                    INNER JOIN Organisation Org ON Fdp.organisation = Org.siren \
                    INNER JOIN Adresse Adr ON Org.siege_social = Adr.id_add";

        db.query(query, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readById: function(id_fiche_de_poste, callback) {
            const query = `
                SELECT Org.nom AS Entreprise, Fdp.*, Adr.*
                FROM Fiche_de_poste Fdp
                INNER JOIN Organisation Org ON Fdp.organisation = Org.siren
                INNER JOIN Adresse Adr ON Org.siege_social = Adr.id_add
                WHERE Fdp.id_fiche_de_poste = ?
            `;
    
            const data = [id_fiche_de_poste];
    
            db.query(query, data, function (err, results) {
                if (err) {
                    console.error('Database query error:', err); // Log the error
                    return callback(err, null); // Pass the error to the callback
                }
    
                if (results.length > 0) {
                    console.log('Database query results:', results); // Log the results
                    return callback(null, results[0]); // Return the first result
                } else {
                    console.log('No results found for ID:', id_fiche_de_poste); // Log if no results
                    return callback(null, null); // Return null if no results
                }
            });
    },

    readByOrganisation: function(siren, callback) {
        const queryFiches = `SELECT * FROM Fiche_de_poste WHERE organisation = ? AND date_fin_validite >= CURDATE()`;
        const queryRecruteurs = `SELECT id_user, nom, prenom, adresse_mail FROM Utilisateur WHERE organisation = ?`;
    
        db.query(queryFiches, [siren], function(err, fichesDePoste) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
    
            db.query(queryRecruteurs, [siren], function(err, recruteurs) {
                if (err) {
                    console.error('Database error:', err);
                    return callback(err);
                }
    
                callback(null, { fichesDePoste, recruteurs });
            });
        });
    },    

    readJobDescriptionByOrganisation: function(siren, callback) { 
        let query = "SELECT Org.nom AS Entreprise, Fdp.* \
                    FROM Fiche_de_poste Fdp \
                    INNER JOIN Organisation Org \
                    ON Fdp.organisation = Org.siren \
                    WHERE Org.siren = ?";

        let data = [siren];

        db.query(query, data, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    getById: function(id, callback) {
        const query = `SELECT * FROM Fiche_de_poste WHERE id_fiche_de_poste = ?`;
        db.query(query, [id], function(err, result) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result[0]);
        });
    },

    deleteJobDescription: function (id_fiche_de_poste, callback) {
        let query = "DELETE FROM Fiche_de_poste WHERE id_fiche_de_poste = ?";
        let data = [id_fiche_de_poste];

        db.query(query, data, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
}