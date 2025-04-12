const express = require('express');
const offreModel = require('../model/offres');
const userModel = require('../model/users');
const candidatureModel = require('../model/candidatures');
const ficheDePosteModel = require('../model/fiche_de_poste');
const addressModel = require('../model/adresse');
const multer = require('multer');

const router = express.Router();

// ----- FILE UPLOADS -----
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

// ----- ROUTES -----

// http://localhost:3000/recruiter/home
router.get('/home', (req, res) => {
    res.render('recruiter', { title: 'Welcome Recruiter !'});
});

// http://localhost:3000/recruiter/job_ads
router.get('/job_ads', (req, res) => {
    const id_user = req.session.userId;
    console.log('id_user:', id_user);

    // Retrieve organisation siren from recruiter
    userModel.readUserOrganisation(id_user, (err, organisation) => {
        if (err) {
            console.error('Error retrieving organisation by id_user:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }

        if (!organisation) {
            console.error('No organisation found with id_user:', id_user);
            return res.status(401).render('error', { message: 'Organisation not found', error: {} });
        }
        console.log('organisation:', organisation);

        // Retrieve job ads from organisation siren
        offreModel.readAllByOrganisation(organisation, (err, offres) => { // organisation.organisation
            if (err) {
                console.error('Error retrieving job ads by siren:', err);
                return res.status(500).render('error', { message: 'Internal server error', error: err });
            }

            console.log('offres:', offres);
            res.render('recruiter_job_ads', { title: 'Job Ads', offres: offres });
        });
    });
});

// http://localhost:3000/recruiter/job_ads/active_job_ads
router.get('/job_ads/active_job_ads', (req, res) => {
    const id_user = req.session.userId;
    const limit = parseInt(req.query.limit) || 3;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';

    console.log('id_user:', id_user);

    // Retrieve organisation siren from recruiter
    userModel.readUserOrganisation(id_user, (err, organisation) => {
        if (err) {
            console.error('Error retrieving organisation by id_user:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }

        if (!organisation) {
            console.error('No organisation found with id_user:', id_user);
            return res.status(401).render('error', { message: 'Organisation not found', error: {} });
        }
        console.log('organisation:', organisation);

        // Retrieve active job ads from organisation siren with pagination and search
        offreModel.readActiveWithPagination(organisation, limit, offset, search, (err, offres, totalCount) => {
            if (err) {
                console.error('Error retrieving active job ads by siren:', err);
                return res.status(500).render('error', { message: 'Internal server error', error: err });
            }

            console.log('offres:', offres);
            const totalPages = Math.ceil(totalCount / limit);
            res.render('active_job_ads', { 
                title: 'Active Job Ads', 
                offres: offres, 
                totalPages: totalPages, 
                currentPage: Math.floor(offset / limit) + 1, 
                search: search, 
                limit: limit 
            });
        });
    });
});


// http://localhost:3000/recruiter/job_ads/expired_job_ads
router.get('/job_ads/expired_job_ads', (req, res) => {
    const id_user = req.session.userId;
    const limit = parseInt(req.query.limit) || 3;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';

    console.log('id_user:', id_user);

    // Retrieve organisation siren from recruiter
    userModel.readUserOrganisation(id_user, (err, organisation) => {
        if (err) {
            console.error('Error retrieving organisation by id_user:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }

        if (!organisation) {
            console.error('No organisation found with id_user:', id_user);
            return res.status(401).render('error', { message: 'Organisation not found', error: {} });
        }
        console.log('organisation:', organisation);

        // Retrieve inactive job ads from organisation siren with pagination and search
        offreModel.readExpiredWithPagination(organisation, limit, offset, search, (err, offres, totalCount) => {
            if (err) {
                console.error('Error retrieving inactive job ads by siren:', err);
                return res.status(500).render('error', { message: 'Internal server error', error: err });
            }

            console.log('offres:', offres);
            const totalPages = Math.ceil(totalCount / limit);
            res.render('expired_job_ads', { title: 'Expired Job Ads', offres: offres, totalPages: totalPages, currentPage: Math.floor(offset / limit) + 1, search: search, limit: limit });
        });
    });
});


// http://localhost:3000/recruiter/job_ads/new 
router.get('/job_ads/new', function(req, res, next) {
    const id_user = req.session.userId;

    console.log('id_user:', id_user);

    userModel.readUserOrganisation(id_user, (err, organisation) => {
        if (err) {
            console.error('Error retrieving organisation by id_user:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }

        if (!organisation) {
            console.log('No organisation found for user:', id_user);
            return res.status(404).render('error', { message: 'No organisation found for this user.' });
        }

        const siren = organisation;
        console.log('siren:', siren);

        ficheDePosteModel.readByOrganisation(siren, (err, data) => {
            if (err) {
                console.error('Error retrieving job descriptions and recruiters:', err);
                return next(err);
            }

            const { fichesDePoste, recruteurs } = data;
            console.log('fichesDePoste:', fichesDePoste);
            console.log('recruteurs:', recruteurs);

            res.render('new_job_ad', { fichesDePoste, recruteurs });
        });
    });
});

// http://localhost:3000/recruiter/job_ads/new
router.post('/job_ads/new', function(req, res, next) {
    const {
        fiche_de_poste,
        etat,
        date_validite,
        description_pieces,
        nombre_piece_obligatoire,
        recruteur
    } = req.body;

    console.log('fiche_de_poste:', fiche_de_poste);

    // Valider les champs du formulaire
    if (!fiche_de_poste || !etat || !date_validite || !description_pieces || !nombre_piece_obligatoire || !recruteur) {
        return res.render('error', { message: 'All fields are required' });
    }

    // Vérifier les types des champs
    if (typeof fiche_de_poste !== 'string' || typeof etat !== 'string' || typeof date_validite !== 'string' || typeof description_pieces !== 'string' || typeof nombre_piece_obligatoire !== 'string' || typeof recruteur !== 'string') {
        return res.render('error', { message: 'All fields must be strings' });
    }

    // Récupérer la fiche de poste pour vérifier la validité
    ficheDePosteModel.getById(fiche_de_poste, function(err, fiche) {
        if (err) {
            console.error('Error retrieving job description:', err);
            return res.status(500).send('Internal server error');
        }

        if (!fiche) {
            return res.render('error', { message: 'Job description not found' });
        }

        // Comparer la date de fin de validité de la fiche de poste avec la date actuelle
        const currentDate = new Date();
        const validUntilDate = new Date(fiche.date_fin_validite);
        const offerValidUntilDate = new Date(date_validite);

        console.log('currentDate:', currentDate);
        console.log('validUntilDate:', validUntilDate);
        console.log('offerValidUntilDate:', offerValidUntilDate);

        if (currentDate > validUntilDate) {
            return res.render('error', { message: 'The job description is no longer valid' });
        }

        // Vérifier que la date de fin de validité de l'offre est inférieure ou égale à celle de la fiche de poste
        if (offerValidUntilDate > validUntilDate) {
            return res.render('error', { message: 'The offer validity date must be greater than or equal to the job description validity date' });
        }

        // Vérifier que le nombre d'offres associé à la fiche de poste n'a pas été dépassé
        offreModel.countByFicheDePoste(fiche_de_poste, function(err, count) {
            if (err) {
                console.error('Error counting job offers:', err);
                return res.status(500).send('Internal server error');
            }

            if (count >= fiche.nombre_offres) {
                return res.render('error', { message: 'The number of job offers for this job description has been exceeded' });
            }

            // Préparer les données pour l'insertion
            const newOffer = {
                fiche_de_poste: fiche_de_poste,
                etat: etat,
                date_validite: date_validite,
                description_pieces: description_pieces,
                nombre_piece_obligatoire: parseInt(nombre_piece_obligatoire, 10),
                recruteur: recruteur
            };

            console.log('newOffer:', newOffer);

            // Insérer les données dans la base de données
            offreModel.create(newOffer, function(err, result) {
                if (err) {
                    console.error('Error inserting new job offer:', err);
                    return res.status(500).send('Internal server error');
                }

                res.render('display', { message: 'Job offer created successfully' });
            });
        });
    });
});

// http://localhost:3000/recruiter/job_ads/edit/:id_offre
router.get('/job_ads/edit/:id_offre', function(req, res, next) {
    const id_offre = req.params.id_offre;

    offreModel.readById(id_offre, function(err, offre) {
        if (err) {
            console.error('Error retrieving job offer:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }

        res.render('edit_job_ad', { title: 'Edit Job Ad', offre: offre });
    });
});

// http://localhost:3000/recruiter/job_ads/edit/:id_offre
router.post('/job_ads/edit/:id_offre', function(req, res, next) {
    const id_offre = req.params.id_offre;
    const {
        etat,
        date_validite,
        description_pieces,
        nombre_piece_obligatoire
    } = req.body;

    // Valider les champs du formulaire
    if (!etat || !date_validite || !description_pieces || !nombre_piece_obligatoire) {
        return res.render('error', { message: 'All fields are required' });
    }

    // Vérifier les types des champs
    if (typeof etat !== 'string' || typeof date_validite !== 'string' || typeof description_pieces !== 'string' || typeof nombre_piece_obligatoire !== 'string') {
        return res.render('error', { message: 'All fields must be strings' });
    }

    offreModel.readById(id_offre, function(err, offre) {
        if (err) {
            console.error('Error retrieving job offer:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }

        if (new Date(date_validite) < new Date(offre.date_validite)) {
            return res.render('error', { message: 'The validity date can only be extended' });
        }

        const updatedOffer = {
            id_offre: id_offre,
            etat: etat,
            date_validite: date_validite,
            description_pieces: description_pieces,
            nombre_piece_obligatoire: parseInt(nombre_piece_obligatoire, 10)
        };

        offreModel.update(updatedOffer, function(err, result) {
            if (err) {
                console.error('Error updating job offer:', err);
                return res.status(500).send('Internal server error');
            }

            res.render('display', { message: 'Job offer updated successfully' });
        });
    });
});

// http://localhost:3000/recruiter/job_ads/delete/:id_offre
router.post('/job_ads/delete/:id_offre', function(req, res, next) {
    const id_offre = req.params.id_offre;

    offreModel.delete(id_offre, function(err, result) {
        if (err) {
            console.error('Error deleting job offer:', err);
            return res.status(500).send('Internal server error');
        }

        res.redirect('/recruiter/job_ads');
    });
});

// http://localhost:3000/recruiter/job_ads/applications/:id_offre
router.get('/job_ads/applications/:id_offre', function(req, res, next) {
    const id_offre = req.params.id_offre;

    candidatureModel.getJobTitle(id_offre, function(err, jobTitle) {
        if (err) {
            console.error('Error fetching job title:', err);
            return next(err);
        }

        candidatureModel.getApplicationsForJob(id_offre, function(err, candidatures) {
            if (err) {
                console.error('Error fetching applications:', err);
                return next(err);
            }

            console.log('candidatures:', candidatures);

            res.render('applications_job_ad', {
                title: `Applications for job "${jobTitle}"`,
                candidatures: candidatures.map(c => {
                    return {
                        ...c,
                        paths: c.paths || [] // Ajoute une liste vide si paths est undefined
                    };
                }),
                id_offre: id_offre // Ajouté pour utiliser dans les liens
            });
        });
    });
});

// http://localhost:3000/recruiter/job_description/new
router.get('/job_description/new', function(req, res, next) {
    console.log('GET /job_description/new');
    addressModel.readAll(function(err, addresses) {
        if (err) {
            console.error('Error retrieving addresses:', err);
            return res.status(500).render('error', { message: 'Internal server error', error: err });
        }
        res.render('add_job_description', { addresses: addresses });
    });
});

// http://localhost:3000/recruiter/job_description/new
router.post('/job_description/new', function(req, res, next) {
    const {
        nom,
        statut_de_poste,
        resp_hierarchique,
        rythme_heures,
        teletravail_jours,
        salaire_min,
        salaire_max,
        description_mission,
        date_fin_validite,
        nombre_offres,
        adresse
    } = req.body;

    // Valider les champs du formulaire
    if (!nom || !statut_de_poste || !resp_hierarchique || !rythme_heures || !teletravail_jours || !salaire_min || !salaire_max || !description_mission || !date_fin_validite || !nombre_offres || !adresse) {
        return res.render('error', { message: 'All fields are required' });
    }

    // Valider les contraintes spécifiques
    if (parseInt(rythme_heures, 10) > 40) {
        return res.render('error', { message: 'Work rhythm cannot exceed 40 hours' });
    }
    if (parseInt(teletravail_jours, 10) > 5) {
        return res.render('error', { message: 'Remote work cannot exceed 5 days' });
    }
    if (parseInt(salaire_min, 10) >= parseInt(salaire_max, 10)) {
        return res.render('error', { message: 'Minimum salary must be less than maximum salary' });
    }

    // Préparer les données pour l'insertion
    const newJobDescription = {
        organisation: req.session.userOrganisation, // Utilisez la session ou un autre moyen pour obtenir l'organisation actuelle
        nom: nom,
        statut_de_poste: statut_de_poste,
        resp_hierarchique: resp_hierarchique,
        rythme_heures: parseInt(rythme_heures, 10),
        teletravail_jours: parseInt(teletravail_jours, 10),
        salaire_min: parseInt(salaire_min, 10),
        salaire_max: parseInt(salaire_max, 10),
        description_mission: description_mission,
        date_fin_validite: date_fin_validite,
        nombre_offres: parseInt(nombre_offres, 10),
        adresse: parseInt(adresse, 10)
    };

    // Insérer les données dans la base de données
    ficheDePosteModel.create(newJobDescription, function(err, result) {
        if (err) {
            console.error('Error inserting new job description:', err);
            return res.status(500).send('Internal server error');
        }

        res.render('display', { message: 'Job description created successfully' });
    });
});

module.exports = router;