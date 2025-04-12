// --- Point de départ de l'application

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Charger les variables d'environnement au tout début


// --- Configurez Nodemailer pour envoyer des e-mails via Yahoo
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
      user: 'talentthrive@hotmail.com',
      pass: 'TT123456789@Talent'
  }
});

// --- Modules des routes

const home = require('./routes/index.js')(transporter); 
const admin = require('./routes/admin.js')(transporter); 
const candidate = require('./routes/candidate.js');
const recruiter = require('./routes/recruiter.js');
const uploadsRouter = require('./routes/uploads.js');

// --- Module de gestion des sessions
const sessionManager = require('./sessionManager');

// --- Application

const app = express();

// --- Installation de la gestion des vues (View engine setup)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Configuration des sessions
app.use(sessionManager.init());

// Route pour générer le CAPTCHA
app.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text; // Stocker le texte du CAPTCHA dans la session
  res.type('svg'); // Indiquer que la réponse est de type SVG
  res.status(200).send(captcha.data);
});


// --- Middleware de gestion des sessions et de sécurisation des routes

app.all("*", function (req, res, next) {
  const nonSecurePaths = ["/", "/login", "/register", "/forgotten_pwd", "/logout"];
  const candidatePaths = ["/candidate", "/candidate/home", "/candidate/job_ads", "/candidate/job_ads/", "/candidate/job_ads/apply", "/candidate/applications/", "/candidate/applications/update", "/candidate/applications/delete", "/candidate/apply_for_recruiter", "/candidate/add_organization"];
  const recrutPaths = ["/recruiter", "/recruiter/home", "/recruiter/job_ads/", "/recruiter/job_ads/new", "/recruiter/job_ads/edit", "/recruiter/job_ads/delete", "/recruiter/job_ads/applications", "/recruiter/job_ads/applications/", "/recruiter/job_ads/expired_job_ads", "/recruiter/job_ads/active_job_ads", "/recruiter/job_description/new"];
  const adminPaths = ["/admin", "/admin/home", "/admin/mng_users", "/admin/mng_users/confirm_delete", "/admin/mng_users/delete", "/admin/mng_users/confirm_admin_access", "/admin/mng_users/give_admin_access", "/admin/mng_users/update_users", "/admin/mng_users/confirm_update", "/admin/mng_org", "/admin/mng_org/org_processed", "/admin/mng_org/org_unprocessed", "/admin/mng_org/confirm_adding_org", "/admin/mng_org/add_organization", "/admin/mng_org/confirm_deleting_org", "/admin/mng_org/delete_organization", "/admin/mng_recruiters", "/admin/mng_recruiters/processed", "/admin/mng_users/confirm_acceptation", "/admin/mng_users/accept_recruiter", "/admin/mng_recruiters/unprocessed", "/admin/mng_users/confirm_refusing", "/admin/mng_users/refuse_recruiter"];

  if (nonSecurePaths.includes(req.path)) return next();
  
  // Vérifier si la session existe
  if (!req.session) {
    return res.status(403).render("access_denied", {
      message: "Your session has expired, please log in again.",
      error: {}
    });
  }

  // Vérifier l'authentification et le rôle de l'utilisateur
  if (adminPaths.includes(req.path)) {
    if (sessionManager.isConnected(req.session, "admin")) return next();
    else res.status(403).render("access_denied", {
      message: "Access denied, admin account required",
      error: {}
    });
  } else if (recrutPaths.includes(req.path)) {
    if (sessionManager.isConnected(req.session, "recruteur")) return next();
    else res.status(403).render("access_denied", {
      message: "Access denied, recruiter account required",
      error: {}
    });
  } else if (candidatePaths.includes(req.path)) {
    if (sessionManager.isConnected(req.session, "candidat") || sessionManager.isConnected(req.session, "recruteur")) return next();
    else res.status(403).render("access_denied", {
      message: "Access denied, candidate or recruiter account required",
      error: {}
    });
  } else {
    if (sessionManager.isConnected(req.session)) return next();
    else res.render("access_denied", {
      message: "Your session has expired, please log in again.",
      error: {}
    });
  }
});

// --- Gestion des routes 

app.use('/', home)
app.use('/admin', admin)
app.use('/candidate', candidate)
app.use('/recruiter', recruiter)
app.use('/uploads', uploadsRouter);

//  --- Gestionnaire des erreurs 404 (Catch 404 and forward to error handler)

app.use(function(req, res, next) {
  console.log('404 error, URL not found:', req.url);
  next(createError(404));
});

// --- Gestionnaire d'erreurs (Error handler)

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// --- Démarrer le serveur

console.log('DB_HOST:', process.env.DB_HOST); // Ajoutez ceci pour vérifier les variables d'environnement

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server is running on port ' + port);
});

module.exports = app;