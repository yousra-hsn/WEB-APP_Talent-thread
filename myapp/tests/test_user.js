const assert = require('assert');
const userModel = require('../model/users.js');

function testReadAll() {
    userModel.readall(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        console.log('testReadAll passed.');
    });
}

function testReadAllWithPagination() {
    userModel.readAllWithPagination(10, 0, function(results, totalCount) {
        assert(Array.isArray(results), 'Results should be an array');
        assert(typeof totalCount === 'number', 'Total count should be a number');
        console.log('testReadAllWithPagination passed.');
    });
}

function testReadByEmail(email) {
    userModel.read(email, function(results) {
        assert(results.length > 0, 'Should retrieve at least one user');
        assert(results[0].adresse_mail === email, 'Email should match');
        console.log('testReadByEmail passed.');
    });
}

function testReadById(id_user) {
    userModel.readbyid(id_user, function(results) {
        assert(results.length > 0, 'Should retrieve at least one user');
        assert(results[0].id_user === id_user, 'ID should match');
        console.log('testReadById passed.');
    });
}

function testReadAllRecruiters() {
    userModel.readallrecruiters(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        results.forEach(user => {
            assert(user.type === 'recruteur', 'User type should be recruteur');
        });
        console.log('testReadAllRecruiters passed.');
    });
}

function testReadAllCandidats() {
    userModel.readallcandidats(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        results.forEach(user => {
            assert(user.type === 'candidat', 'User type should be candidat');
        });
        console.log('testReadAllCandidats passed.');
    });
}

function testReadAllAdmins() {
    userModel.readalladmins(function(results) {
        assert(Array.isArray(results), 'Results should be an array');
        results.forEach(user => {
            assert(user.type === 'admin', 'User type should be admin');
        });
        console.log('testReadAllAdmins passed.');
    });
}

function testAreValid(email, password) {
    userModel.areValid(email, password, function(isValid) {
        assert(typeof isValid === 'boolean', 'Result should be a boolean');
        console.log('testAreValid passed.');
    });
}

function testCreate(email, password, nom, prenom, tel, type, organisation) {
    userModel.creat(email, password, nom, prenom, tel, type, organisation, function(results) {
        assert(results.affectedRows === 1, 'One row should be inserted');
        console.log('testCreate passed.');
    });
}

function testDelete(id_user) {
    userModel.delete(id_user, function(results) {
        assert(results.affectedRows === 1, 'One row should be deleted');
        console.log('testDelete passed.');
    });
}

// Execute tests with sample data
const sampleEmail = 'recrut.AXY@example.fr';
const samplePassword = 'recrut.AXY@example.fr';
const sampleIdUser = 46;
const sampleNom = 'Test';
const samplePrenom = 'User';
const sampleTel = '1234567890';
const sampleType = 'candidat';
const sampleOrganisation = null;

// testReadAll();
testReadAllWithPagination();
// testReadByEmail(sampleEmail);
// testReadById(sampleIdUser);
// testReadAllRecruiters();
// testReadAllCandidats();
// testReadAllAdmins();
// testAreValid(sampleEmail, samplePassword);
// testCreate(sampleEmail, samplePassword, sampleNom, samplePrenom, sampleTel, sampleType, sampleOrganisation);
// testDelete(sampleIdUser);
