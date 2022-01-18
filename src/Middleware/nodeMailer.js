const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: 'find.spot.ar.co@gmail.com',
        pass: process.env.MAIL,
     },
secure: true,
});

module.exports = transporter;