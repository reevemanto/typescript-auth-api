"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail(to, subject, html) {
    console.log('📧 SEND EMAIL CALLED');
    console.log('📧 TO:', to);
    console.log('📧 SUBJECT:', subject);
    console.log('📧 EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const info = await transporter.sendMail({
            from: "Auth API <christianmanto2004@gmail.com>",
            to: to,
            subject: subject,
            html: html
        });
        console.log('✅ Email sent. Message ID:', info.messageId);
    }
    catch (error) {
        console.error('❌ Email failed:', error);
        throw error;
    }
}
