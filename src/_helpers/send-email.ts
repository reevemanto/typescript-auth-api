import nodemailer from 'nodemailer';
import config from '../../config.json';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.auth.user,
            pass: config.email.auth.pass
        }
    });

    await transporter.sendMail({
        from: "Auth API <noreply@authapi.com>",
        to: to,
        subject: subject,
        html: html
    });
    console.log(`Email sent to ${to}`);
}