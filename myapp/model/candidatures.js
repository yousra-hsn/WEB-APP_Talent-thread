var db = require('./db.js');
const path = require('path');

module.exports = {

    checkExistingApplication: function(id_candidat, id_offre, callback) {
        const query = 'SELECT * FROM Candidate WHERE id_candidat = ? AND id_offre = ?';
        const data = [id_candidat, id_offre];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results.length > 0);
        });
    },

    insertApplication: function(id_candidat, id_offre, date_candidature, infos_supp, callback) {
        const query = 'INSERT INTO Candidate (id_candidat, id_offre, date_candidature, infos_supp) VALUES (?, ?, ?, ?)';
        const data = [id_candidat, id_offre, date_candidature, infos_supp];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    getApplicationsForJob: function(id_offre, callback) {
        const query = `
            SELECT u.id_user, u.nom, u.prenom, u.adresse_mail, u.tel, c.date_candidature, p.path
            FROM Candidate c
            JOIN Utilisateur u ON c.id_candidat = u.id_user
            LEFT JOIN Piece_jointe p ON p.id_offre = c.id_offre AND p.id_candidat = u.id_user
            WHERE c.id_offre = ?;
        `;
        const data = [id_offre];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            
            // Group applications by candidate and prepare file paths
            const groupedResults = results.reduce((acc, row) => {
                if (!acc[row.id_user]) {
                    acc[row.id_user] = {
                        nom: row.nom,
                        prenom: row.prenom,
                        adresse_mail: row.adresse_mail,
                        tel: row.tel,
                        date_candidature: row.date_candidature,
                        paths: []
                    };
                }
                if (row.path) {
                    acc[row.id_user].paths.push({
                        fullPath: row.path,
                        fileName: path.basename(row.path)
                    });
                }
                return acc;
            }, {});

            // Convert grouped results to an array
            const applications = Object.values(groupedResults);

            return callback(null, applications);
        });
    },
    
    getJobTitle: function(id_offre, callback) {
        const query = `
            SELECT f.nom
            FROM Offre o
            JOIN Fiche_de_poste f ON f.id_fiche_de_poste = o.fiche_de_poste
            WHERE o.id_offre = ?`;
        const data = [id_offre];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results.length > 0 ? results[0].nom : 'Unknown');
        });
    },

    getCandidateApplication: function(id_candidat, id_offre, callback) {
        const query = `
            SELECT c.*, p.path 
            FROM Candidate c
            LEFT JOIN Piece_jointe p ON c.id_candidat = p.id_candidat AND c.id_offre = p.id_offre
            WHERE c.id_candidat = ? AND c.id_offre = ?`;
        const data = [id_candidat, id_offre];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }

            const candidature = {
                id_candidat: results[0].id_candidat,
                id_offre: results[0].id_offre,
                date_candidature: results[0].date_candidature,
                infos_supp: results[0].infos_supp,
                attachments: results.map(row => row.path).filter(path => path) // Exclure les chemins de fichiers vides
            };

            return callback(null, candidature);
        });
    },

    updateApplication: function(id_candidat, id_offre, updatedData, callback) {
        const query = 'UPDATE Candidate SET ? WHERE id_candidat = ? AND id_offre = ?';
        const data = [updatedData, id_candidat, id_offre];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    deleteApplication: function(id_candidat, id_offre, callback) {
        const query = 'DELETE FROM Candidate WHERE id_candidat = ? AND id_offre = ?';
        const data = [id_candidat, id_offre];
        db.query(query, data, function(err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    readAll: function( callback){
        let query = "SELECT * FROM Candidate";

        db.query(query, function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    printAll: function(callback){
        let query = "SELECT Cdt.id_candidat, Uts.nom, Uts.prenom, Fdp.nom, Org.nom, Cdt.date_candidature, Ofr.recruteur \
                    FROM Candidate Cdt \
                    INNER JOIN Utilisateur Uts \
                    INNER JOIN Organisation Org \
                    WHERE Cdt.id_offre = Ofr.id_offre \
                    AND Cdt.id_candidat = Uts.id_user \
                    AND Ofr.fiche_de_poste = Fdp.id_fiche_de_poste \
                    AND Org.siren = Fdp.organisation";

        db.query(query, function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    readApplicationByUser: function(email, callback) { 
        let query = "SELECT Uts.nom, Uts.prenom, Uts.adresse_mail, Cdt.* \
                    FROM Candidate Cdt \
                    INNER JOIN Utilisateur Uts \
                    ON Cdt.id_candidat = Uts.id_user \
                    WHERE Uts.adresse_mail = ?";

        let data = [email];

        db.query(query, data, function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    readbycandidateid: function(id_candidat, callback) {
        db.query(`
            SELECT c.*, o.fiche_de_poste, o.etat, o.date_validite, fp.nom AS fiche_nom, fp.rythme_heures, fp.salaire_min, fp.salaire_max,
            a.num AS adresse_num, a.rue AS adresse_rue, a.ville AS adresse_ville, a.pays AS adresse_pays, 
            org.nom AS organisation_nom
            FROM Candidate c
            JOIN Offre o ON c.id_offre = o.id_offre
            JOIN Fiche_de_poste fp ON o.fiche_de_poste = fp.id_fiche_de_poste
            JOIN Adresse a ON fp.adresse = a.id_add
            JOIN Organisation org ON fp.organisation = org.siren
            WHERE c.id_candidat = ?
            ORDER BY c.date_candidature DESC;
        `, [id_candidat], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readSpecificApplicationByUser: function(email, idFiche, callback){
        let query = "SELECT Uts.nom, Uts.prenom, Uts.adresse_mail, Cdt.* \
                    FROM Candidate Cdt \
                    INNER JOIN Utilisateur Uts \
                    ON Cdt.id_candidat = Uts.id_user \
                    WHERE Uts.adresse_mail = ? \
                    AND Cdt.id_fiche_de_poste = ? ";

        let data = [email, idFiche];

        db.query(query, data, function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    readSpecificApplicationByUserWtAttachments: function(email, idFiche, callback){
        let query = "SELECT Uts.nom, Uts.prenom, Uts.adresse_mail, Cdt.*, Pjt.id_piece_jointe, Pjt.categorie, Pjt.format, Pjt.path \
                    FROM Candidate Cdt \
                    INNER JOIN Utilisateur Uts \
                    ON Cdt.id_candidat = Uts.id_user \
                    INNER JOIN Piece_jointe Pjt \
                    ON Cdt.id_candidat = Pjt.id_candidat \
                    AND Cdt.id_offre = Pjt.id_offre \
                    AND Cdt.id_fiche_de_poste = Pjt.id_fiche_de_poste \
                    WHERE Uts.adresse_mail = ? \
                    AND Cdt.id_fiche_de_poste = ?";
        let data = [email, idFiche];

        db.query(query, data, function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    }
}