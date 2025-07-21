// server.js
require('dotenv').config(); // Charger les variables d'environnement au tout début

const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors'); // Importez le paquet CORS

const app = express();
const PORT = process.env.PORT || 3001; // Utilisez un port différent de celui d'Eleventy (ex: 8080) pour le dev local

// --- Middlewares ---

// CORS Configuration
// Remplacez 'https://diaeta.be' par l'URL de votre site en production.
// Pour le développement local, si votre site Eleventy tourne sur http://localhost:8080, utilisez cette URL.
const whitelist = ['https://diaeta.be', 'http://localhost:8080']; // Ajoutez vos URLs de production et de dev
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) { // !origin permet les requêtes de même origine (ou Postman)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions)); // Activez CORS avec vos options

app.use(helmet()); // Définit divers en-têtes HTTP sécurisés

const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, 
    message: { success: false, message: "Trop de tentatives d'envoi. Veuillez réessayer plus tard." },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.json()); // Pour parser le JSON venant du frontend
app.use(express.urlencoded({ extended: true })); // Pour parser les données de formulaire URL-encoded

// --- Configuration Nodemailer ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    // tls: { rejectUnauthorized: false } // Décommentez seulement si vous avez des problèmes de certificat en DEV avec un serveur local
});

// --- Endpoint pour le Formulaire de Contact ---
app.post('/api/contact-inquiry', formLimiter, [
    body('contactFullName').trim().notEmpty().withMessage('Le nom complet est requis.').escape(),
    body('contactEmail').isEmail().withMessage('L\'adresse email n\'est pas valide.').normalizeEmail(),
    body('contactPhone').optional({ checkFalsy: true }).trim().escape(),
    body('contactServiceType').trim().escape(),
    body('contactMessage').trim().notEmpty().withMessage('Le message ne peut pas être vide.').escape(),
    body('privacyPolicy').equals('on').withMessage('Vous devez accepter la politique de confidentialité.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Erreurs de validation détectées par le serveur:", JSON.stringify(errors.array(), null, 2)); // Log détaillé sur le serveur
return res.status(400).json({ success: false, message: "Erreur de validation. Vérifiez les champs.", errors: errors.array() });
    }

    const { contactFullName, contactEmail, contactPhone, contactServiceType, contactMessage } = req.body;

    // --- Log de débogage pour vérifier les variables d'environnement et les données du formulaire ---
    console.log("--- Début du traitement de la requête POST /api/contact-inquiry ---");
    console.log("Valeur de process.env.SMTP_HOST:", process.env.SMTP_HOST);
    console.log("Valeur de process.env.SMTP_PORT:", process.env.SMTP_PORT);
    console.log("Valeur de process.env.SMTP_SECURE:", process.env.SMTP_SECURE);
    console.log("Valeur de process.env.SMTP_USER (utilisé pour 'from' et l'authentification):", process.env.SMTP_USER);
    // Attention : Ne logguez JAMAIS SMTP_PASS en production. Uniquement pour un test local très temporaire si vous suspectez un problème avec cette variable.
    // console.log("Valeur de process.env.SMTP_PASS:", process.env.SMTP_PASS); 
    console.log("Valeur de process.env.RECIPIENT_EMAIL:", process.env.RECIPIENT_EMAIL);
    console.log("Données reçues du formulaire (req.body):", JSON.stringify(req.body, null, 2));
    console.log("Nom complet extrait (contactFullName):", contactFullName);
    console.log("Email extrait (contactEmail pour replyTo):", contactEmail);
    // --- Fin du log de débogage ---

    const mailOptions = {
        from: process.env.SMTP_USER, // <<< MODIFICATION CRUCIALE : Utiliser UNIQUEMENT l'adresse d'authentification
        replyTo: contactEmail,       // Important pour que vous puissiez répondre au client
        to: process.env.RECIPIENT_EMAIL, 
        subject: `Nouvelle question via le site Diaeta - ${contactServiceType || 'Non spécifié'}`,
        text: `Vous avez reçu un nouveau message de : ${contactFullName} (${contactEmail})\n` +
              `Téléphone : ${contactPhone || 'Non fourni'}\n` +
              `Sujet : ${contactServiceType || 'Non spécifié'}\n\n` +
              `Message :\n${contactMessage}`,
        html: `<p>Vous avez reçu un nouveau message de :</p>
               <ul>
                 <li><strong>Nom :</strong> ${contactFullName}</li>
                 <li><strong>Email :</strong> ${contactEmail}</li>
                 <li><strong>Téléphone :</strong> ${contactPhone || 'Non fourni'}</li>
                 <li><strong>Sujet :</strong> ${contactServiceType || 'Non spécifié'}</li>
               </ul>
               <p><strong>Message :</strong></p>
               <p>${contactMessage.replace(/\n/g, '<br>')}</p>`
    };

    try {
        console.log("Options de l'email avant envoi (mailOptions):", JSON.stringify(mailOptions, null, 2));
        let info = await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès. Réponse du serveur:", info.response);
        res.status(200).json({ success: true, message: 'Votre question a été envoyée avec succès ! Nous vous répondrons dès que possible.' });
    } catch (error) {
        // Log de l'erreur complète pour comprendre ce que Nodemailer ou le serveur SMTP renvoie
        console.error('Erreur Nodemailer détaillée:', error); 
        res.status(500).json({ 
            success: false, 
            message: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.',
            // Optionnel : ajouter plus de détails sur l'erreur si ce n'est pas une information sensible
            // errorDetails: error.message 
        });
    }
});

// --- Gestionnaire d'erreurs générique ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: 'Erreur interne du serveur.' });
});

// --- Démarrer le serveur ---
app.listen(PORT, () => {
    console.log(`Serveur backend Diaeta démarré sur http://localhost:${PORT}`);
});