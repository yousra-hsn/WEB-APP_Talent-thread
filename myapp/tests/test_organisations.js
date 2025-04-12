const assert = require('assert');
const organisationModel = require('../model/organisation.js');

function testReadAll() {
    organisationModel.readall(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadAll passed.');
    });
}

function testReadAllWithPagination() {
    organisationModel.readallwithpagination(10, 0, function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadAllWithPagination passed.');
    });
}

function testReadBySiren(siren) {
    organisationModel.readbysiren(siren, function(results) {
        assert(results.length > 0, 'Should retrieve at least one organisation');
        assert(results[0].siren === siren, 'SIREN should match');
        console.log('testReadBySiren passed.');
    });
}

function testCreate(siren) {
    const newOrganisation = {
        nom: 'Organisation Test',
        type: 'SARL',
        num: 1,
        rue: 'Rue de Test',
        ville: 'Ville de Test',
        pays: 'Pays de Test'
    };
    organisationModel.create(
        siren, newOrganisation.nom, newOrganisation.type, 
        newOrganisation.num, newOrganisation.rue, newOrganisation.ville, newOrganisation.pays, function(results) {
            assert(results.affectedRows === 1, 'One row should be inserted');
            console.log('testCreate passed.');
        }
    );
}

function testUpdate(siren, id_siege_social) {
    const updatedOrganisation = {
        nom: 'Organisation Test Updated',
        type: 'SASU',
    };
    organisationModel.update(
        siren, updatedOrganisation.nom, updatedOrganisation.type, 
        id_siege_social, function(results) {
            assert(results.affectedRows === 1, 'One row should be updated');
            console.log('testUpdate passed.');
        }
    );
}

function testDelete(siren) {
    organisationModel.delete(siren, function(results) {
        assert(results.affectedRows === 1, 'One row should be deleted');
        console.log('testDelete passed.');
    });
}

// Execute tests
// testReadAll();
testReadAllWithPagination();
// testReadBySiren('111222333');
// testCreate('333222111');
// testUpdate('333222111', 13);
// testDelete('333222111');

