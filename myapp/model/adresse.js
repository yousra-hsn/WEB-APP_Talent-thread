var db = require('./db.js');

module.exports = {

    readAll: function(callback) {
        const query = `SELECT id_add, num, rue, ville, pays FROM Adresse`;
        db.query(query, function(err, results) {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    insertAddress: function (num, rue, ville, pays, callback) {
        let query = "INSERT INTO Adresse (num, rue, ville, pays) VALUES (?, ?, ?, ?)";
        let data = [num, rue, ville, pays];

        db.query(query, data, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, results);
        });
    },

    deleteAddress: function (num, rue, ville, pays, callback) {
        let query = "DELETE FROM Adresse  \
        WHERE num = ? \
        AND rue = ? \
        AND ville = ? \
        AND pays = ?";
        let data = [num, rue, ville, pays];

        db.query(query, data, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
}
