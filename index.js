import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: "https://cotton-world-sourcing-frontend.netlify.app",
        credentials: true,
    })
);
app.use(express.json());

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465, // true for SSL, false for TLS
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

console.log(transporter.options);

// Check mail server connection
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Mail server connection failed:", error);
    } else {
        console.log("✅ Mail server is ready to send emails");
    }
});

// Endpoint to handle form
app.post("/send-email", async(req, res) => {
    const { user_name, user_email, subject, message } = req.body;

    if (!user_name || !user_email || !message) {
        return res
            .status(400)
            .json({ message: "Please fill in all required fields." });
    }

    // const mailOptions = {
    //     from: `"Cotton World Sourcing Contact" <contactform@cottonworldsourcing.com>`,
    //     to: "armanr.rafi@gmail.com",
    //     subject: subject || "New Contact Form Message",
    //     html: `
    //   <p><strong>Name:</strong> ${user_name}</p>
    //   <p><strong>Email:</strong> ${user_email}</p>
    //   <p><strong>Subject:</strong> ${subject || '(No Subject)'}</p>
    //   <p><strong>Message:</strong></p>
    //   <p>${message}</p>
    // `,
    // };

    const mailOptions = {
        from: `"Cotton World Sourcing" <contactform@cottonworldsourcing.com>`,
        replyTo: user_email,
        to: "armanr.rafi@gmail.com",
        subject: subject || "Contact form submission",
        text: `
Name: ${user_name}
Email: ${user_email}
Subject: ${subject || "(No Subject)"}

Message:
${message}
  `,
        html: `
<p><strong>Name:</strong> ${user_name}</p>
<p><strong>Email:</strong> ${user_email}</p>
<p><strong>Subject:</strong> ${subject || "(No Subject)"}</p>
<hr/>
<p>${message}</p>
<p>—<br/>Sent via contact form on cottonworldsourcing.com</p>
  `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import nodemailer from 'nodemailer';

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: Number(process.env.MAIL_PORT),
//     secure: true,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });

// app.post('/send-email', async(req, res) => {
//     const { user_name, user_email, subject, message } = req.body;

//     if (!user_name || !user_email || !message) {
//         return res.status(400).json({ message: 'Please fill in all required fields.' });
//     }

//     const mailOptions = {
//         from: `"${user_name}" <${user_email}>`, // from form
//         to: "armanr.rafi@gmail.com", // your email
//         subject: subject || "New Contact Form Message",
//         html: `
//       <p><strong>Name:</strong> ${user_name}</p>
//       <p><strong>Email:</strong> ${user_email}</p>
//       <p><strong>Subject:</strong> ${subject || '(No Subject)'}</p>
//       <p><strong>Message:</strong></p>
//       <p>${message}</p>
//     `,
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.messageId);
//         res.status(200).json({ message: 'Email sent successfully!' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ message: 'Failed to send email.' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });