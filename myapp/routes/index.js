const express = require('express');
const router = express.Router();
var userModel = require('../model/users');
var orgModel = require('../model/organisation');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

module.exports = (transporter) => {
    router.get('/', (req, res) => {
        res.render('index', { title: 'Home'});
    });

    router.get('/login', (req, res) => {
        res.render('login', { title: 'Login'});
    });

    router.post('/login', (req, res, next) => {
        console.log('post login');
        const { email, password, captcha } = req.body;
        console.log('email:', email);
        console.log('password:', password);
        console.log('captcha:', captcha);
        
        // Vérification que req.session existe
        if (!req.session) {
            console.error('Session is not initialized');
            return res.status(500).render('error', { message: 'Internal server error', error: 'Session is not initialized' });
        }
        
        console.log('captcha from session:', req.session.captcha);
        console.log('captcha from input:', captcha);

        // Vérification du CAPTCHA (insensible à la casse)
        if (!req.session.captcha || req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
            console.error('CAPTCHA validation failed');
            return res.status(400).render('error', { message: 'Invalid CAPTCHA. Please try again.' });
        }

        console.log('CAPTCHA validated successfully');

    console.log('email:', email);
    console.log('password:', password);
    console.log('captcha:', captcha);

        userModel.areValid(email, password, (isValid) => {
            if (isValid) {
                // Récupérer les informations de l'utilisateur
                userModel.read(email, (err, user) => {
                    if (err) {
                        console.error('Error retrieving user by email:', err);
                        return res.status(500).render('error', { message: 'Internal server error', error: err });
                    }

                    if (!user) {
                        console.error('No user found with email:', email);
                        return res.status(401).render('error', { message: 'User not found', error: {} });
                    }

                    // Stocker l'état de l'authentification et le rôle dans la session
                    if (!req.session) {
                        console.error('Session is not initialized');
                        return res.status(500).render('error', { message: 'Internal server error', error: 'Session is not initialized' });
                    }
                    req.session.isAuthenticated = true;
                    req.session.userRole = user.type;
                    req.session.userEmail = user.adresse_mail;
                    req.session.userId = user.id_user;
                    req.session.userOrganisation = user.organisation;

                    // Rediriger l'utilisateur en fonction de son rôle
                    if (user.type === 'admin') {
                        res.redirect('/admin/home');
                    } else {
                        res.redirect('/candidate/home');
                    }
                });
            } else {
                return res.status(401).render('error', { message: 'Invalid email or password', error: {} });
            }
        });
    });

    router.get('/register', function(req, res, next) { 
        orgModel.selectSiren(function(result) {
            res.render('register', { title: 'Sign up', sirens: result });
        });
    });

    router.post('/register', async (req, res, next) => {
        try {
            let { surname, name, email, tel, password, recruiter, siren } = req.body;
            let date_creation = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format MySQL
            let type = 'candidat';

            // Vérification que tous les champs sont remplis
            if (!surname || !name || !email || !tel || !password || !recruiter) {
                return res.status(400).render('error', { message: 'Please fill in all required fields.' });
            }

            // Vérification que surname et name sont des chaînes de caractères
            if (typeof surname !== 'string' || typeof name !== 'string') {
                return res.status(400).render('error', { message: 'Surname and Name must be strings.' });
            }

            // Formatage du surname et name pour avoir une majuscule au début
            surname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

            // Vérification que l'email a le bon format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).render('error', { message: 'Please enter a valid email address.' });
            }

            // Vérification que le numéro de téléphone a 10 chiffres
            const telRegex = /^\d{10}$/;
            if (!telRegex.test(tel)) {
                return res.status(400).render('error', { message: 'Please enter a valid 10-digit phone number.' });
            }

            // Vérification que le mot de passe a au moins 12 caractères
            const specialCharacters = "!@#$%^&*()_+[]{}|;:'\",.<>?/`~"; // Liste des caractères spéciaux possibles
            const specialCharRegex = new RegExp(`[${specialCharacters.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
            const uppercaseRegex = /[A-Z]/;
            const lowercaseRegex = /[a-z]/;
            const numberRegex = /[0-9]/;

            const hasUppercase = uppercaseRegex.test(password);
            const hasLowercase = lowercaseRegex.test(password);
            const hasNumber = numberRegex.test(password);
            const hasSpecialChar = specialCharRegex.test(password);

            if (password.length < 12 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
                return res.status(400).render('error', { message: 'Your password must be at least 12 characters long and include uppercase letters, lowercase letters, numbers, and special characters from a list of at least 37 possible special characters.' });
            }

            // Vérification spécifique pour les recruteurs
            if (recruiter === 'yes') {
                type = 'recruteur';
                if (!siren) {
                    return res.status(400).render('error', { message: 'Please provide the SIREN if you are a recruiter.' });
                }
            } else {
                siren = null; // Ensure siren is null for non-recruiters
            }
            
            // Vérification de l'unicité de l'email
            userModel.read(email, async (err, user) => {
                if (err && err.message !== 'User not found') {
                    return res.status(500).render('error', { message: 'An error occurred during registration.' });
                }
                if (user) {
                    return res.status(400).render('error', { message: 'Email already exists.' });
                }

                // Hacher le mot de passe
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Création de l'utilisateur
                userModel.create(email, hashedPassword, surname, name, tel, date_creation, type, siren, (err, result) => {
                    if (err) throw err;
                    console.log('User successfully created:', result);

                    // Envoyer un email de notification
                    const mailOptions = {
                        from: 'talentthrive@hotmail.com',
                        to: email,
                        subject: 'Welcome on your recruitment platform!',
                        text: `Hello ${name},\n\nYour account has been created successfully.\n\nThanks,\nThe Recruitment team`
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.error('Error sending email:', err);
                            return res.status(500).render('error', { message: 'User registered but email could not be sent.' });
                        }
                        console.log('Email sent:', info.response);
                        res.render('registration_validated', { title: 'Successful registration' });
                    });
                });
            });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'An error occurred during registration.' });
        }
    });

    router.get('/logout', (req, res) => {
        if (!req.session) {
            console.error('Session is not initialized');
            return res.status(500).render('error', { message: 'Internal server error', error: 'Session is not initialized' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).render('error', { message: 'Internal server error', error: err });
            }
            res.redirect('/');
        });
    });
    return router;
};

//module.exports = router;