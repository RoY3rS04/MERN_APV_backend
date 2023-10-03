import nodemailer from 'nodemailer';

export default async function forgetPasswordEmail(data) {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Send email
    const { email, name, token } = data;

    const info = await transport.sendMail({
        from: 'VPM - Veterinary Pacient Manager',
        to: email,
        subject: 'Restore your password on VPM',
        text: 'Restore your password on VPM',
        html: `<p>Hi, ${name}, you've requested to change your password</p>
            <p>Follow this link to create your new password <a href="${process.env.FRONTEND_URL}/i-forgot-password/${token}">Restore password</a> </p>

            <p>If you didn't create this account, you can ignore this email</p>
        `
    });
}