const assert = require('assert');
const candidatureModel = require('../model/candidatures.js');

// test de la fonction readbycandidateid
function testReadByCandidateId(id_candidat) {
    candidatureModel.readbycandidateid(id_candidat, function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadByCandidateId passed.');
    });
}

testReadByCandidateId(36); // test avec un id_candidat existant