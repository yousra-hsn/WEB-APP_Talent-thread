const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'yahoo', 
    auth: {
        user: 'talentthrive@yahoo.com',
        pass: 'TT123456789@Talent'
    }
});

module.exports = transporter;