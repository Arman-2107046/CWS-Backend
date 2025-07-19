import dotenv from 'dotenv';
dotenv.config();



import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});




app.post('/send-email', async(req, res) => {
    const { user_name, user_email, subject, message } = req.body;

    if (!user_name || !user_email || !message) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const mailOptions = {
        from: `"${user_name}" <${user_email}>`, // from form
        to: "armanr.rafi@gmail.com", // your email
        subject: subject || "New Contact Form Message",
        html: `
      <p><strong>Name:</strong> ${user_name}</p>
      <p><strong>Email:</strong> ${user_email}</p>
      <p><strong>Subject:</strong> ${subject || '(No Subject)'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});