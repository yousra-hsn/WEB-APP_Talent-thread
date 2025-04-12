const express = require('express');
const router = express.Router();
const moment = require('moment');
const ficheDePosteModel = require('../model/fiche_de_poste');
const organisationModel = require('../model/organisation');
const demandeModel = require('../model/demande_a_rejoindre');
const adresseModel = require('../model/adresse');
const ajoutOrganisationModel = require('../model/ajout_organisation');
const offreModel = require('../model/offres');
const candidatureModel = require('../model/candidatures');
const pieceJointeModel = require('../model/piece_jointe'); 
require('moment/locale/fr');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { type } = require('os');

// ------- FILE UPLOAD CONFIGURATION -------

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', req.params.id_offre);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        console.log(`Saving file to: ${uploadDir}`);
        cb(null, uploadDir); // Chemin où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        console.log(`Saving file as: ${filename}`);
        cb(null, filename); // Nom du fichier
    }
});

const upload = multer({ storage: storage });

// ------- END FILE UPLOAD CONFIGURATION -------

// http://localhost:3000/candidate/home
router.get('/home', function(req, res, next) {
    result = offreModel.readAllWithDetails(function(result){
        res.render('candidate', { title : 'Job Ads', fiches : result, userType: req.session.userRole});
    });
});

