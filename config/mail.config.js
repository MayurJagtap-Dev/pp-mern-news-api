import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (toMail, subject, body) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_SENDER, // sender address
    to: toMail, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });
};
