const express = require('express');
const router = express.Router();
var userModel = require('../model/users');
var demandeModel = require('../model/demande_a_rejoindre');
var demandeOrgModel = require('../model/ajout_organisation');
var organisationModel = require('../model/organisation');
const nodemailer = require('nodemailer');

module.exports = (transporter) => {

    // http://localhost:3000/admin/home
    router.get('/home', (req, res) => {
        res.render('admin', { title: 'Home'});
    });

    /* ------------------------- MANAGE USERS ------------------------- */

    // http://localhost:3000/admin/mng_users
    router.get('/mng_users', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 8; // Nombre de résultats par page
        var offset = (page - 1) * limit;

        userModel.readallwithpagination(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('mng_users', {
                title: 'Manage users',
                users: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_activ_change?id=[?]
    router.get('/mng_users/confirm_activ_change', function(req, res, next) {
        const userId = req.query.id;
        console.log('confirm_activ_change - userId:', userId); // Log userId

        userModel.readbyid(userId, function(user) {
            if (user[0].actif == 1) {
                if (user.length > 0) {
                    res.render('confirm_action', {
                        message: `Do you really want to deactivate user: ${user[0].prenom} ${user[0].nom}?`,
                        actionUrl: '/admin/mng_users/confirm_deactivation',
                        user: user[0]
                    });
                } else {
                    res.status(404).send('User not found');
                }
            } else {
                if (user.length > 0) {
                    res.render('confirm_action', {
                        message: `Do you really want to activate user: ${user[0].prenom} ${user[0].nom}?`,
                        actionUrl: '/admin/mng_users/confirm_activation',
                        user: user[0]
                    });
                } else {
                    res.status(404).send('User not found');
                }
            }
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_deactivation
    router.post('/mng_users/confirm_deactivation', function(req, res, next) {
        const userId = req.body.id;
        userModel.deactivate(userId, function(result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_users'); // Redirige vers la liste des utilisateurs après activation
            } else {
                res.status(404).send('User not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_activation
    router.post('/mng_users/confirm_activation', function(req, res, next) {
        const userId = req.body.id;
        userModel.activate(userId, function(result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_users'); // Redirige vers la liste des utilisateurs après activation
            } else {
                res.status(404).send('User not found');
            }
        });
    });
    
    // http://localhost:3000/admin/mng_users/confirm_delete?id=[?]
    router.get('/mng_users/confirm_delete', function(req, res, next) {
        const userId = req.query.id;
        userModel.readbyid(userId, function(user) {
            if (user.length > 0) {
                res.render('confirm_action', {
                    message: `Do you really want to delete user: ${user[0].prenom} ${user[0].nom}?`,
                    actionUrl: '/admin/mng_users/delete',
                    user: user[0]
                });
            } else {
                res.status(404).send('User not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_users/delete
    router.post('/mng_users/delete', function(req, res, next) {
        const userId = req.body.id;
        userModel.delete(userId, function(result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_users'); // Redirige vers la liste des utilisateurs après suppression
            } else {
                res.status(404).send('User not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_admin_access?id=[?]
    router.get('/mng_users/confirm_admin_access', function(req, res, next) {
        const userId = req.query.id;
        userModel.readbyid(userId, function(user) {
            console.log('confirm_admin_access - user:', user); // Log user
            if (user.length > 0) {
                res.render('confirm_action', {
                    message: `Do you really want to give admin access to user: ${user[0].prenom} ${user[0].nom}?`,
                    actionUrl: '/admin/mng_users/give_admin_access',
                    user: user[0]
                });
            } else {
                res.status(404).send('User not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_users/give_admin_access
    router.post('/mng_users/give_admin_access', function(req, res, next) {
        const userId = req.body.id; // Utilisez req.body.id pour les requêtes POST
        userModel.readbyid(userId, function(results) {
            if (results.length > 0) {
              const email = results[0].adresse_mail;
              userModel.promoteToAdmin(userId, function(result) {
                console.log('give_admin_access - result:', result); // Log result
                if (result.affectedRows > 0) {
                    // Envoyer un email de notification
                    const mailOptions = {
                        from: 'talentthrive@hotmail.com',
                        to: email,
                        subject: 'Administrator access granted!',
                        text: `Hello,\n\nYou have been granted administrator access.\n\nThanks,\nThe Recruitment team`
                    };
    
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.error('Error sending email:', err);
                            return res.status(500).render('error', { message: 'Admin access granted but email could not be sent.' });
                        }
                        console.log('Email sent:', info.response);
                        res.render('registration_validated', { title: 'Successful registration' });
                    });
                    res.redirect('/admin/mng_users'); // Redirige vers la liste des utilisateurs après promotion
                } else {
                    res.status(404).send('User not found or already an admin');
                }
            });

            }
            else {
                res.status(404).send('User not found');
            }
        }); 
    });

    // http://localhost:3000/admin/mng_users/update_users
    router.get('/mng_users/update_users', function(req, res, next) {
        const userId = req.query.id;
        organisationModel.selectSiren(function(result) {
            userModel.readbyid(userId, function(user) {
                if (user.length > 0) {
                    res.render('update_users', { 
                        title: 'Update', 
                        user: user[0],
                        sirens: result 
                    });
                } else {
                    res.status(404).send('User not found');
                }
            });
        });
    });

    // http://localhost:3000/admin/mng_users/update_users
    router.post('/mng_users/update_users/', (req, res) => {
        const userId = req.body.id;
        const { surname, name, tel, recruiter, siren } = req.body;

        userModel.readbyid(userId, function (results) {
            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            // Vérifiez que les champs requis sont remplis
            if (!surname && !name && !tel) {
                return res.render('error', { message: 'Please provide at least one field to update', error: {} });
            }

            if (recruiter === 'yes' && !siren) {
                return res.render('error', { message: 'Please provide the SIREN number', error: {} });
            }

            const updateData = {
                surname,
                name,
                tel,
                recruiter,
                siren
            };

            res.render('confirm_update', {
                message: `Do you really want to update user: ${results[0].prenom} ${results[0].nom}?`,
                actionUrl: '/admin/mng_users/confirm_update',
                user: results[0],
                updateData: updateData,
                operation: 'update_user'
            });
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_update
    router.post('/mng_users/confirm_update', (req, res) => {
        const userId = req.body.id;
        const { surname, name, tel, recruiter, siren } = req.body;

        // Construire dynamiquement la requête UPDATE
        let updateValues = [];

        if (surname) {
            updateValues.push(`nom = '${surname}'`);
        }
        if (name) {
            updateValues.push(`prenom = '${name}'`);
        }
        if (tel) {
            updateValues.push(`tel = '${tel}'`);
        }

        if (recruiter === 'yes') {
            updateValues.push(`type = 'recruteur'`);
            updateValues.push(`organisation = '${siren}'`);
        } else if (req.body.admin === '1') {
            updateValues.push(`type = 'admin'`);
            updateValues.push(`organisation = NULL`);
        } else {
            updateValues.push(`type = 'candidat'`);
            updateValues.push(`organisation = NULL`);
        }

        userModel.updateUser(userId, updateValues, function (result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_users'); // Redirige vers la liste des utilisateurs après mise à jour
            } else {
                res.status(404).send('User not found or already up-to-date');
            }
        });
    });



    /* ------------------------- MANAGE ORGANIZATIONS ------------------------- */

    // http://localhost:3000/admin/mng_org
    router.get('/mng_org', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;

        organisationModel.readallwithpagination(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('mng_org', {
                title: 'Manage organizations',
                organisations: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_org/org_processed_acc
    router.get('/mng_org/org_processed_acc', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;
        
        demandeOrgModel.readOrganizationsAlreadyReviewedAcc(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('org_processed_acc', {
                title: 'Processed',
                demandes: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_org/org_processed_ref
    router.get('/mng_org/org_processed_ref', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;
        
        demandeOrgModel.readOrganizationsAlreadyReviewedRef(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('org_processed_ref', {
                title: 'Processed',
                demandes: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_org/org_unprocessed
    router.get('/mng_org/org_unprocessed', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;
        
        demandeOrgModel.readOrganizationsNotReviewed(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('org_unprocessed', {
                title: 'UnProcessed',
                demandes: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_org/confirm_adding_org?id=[?]
    router.get('/mng_org/confirm_adding_org', function(req, res, next) {
        const siren = req.query.id;
        demandeOrgModel.selectBySiren(siren, function(err, org) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal server error');
            }
            
            console.log('Organization object received:', org);

            if (org && org.length > 0) {
                res.render('confirm_action_for_org', {
                    message: `Do you really want to add - Organization: '${org[0].nom}', SIREN: ${org[0].siren} - suggested?`,
                    actionUrl: '/admin/mng_org/add_organization',
                    org: org[0]
                });
            } else {
                res.status(404).send('Organization not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_org/add_organization
    router.post('/mng_org/add_organization', function(req, res, next) {
        const siren = req.body.id;
        demandeOrgModel.acceptAdding(siren, function(result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_org');
            } else {
                res.status(404).send('Organisation not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_org/confirm_deleting_org?id=[?]
    router.get('/mng_org/confirm_deleting_org', function(req, res, next) {
        const siren = req.query.id;
        demandeOrgModel.selectBySiren(siren, function(err, org) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal server error');
            }
    
            console.log('Organization object received:', org);
            if (org && org.length > 0) {
                res.render('confirm_action_for_org', {
                    message: `Do you really want to delete - Organization: '${org[0].nom}', SIREN: ${org[0].siren} - suggested?`,
                    actionUrl: '/admin/mng_org/delete_organization',
                    org: org[0]
                });
            } else if (org === null || org === undefined) {
                res.status(500).send('Internal server error: org is null or undefined');
            } else {
                res.status(404).send('Organization not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_org/delete_organization
    router.post('/mng_org/delete_organization', function(req, res, next) {
        const siren = req.body.id;
        console.log(siren);
        demandeOrgModel.refuseAdding(siren, function(result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_org'); 
            } else {
                res.status(404).send('Organization not found');
            }
        });
    });


    /* ------------------------- MANAGE RECRUITERS ------------------------- */

    // http://localhost:3000/admin/mng_recruiters
    router.get('/mng_recruiters', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;

        userModel.readallrecruiters(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('mng_rct', {
                title: 'Manage recruiters',
                users: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });
    // http://localhost:3000/admin/mng_recruiters/processed
    router.get('/mng_recruiters/processed', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;
        
        demandeModel.readApplicationsAlreadyreviewed(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('join_requests_processed', {
                title: 'Processed',
                demandes: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_acceptation?id=[?]
    router.get('/mng_users/confirm_acceptation', function(req, res, next) {
        const userId = req.query.id;
        userModel.readbyid(userId, function(user) {
            if (user.length > 0) {
                res.render('confirm_action', {
                    message: `Do you really want to accept ${user[0].prenom} ${user[0].nom} demand to become a recruiter?`,
                    actionUrl: '/admin/mng_users/accept_recruiter',
                    user: user[0]
                });
            } else {
                res.status(404).send('User not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_users/accept_recruiter
    router.post('/mng_users/accept_recruiter', function(req, res, next) {
        const userId = req.body.id;
        demandeModel.acceptJoining(userId, function(err, result) {
            if (err) {
                console.error("Error: ", err);
                return res.status(500).send('Error executing query');
            }

            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_recruiters'); 
            } else {
                res.status(404).send('User not found');
            }
        });
    });
    // http://localhost:3000/admin/mng_recruiters/unprocessed
    router.get('/mng_recruiters/unprocessed', function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10; // Nombre de résultats par page
        var offset = (page - 1) * limit;
        
        demandeModel.readApplicationsNotReviewed(limit, offset, function(result, totalCount) {
            var totalPages = Math.ceil(totalCount / limit);
            res.render('join_requests_unprocessed', {
                title: 'Unprocessed',
                demandes: result,
                currentPage: page,
                totalPages: totalPages,
                limit: limit
            });
        });
    });

    // http://localhost:3000/admin/mng_users/confirm_refusing?id=[?]
    router.get('/mng_users/confirm_refusing', function(req, res, next) {
        const userId = req.query.id;
        userModel.readbyid(userId, function(user) {
            if (user.length > 0) {
                res.render('confirm_action', {
                    message: `Do you really want to refuse ${user[0].prenom} ${user[0].nom} demand to become a recruiter?`,
                    actionUrl: '/admin/mng_users/refuse_recruiter',
                    user: user[0]
                });
            } else {
                res.status(404).send('User not found');
            }
        });
    });

    // http://localhost:3000/admin/mng_users/refuse_recruiter
    router.post('/mng_users/refuse_recruiter', function(req, res, next) {
        const userId = req.body.id;
        demandeModel.refuseJoining(userId, function(result) {
            if (result.affectedRows > 0) {
                res.redirect('/admin/mng_recruiters'); 
            } else {
                res.status(404).send('User not found');
            }
        });
    });
    
    return router;
}; 