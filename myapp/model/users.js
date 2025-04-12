var db = require('./db.js');
const moment = require('moment');
const bcrypt = require('bcrypt');

module.exports = {
    //check if user is valid
    areValid: function (email, password, callback) {
        console.log(`Checking validity for email: ${email}`);
        const sql = "SELECT mot_de_passe FROM Utilisateur WHERE adresse_mail = ?";
        db.query(sql, [email], function (err, results) {
            if (err) {
                console.error('Database query error:', err);
                return callback(false);
            }
            if (results.length === 1) {
                const hashedPassword = results[0].mot_de_passe;
                // Utiliser bcrypt pour comparer le mot de passe
                bcrypt.compare(password, hashedPassword, function (err, isMatch) {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return callback(false);
                    }
                    if (isMatch) {
                        console.log('Password match found');
                        callback(true);
                    } else {
                        console.log('Password match not found');
                        callback(false);
                    }
                });
            } else {
                console.log('User not found');
                callback(false);
            }
        });
    },

    //read user by email
    read: function (email, callback) {
        console.log(`Retrieving user for email: ${email}`);
        db.query("select * from Utilisateur where adresse_mail= ?", email, function (err, results) {
            if (err) {
                console.error('Database query error in getUserByEmail:', err);
                return callback(err);
            }
            if (results.length === 1) {
                callback(null, results[0]);
            } else {
                callback(new Error('User not found'));
            }
        });
    },

    //read all users
    readall: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readallwithpagination: function(limit, offset, callback) {
        db.query('SELECT COUNT(*) AS count FROM Utilisateur', function(err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;
            db.query('SELECT * FROM Utilisateur LIMIT ? OFFSET ?', [limit, offset], function(err, results) {
                if (err) throw err;
                // Formater les dates ici
                results.forEach(user => {
                user.date_creation = moment(user.date_creation).format('DD/MM/YYYY');
                });
                callback(results, totalCount);
            });
        });
    },

    //read by id
    readbyid: function (id, callback) {
        db.query("select * from Utilisateur where id_user= ?", id, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    //read all recruiters
    readallrecruiters: function(limit, offset, callback){
        let query = "SELECT * from Utilisateur where type='recruteur' \
                    LIMIT ? OFFSET ?";

        let countQuery = "SELECT COUNT(*) AS count FROM Utilisateur";

        db.query(countQuery, function (err, countResult) {
            if (err) throw err;
            var totalCount = countResult[0].count;

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw err;
                results.forEach(user => {
                    user.date_creation = moment(user.date_creation).format('DD/MM/YYYY');
                });
                callback(results, totalCount);
            });
        });
    },

    create: function (adresse_mail, mot_de_passe, nom, prenom, tel, date_creation, type, organisation, callback) {
        let actif = 1;

        let sql = "INSERT INTO Utilisateur (adresse_mail, mot_de_passe, nom, prenom, tel, date_creation, actif, type, organisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let values = [adresse_mail, mot_de_passe, nom, prenom, tel, date_creation, actif, type, organisation];
        
        console.log("Executing SQL:", sql);
        console.log("With values:", values);

        db.query(sql, values, function (err, results) {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    promoteToAdmin: function(userId, callback) {
        db.query("UPDATE Utilisateur SET type = 'admin', organisation = NULL WHERE id_user = ? AND type != 'admin'", [userId], function(err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    delete: function (userId, callback) {
        db.query("DELETE FROM Utilisateur WHERE id_user = ?", userId, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    activate: function (userId, callback) {
        db.query("UPDATE Utilisateur SET actif = 1 WHERE id_user = ?", userId, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    deactivate: function (userId, callback) {
        console.log("Deactivating user with id:", userId);
        db.query("UPDATE Utilisateur SET actif = 0 WHERE id_user = ?", userId, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    updateUser: function (id, updateValues, callback) {
        const updateQuery = 'UPDATE Utilisateur SET ' + updateValues.join(', ') + ' WHERE id_user = ?';
        db.query(updateQuery, [id], function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    readUserOrganisation: function(userId, callback) {
        const query = "SELECT organisation FROM Utilisateur WHERE id_user = ?";
        db.query(query, [userId], function(err, result) {
            if (err) return callback(err, null);
            if (result.length > 0) {
                callback(null, result[0].organisation);
            } else {
                callback(null, null);
            }
        });
    }
};


        // //read all candidats
        // readallcandidats: function (callback) {
        //     db.query("select * from Utilisateur where type='candidat' ", function (err, results) {
        //         if (err) throw err;
        //         callback(results);
        //     });
        // },

        // //read all admins
        // readalladmins: function (callback) {
        //     db.query("select * from Utilisateur where type='admin' ", function (err, results) {
        //         if (err) throw err;
        //         callback(results);
        //     });
        // },

    // areValid: function (email, password, callback) {
    //     sql = "SELECT mot_de_passe FROM Utilisateur WHERE adresse_mail = ?";
    //     rows = db.query(sql, email, function (err, results) {
    //         if (err) throw err;
    //         if (rows.length == 1 && rows[0].pwd === password) {
    //             callback(true)
    //         } else {
    //             callback(false);
    //         }
    //     });
    // },
