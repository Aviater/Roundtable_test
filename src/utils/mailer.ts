import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import appConfig from '../config/app';

var transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525, 
    auth: {
        user: appConfig.mailerUser,
        pass: appConfig.mailerPassword
    }
});

const sendInviteEmail = (inviteId: string, email: string) => {
    const mailOptions = {
        from: appConfig.mailerEmail,
        to: email,
        subject: 'Roundtable registration link',
        html: `<div>Your personalised Roundtable registration link is ready, copy and paste the following link:<br/> <strong>http://localhost:5000/user/register/${inviteId}</strong></div>`
    };

    return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject): void => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Mailer Error: ${error}`);
                return reject(`Mailer Error: ${error}`);
            } else {
                console.log(`Email sent: ${JSON.stringify(info.response)}`);
                return resolve(info);
            }
        });
    });
}

export = { sendInviteEmail };