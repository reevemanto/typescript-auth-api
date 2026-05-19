"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail(to, subject, html) {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER || 'ernestina.dare@ethereal.email',
            pass: process.env.EMAIL_PASS || '1aKQ3cvz73fxxb7zmw'
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
