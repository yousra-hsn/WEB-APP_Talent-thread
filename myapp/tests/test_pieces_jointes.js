const assert = require('assert');
const pieceJointeModel = require('../model/piece_jointe.js');

function testReadAll() {
    pieceJointeModel.readall(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadAll passed.');
    });
}

function testReadById(id_piece_jointe) {
    pieceJointeModel.readbyid(id_piece_jointe, function(results) {
        assert(results.length > 0, 'Should retrieve at least one piece jointe');
        assert(results[0].id_piece_jointe === id_piece_jointe, 'ID should match');
        console.log('testReadById passed.');
    });
}

function testCreate(id_candidat, id_offre, id_fiche_de_poste) {
    const newPieceJointe = {
        id_candidat: id_candidat,
        id_offre: id_offre,
        id_fiche_de_poste: id_fiche_de_poste,
        categorie: 'cv',
        format: 'pdf',
        path: 'path/to/document.pdf'
    };
    pieceJointeModel.create(
        newPieceJointe.id_candidat, newPieceJointe.id_offre, newPieceJointe.id_fiche_de_poste,
        newPieceJointe.categorie, newPieceJointe.format, newPieceJointe.path, function(results) {
            assert(results.affectedRows === 1, 'One row should be inserted');
            console.log('testCreate passed.');
        }
    );
}

function testUpdate(id_piece_jointe, id_candidat, id_offre, id_fiche_de_poste) {
    const updatedPieceJointe = {
        id_candidat: id_candidat,
        id_offre: id_offre,
        id_fiche_de_poste: id_fiche_de_poste,
        categorie: 'lettre_motivation',
        format: 'doc',
        path: 'path/to/updated_document.doc'
    };
    pieceJointeModel.update(
        id_piece_jointe, updatedPieceJointe.id_candidat, updatedPieceJointe.id_offre,
        updatedPieceJointe.id_fiche_de_poste, updatedPieceJointe.categorie,
        updatedPieceJointe.format, updatedPieceJointe.path, function(results) {
            assert(results.affectedRows === 1, 'One row should be updated');
            console.log('testUpdate passed.');
        }
    );
}

function testDelete(id_piece_jointe) {
    pieceJointeModel.delete(id_piece_jointe, function(results) {
        assert(results.affectedRows === 1, 'One row should be deleted');
        console.log('testDelete passed.');
    });
}

// Execute tests with sample IDs
const sampleIdPieceJointe = 16;
const sampleIdCandidat = 36;
const sampleIdOffre = 13;
const sampleIdFicheDePoste = 4;

// testReadAll();
// testReadById(sampleIdPieceJointe);
// testCreate(sampleIdCandidat, sampleIdOffre, sampleIdFicheDePoste);
// testUpdate(sampleIdPieceJointe, sampleIdCandidat, sampleIdOffre, sampleIdFicheDePoste);
testDelete(sampleIdPieceJointe);
