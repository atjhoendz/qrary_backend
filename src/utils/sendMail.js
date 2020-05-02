const nodemailer = require('nodemailer');

const sendMail = (msg) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    return transporter.sendMail(msg).then(info => {
        return true;
    }).catch(err => {
        return false;
    });
};

module.exports = sendMail;