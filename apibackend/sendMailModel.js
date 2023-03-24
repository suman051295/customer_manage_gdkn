const nodemailer = require('nodemailer');

class Mail {
    static sendMail(recepient, subject, body) {
        return new Promise((resolve, reject) => {
            let mailTransporter = nodemailer.createTransport({
                host: "smtp-relay.sendinblue.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "suman051295@gmail.com", // generated ethereal user
                    pass: "t3rE4SWaIJvKjyHn", // generated ethereal password
                },
            });

            let mailDetails = {
                from: 'suman051295@gmail.com',
                to: recepient,
                subject: subject,
                text: body
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs');
                    reject(err)
                } else {
                    console.log('Email sent successfully');
                    resolve(data)
                }
            });
        })
    }
}
module.exports = Mail;