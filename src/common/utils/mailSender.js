import { EMAIL_PASSWORD } from "../configs/enviroments.js";
import createError from "./error.js";
import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "truongcongsson@gmail.com",
            pass: EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "Son Sam Set",
        to: email,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw createError(500, "Gửi email thất bại: " + error.message);
    }
}

export default sendEmail;