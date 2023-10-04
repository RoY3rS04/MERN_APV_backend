import nodemailer from 'nodemailer';

export default async function registerEmail(data) {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
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
        subject: 'Comprobate your account on VPM',
        text: 'Comprobate your account on VPM',
        html: `<p>Hi, ${name}, comprobate your account on VPM</p>
            <p>Your account is ready, you just have to comprobate it in the following link: <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobate your account</a> </p>

            <p>If you didn't create this account, you can ignore this email</p>
        `
    });
}