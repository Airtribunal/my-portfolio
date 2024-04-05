import nodemailer from "nodemailer";

const email = process.env.EMAIL_NAME;
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: pass,
    }
});

export const mailOptions = {
    from: email,
    to: 'info@ramazanov-web.ru',
};