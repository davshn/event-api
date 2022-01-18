const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: 'find.spot.ar.co@gmail.com',
        pass: 'Probando263732',
     },
secure: true,
});

module.exports = transporter;