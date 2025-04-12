var db = require('./db.js');

module.exports = {
    // Lire toutes les pièces jointes
    readall: function (callback) {
        db.query("SELECT * FROM Piece_jointe", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Lire une pièce jointe par ID
    readbyid: function (id_piece_jointe, callback) {
        db.query("SELECT * FROM Piece_jointe WHERE id_piece_jointe = ?", [id_piece_jointe], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Créer une nouvelle pièce jointe
    insertPieceJointe: function(pieceJointeValues, callback) {
        const query = 'INSERT INTO Piece_jointe (path, id_offre, id_candidat) VALUES ?';

        db.query(query, [pieceJointeValues], function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    deleteByCandidateAndOffer: function(id_candidat, id_offre, callback) {
        const query = 'DELETE FROM Piece_jointe WHERE id_candidat = ? AND id_offre = ?';
        const data = [id_candidat, id_offre];
        db.query(query, data, function(err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    getPathsByCandidateAndOffer: function(id_candidat, id_offre, callback) {
        const query = 'SELECT path FROM Piece_jointe WHERE id_candidat = ? AND id_offre = ?';
        const data = [id_candidat, id_offre];
        db.query(query, data, function(err, results) {
            if (err) {
                return callback(err, null);
            }
            const paths = results.map(row => row.path);
            return callback(null, paths);
        });
    },

    // Mettre à jour une pièce jointe par ID
    update: function (id_piece_jointe, id_candidat, id_offre, id_fiche_de_poste, categorie, format, path, callback) {
        let sql = "UPDATE Piece_jointe SET id_candidat = ?, id_offre = ?, id_fiche_de_poste = ?, categorie = ?, format = ?, path = ? WHERE id_piece_jointe = ?";
        let values = [id_candidat, id_offre, id_fiche_de_poste, categorie, format, path, id_piece_jointe];
        
        db.query(sql, values, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Supprimer une pièce jointe par ID
    delete: function (id_piece_jointe, callback) {
        db.query("DELETE FROM Piece_jointe WHERE id_piece_jointe = ?", [id_piece_jointe], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    // Supprimer une pièce jointe spécifique
    deleteSpecificAttachments: function(paths, callback) {
        if (paths.length === 0) {
            return callback(null); // Rien à supprimer
        }
        const placeholders = paths.map(() => '?').join(',');
        const query = `DELETE FROM Piece_jointe WHERE path IN (${placeholders})`;
        db.query(query, paths, function(err, result) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }
};
