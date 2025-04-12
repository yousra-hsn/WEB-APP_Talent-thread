var mysql = require("mysql");
require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST); // Ajoutez ceci pour vérifier les variables d'environnement

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test de connexion à la base de données et affichage d'un message d'erreur en cas d'échec
pool.getConnection(function(err, connection) {
    if (err) {
        console.error('Erreur de connexion à la base de données: ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données avec l\'identifiant ' + connection.threadId);
});

module.exports = pool;
