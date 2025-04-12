const assert = require('assert');
const offreModel = require('../model/offres.js');

function testReadAll() {
    offreModel.readall(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadAll passed.');
    });
}

function testReadById(id_offre) {
    offreModel.readbyid(id_offre, function(results) {
        assert(results.length > 0, 'Should retrieve at least one offer');
        assert(results[0].id_offre === id_offre, 'ID should match');
        console.log('testReadById passed.');
    });
}

function testReadActive() {
    offreModel.readactive(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadActive passed.');
    });
}

function testCreate(id_fiche, id_recruteur) {
    const newOffer = {
        fiche_de_poste: id_fiche,
        etat: 'publiee',
        date_validite: '2024-12-31',
        description_pieces: 'Description de test',
        nombre_piece_obligatoire: 5,
        recruteur: id_recruteur
    };
    offreModel.create(
        newOffer.fiche_de_poste, newOffer.etat, newOffer.date_validite, 
        newOffer.description_pieces, newOffer.nombre_piece_obligatoire, 
        newOffer.recruteur, function(results) {
            assert(results.affectedRows === 1, 'One row should be inserted');
            console.log('testCreate passed.');
        }
    );
}

function testUpdate(id_offre, id_fiche, id_recruteur) {
    const updatedOffer = {
        fiche_de_poste: id_fiche,
        etat: 'expiree',
        date_validite: '2025-01-01',
        description_pieces: 'Description mise à jour',
        nombre_piece_obligatoire: 3,
        recruteur: id_recruteur
    };

    // Lire l'offre avant la mise à jour
    offreModel.readbyid(id_offre, function(results) {
        if (results.length === 0) {
            console.error('Offer with the specified ID does not exist.');
            return;
        }

        console.log('Offer before update:', results[0]);

        // Mettre à jour l'offre
        offreModel.update(
            id_offre, updatedOffer.fiche_de_poste, updatedOffer.etat, 
            updatedOffer.date_validite, updatedOffer.description_pieces, 
            updatedOffer.nombre_piece_obligatoire, updatedOffer.recruteur, 
            function(results) {
                try {
                    assert(results.affectedRows === 1, 'One row should be updated');
                    console.log('testUpdate passed.');
                    
                    // Lire l'offre après la mise à jour
                    offreModel.readbyid(id_offre, function(updatedResults) {
                        console.log('Offer after update:', updatedResults[0]);
                    });
                } catch (error) {
                    console.error('Assertion error:', error);
                }
            }
        );
    });
}

function testDelete(id_offre) {
    offreModel.delete(id_offre, function(results) {
        assert(results.affectedRows === 1, 'One row should be deleted');
        console.log('testDelete passed.');
    });
}

function testReadAllWithPagination() {
    offreModel.readAllWithPagination(5, 0, function(results, totalCount) {
        assert(Array.isArray(results), 'Results should be an array');
        assert(typeof totalCount === 'number', 'Total count should be a number');
        console.log('testReadAllWithPagination passed.');
        console.log('results:', results);
    });
}

// Execute tests
// testReadAll();
// testReadById(13);
// testReadActive();
// testCreate(4,32);
// testUpdate(16, 4, 32);
// testDelete(16);
// testReadAllWithPagination();
