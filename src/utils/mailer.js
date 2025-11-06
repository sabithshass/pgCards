// utils/mailer.js
const nodemailer = require('nodemailer');
const hbs = require('hbs');
const path = require('path');


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

const sendEmail = async ({ to, subject, templateName, context }) => {
  try {
    
    const templatePath = path.join(__dirname, '../views', `${templateName}.hbs`);
    const html = hbs.compile(require('fs').readFileSync(templatePath, 'utf-8'))(context);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