// http://localhost:3000/candidate/job_ads
router.get('/job_ads', function(req, res, next) {
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'date_validite';
    const order = req.query.order || 'desc';

    offreModel.readAllWithPagination(limit, offset, search, sortBy, order, function(err, result, totalCount) {
        if (err) {
            console.error('Error retrieving job ads:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Calculer le nombre total de pages
        const totalPages = Math.ceil(totalCount / limit);

        res.render('job_ads', { 
            title: 'Job Ads', 
            offres: result, 
            totalCount: totalCount, 
            totalPages: totalPages,
            limit: limit,
            offset: offset,
            search: search,
            sortBy: sortBy,
            order: order,
            userType: req.session.userRole 
        });
    });
});


// http://localhost:3000/candidate/job_ads/:id_offre 
router.get('/job_ads/:id_offre', function(req, res, next) {
    const id_offre = req.params.id_offre;
    offreModel.readAllWithDetailsById(id_offre, function(err, result) {
        console.log('result:', result);
        if (err) {
            console.error('Error reading job ad details:', err); // Log de l'erreur
            return res.status(500).send('Internal Server Error');
        }
        if (!result) {
            console.log('Job Ad not found for id:', id_offre); // Log si aucune offre n'est trouvée
            return res.status(404).send('Job Ad not found');
        }
        res.render('view', { title: 'Job Ads', offre: result, userType: req.session.userRole});
    });
});

// http://localhost:3000/candidate/job_ads/apply/:id_offre
router.get('/job_ads/apply/:id_offre', function(req, res, next) {
    const id_offre = req.params.id_offre;
    offreModel.readAllWithDetailsById(id_offre, function(err, offre) {
        if (err) {
            return next(err);
        }
        if (!offre) {
            return res.status(404).send('Job offer not found');
        }
        res.render('apply_form', { title: 'Apply for Job', offre: offre, userType: req.session.userRole });
    });
});

// http://localhost:3000/candidate/job_ads/apply/:id_offre
router.post('/job_ads/apply/:id_offre', upload.array('attachments', 10), function(req, res, next) {
    console.log('POST /candidate/job_ads/apply/:id_offre');
    const id_offre = req.params.id_offre;
    const id_candidat = req.session.userId;
    const attachments = req.files.map(file => path.join('uploads', req.params.id_offre, file.filename));
    const dateCandidature = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const infos_supp = req.body.infos_supp;
    console.log('id_offre:', id_offre);
    console.log('id_candidat:', id_candidat);
    console.log('attachments:', attachments);
    console.log('dateCandidature:', dateCandidature);
    console.log('infos_supp:', infos_supp);

    // Vérifier que les champs ont le bon format
    if (infos_supp.length > 500) {
        return res.render('error', { message: 'Additional information must be less than 500 characters.' });
    }

    candidatureModel.checkExistingApplication(id_candidat, id_offre, function(err, exists) {
        if (err) {
            console.error('Error checking existing application:', err);
            return next(err);
        }

        if (exists) {
            return res.render('error', { message: 'You have already applied for this job.' });
        }

        candidatureModel.insertApplication(id_candidat, id_offre, dateCandidature, infos_supp, function(err, result) {
            if (err) {
                console.error('Error inserting into Candidate table:', err);
                return next(err);
            }

            if (attachments.length > 0) {
                const pieceJointeValues = attachments.map(path => [path, id_offre, id_candidat]);
                pieceJointeModel.insertPieceJointe(pieceJointeValues, function(err, result) {
                    if (err) {
                        console.error('Error inserting into Piece_jointe table:', err);
                        return next(err);
                    }

                    res.render('display', { title: 'Application Submitted', message: 'Your application has been submitted successfully.' });
                });
            } else {
                res.render('display', { title: 'Application Submitted', message: 'Your application has been submitted successfully.' });
            }
        });
    });
});

// http://localhost:3000/candidate/applications
router.get('/applications', (req, res) => {
    const id_candidat = req.session.userId;
    candidatureModel.readbycandidateid(id_candidat, function(results) {
        results.forEach(function(candidature) {
            candidature.date_candidature = moment(candidature.date_candidature).format('LL');
        });
        res.render('applications', {
            title: 'Liste des candidatures',
            candidatures: results,
            userType: req.session.userRole
        });
    });
});

// http://localhost:3000/candidate/applications/update/:id_offre
router.get('/applications/update/:id_offre', function(req, res, next) {
    console.log('GET /candidate/applications/update/:id_offre');
    const id_offre = req.params.id_offre;
    const id_candidat = req.session.userId;
    console.log('id_offre:', id_offre);
    console.log('id_candidat:', id_candidat);

    candidatureModel.getCandidateApplication(id_candidat, id_offre, function(err, candidature) {
        if (err) {
            console.error('Error fetching candidate application:', err);
            return next(err);
        }

        if (!candidature) {
            console.log('Candidature not found for candidate:', id_candidat, 'and job offer:', id_offre);
            return res.status(404).send('Candidature not found');
        }

        console.log('candidature:', candidature);

        // Vérifier si l'offre est toujours disponible
        offreModel.readById(id_offre, function(err, offre) {
            if (err) {
                console.error('Error fetching job offer:', err);
                return next(err);
            }

            if (!offre || offre.etat !== 'publiee' || new Date(offre.date_validite) < new Date()) {
                console.log('This job offer is no longer available:', id_offre);
                return res.render('error', { message: 'This job offer is no longer available.' });
            }

            console.log('offre:', offre);

            res.render('update_application', {
                title: 'Update Application',
                candidature: candidature,
                offre: offre,
                userType: req.session.userRole
            });
        });
    });
});

// http://localhost:3000/candidate/applications/update/:id_offre
router.post('/applications/update/:id_offre', upload.array('attachments', 10), function(req, res, next) {
    console.log('POST /candidate/applications/update/:id_offre');
    const id_offre = req.params.id_offre;
    const id_candidat = req.session.userId;
    const newAttachments = req.files.map(file => path.join('uploads', req.params.id_offre, file.filename));
    const infos_supp = req.body.infos_supp;
    console.log('id_offre:', id_offre);
    console.log('id_candidat:', id_candidat);
    console.log('newAttachments:', newAttachments);
    console.log('infos_supp:', infos_supp);

    // Récupérer les données actuelles de la candidature
    candidatureModel.getCandidateApplication(id_candidat, id_offre, function(err, candidature) {
        if (err) {
            console.error('Error fetching candidate application:', err);
            return next(err);
        }

        if (!candidature) {
            console.log('Candidature not found for candidate:', id_candidat, 'and job offer:', id_offre);
            return res.status(404).send('Candidature not found');
        }

        // Préparer les données à mettre à jour
        const updatedData = {
            infos_supp: infos_supp || candidature.infos_supp
        };

        candidatureModel.updateApplication(id_candidat, id_offre, updatedData, function(err, result) {
            if (err) {
                console.error('Error updating Candidate table:', err);
                return next(err);
            }

            if (newAttachments.length > 0) {
                // Supprimer les anciennes pièces jointes remplacées par de nouvelles
                pieceJointeModel.getPathsByCandidateAndOffer(id_candidat, id_offre, function(err, oldAttachments) {
                    if (err) {
                        console.error('Error fetching old attachments:', err);
                        return next(err);
                    }

                    const newAttachmentsSet = new Set(newAttachments);
                    const attachmentsToDelete = oldAttachments.filter(path => !newAttachmentsSet.has(path));

                    pieceJointeModel.deleteSpecificAttachments(attachmentsToDelete, function(err) {
                        if (err) {
                            console.error('Error deleting old attachments:', err);
                            return next(err);
                        }

                        // Conserver les pièces jointes non remplacées
                        const finalAttachments = oldAttachments.filter(path => newAttachmentsSet.has(path)).concat(newAttachments);
                        
                        const pieceJointeValues = finalAttachments.map(path => [path, id_offre, id_candidat]);
                        pieceJointeModel.insertPieceJointe(pieceJointeValues, function(err, result) {
                            if (err) {
                                console.error('Error inserting new attachments into Piece_jointe table:', err);
                                return next(err);
                            }

                            res.render('display', { title: 'Application Updated', message: 'Your application has been updated successfully.' });
                        });
                    });
                });
            } else {
                res.render('display', { title: 'Application Updated', message: 'Your application has been updated successfully.' });
            }
        });
    });
});

// http://localhost:3000/candidate/applications/delete/:id_offre
router.post('/applications/delete/:id_offre', function(req, res, next) {
    console.log('POST /candidate/applications/delete/:id_offre');
    const id_offre = parseInt(req.params.id_offre, 10);
    const id_candidat = parseInt(req.session.userId, 10);

    if (isNaN(id_offre) || isNaN(id_candidat)) {
        return res.status(400).send('Invalid ID');
    }

    // Supprimer les pièces jointes associées à la candidature
    pieceJointeModel.deleteByCandidateAndOffer(id_candidat, id_offre, function(err) {
        if (err) {
            console.error('Error deleting attachments:', err);
            return next(err);
        }

        // Supprimer la candidature
        candidatureModel.deleteApplication(id_candidat, id_offre, function(err, result) {
            if (err) {
                console.error('Error deleting application:', err);
                return next(err);
            }

            res.redirect('/candidate/applications');
        });
    });
});

// http://localhost:3000/candidate/apply_for_recruiter
router.get('/apply_for_recruiter', function(req, res, next) {
    result = organisationModel.readallwithaddress(function(err, result) {
        if (err) {
            console.error('Error retrieving organisations:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('apply_for_recruiter', { title: 'Become recruiter', organisations: result });
    });
});

// http://localhost:3000/candidate/apply_for_recruiter
router.post('/apply_for_recruiter', function(req, res, next) {
    console.log('POST /candidate/apply_for_recruiter');
    console.log('req.body:', req.body);
    const id_candidat = req.session.userId;
    console.log('id_candidat:', id_candidat);
    const id_organisation = req.body.organisation;
    console.log('id_organisation:', id_organisation);
    const date_demande = new Date().toISOString().slice(0, 10); // Format MySQL
    console.log('date_demande:', date_demande);
    const traitement = 0; // Par défaut, demande non traitée (0)
    console.log('traitement:', traitement);

    // Vérifier que les champs obligatoires sont remplis
    if (!id_organisation) {
        return res.render('error', { message: 'Please select an organisation.' });
    }

    // Vérifier si une demande est déjà en cours, peu importe l'organisation
    demandeModel.checkDemande(id_candidat, function(err, result) {
        if (err) {
            console.error('Error checking existing request:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result && result.length > 0) {
            console.log('Request already exists for candidate:', id_candidat);
            return res.render('error', { message: 'You have already submitted a request.' });
        }

        // Insérer la nouvelle demande si aucune demande existante n'est trouvée
        demandeModel.insertDemande(id_candidat, id_organisation, date_demande, traitement, function(err, results) {
            if (err) {
                console.error("Erreur lors de l'insertion de la demande:", err);
                return res.status(500).send("An error occurred while inserting the request.");
            }
            res.render('display', { title: 'Request Submitted', message: 'Your request has been submitted successfully.' });
        });
    });
});


// http://localhost:3000/candidate/add_organization
router.get('/add_organization', function(req, res, next) {
    console.log('GET /candidate/add_organization');
    organisationModel.selectType(function(err, result) {
        if (err) {
            console.error('Error retrieving organisation types:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Ajoutez un log pour vérifier les résultats
        console.log('Results from selectType:', result);
        res.render('add_organization', { title: 'Add an organization', types: result });
    });
});

// http://localhost:3000/candidate/add_organization
router.post('/add_organization', function(req, res, next) {
    console.log('POST /candidate/add_organization');
    console.log('req.body:', req.body);

    const { siren, name, type, number, street, city, country } = req.body;
    console.log('siren:', siren);
    console.log('name:', name);
    console.log('type:', type);
    console.log('number:', number);
    console.log('street:', street);
    console.log('city:', city);
    console.log('country:', country);

    // Vérifier que tous les champs obligatoires sont remplis
    if (!siren || !name || !type || !number || !street || !city || !country) {
        return res.render('error', { message: 'Please fill in all required fields.' });
    }

    // Vérifier si le SIREN est valide
    if (siren.length !== 9) {
        return res.render('error', { message: 'Invalid SIREN, must be 9 digits.' });
    }

    // Vérifier si une demande a déjà été faite pour cette organisation par SIREN
    ajoutOrganisationModel.selectBySiren(siren, function(err, result) {
        if (err) {
            console.error('Error retrieving request by SIREN:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result && result.length > 0) {
            console.log('Request already exists for SIREN:', siren);
            return res.render('error', { message: 'A request already exists for this SIREN.' });
        }

        // Vérifier si une demande a déjà été faite pour cette organisation par nom
        ajoutOrganisationModel.selectByName(name, function(err, result) {
            if (err) {
                console.error('Error retrieving request by name:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result && result.length > 0) {
                console.log('Request already exists for name:', name);
                return res.render('error', { message: 'A request already exists for this name.' });
            }

            // Vérifier si l'organisation existe déjà par SIREN
            organisationModel.readbysiren(siren, function(err, result) {
                if (err) {
                    console.error('Error retrieving organisation by SIREN:', err);
                    return res.status(500).send('Internal Server Error');
                }
                if (result && result.length > 0) {
                    console.log('Organization already exists with SIREN:', siren);
                    return res.render('error', { message: 'An organization already exists with this SIREN.' });
                }

                // Vérifier si l'organisation existe déjà par nom
                organisationModel.readByName(name, function(err, result) {
                    if (err) {
                        console.error('Error retrieving organisation by name:', err);
                        return res.status(500).send('Internal Server Error');
                    }
                    if (result && result.length > 0) {
                        console.log('Organization already exists with name:', name);
                        return res.render('error', { message: 'An organization already exists with this name.' });
                    }

                    // Insérer la demande d'ajout de l'organisation
                    ajoutOrganisationModel.insertRequestToAdd(siren, name, type, number, street, city, country, function(err, result) {
                        if (err) {
                            console.error('Error inserting request:', err);
                            return res.status(500).send('Internal Server Error');
                        }
                        if (result.affectedRows === 1) {
                            console.log('Request inserted successfully:', result);
                            res.render('display', { title: 'Request Submitted', message: 'Your request has been submitted successfully.' });
                        } else {
                            console.error('Failed to insert request:', result);
                            res.status(500).send('Failed to insert request');
                        }
                    });
                });
            });
        });
    });
});

module.exports = router;