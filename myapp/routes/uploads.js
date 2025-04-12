const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Route pour servir les fichiers PDF depuis le dossier uploads
router.get('/:id_offre/:filename', function(req, res, next) {
    const id_offre = req.params.id_offre;
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'uploads', id_offre, filename);

    console.log(`Trying to access file: ${filepath}`);

    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filepath}`);
            return res.status(404).send('File not found');
        }
        res.sendFile(filepath);
    });
});

module.exports = router;
