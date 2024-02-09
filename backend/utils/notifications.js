const nodemailer = require('nodemailer');
const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

let transporter;
let twilioClient;

const initializeEmailTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    console.warn('Email service is not configured. Skipping email transporter initialization.');
  }
};

const initializeTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.warn('Twilio credentials are invalid or missing.');
  }
};

async function sendEmail(to, subject, text) {
  initializeEmailTransporter();

  if (!transporter) {
    console.warn('Email service is not configured. Email not sent.');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: to,
    subject: subject,
    text: text
  };
  console.log(mailOptions)

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendWhatsAppMessage(to, body) {
  initializeTwilioClient();

  if (!twilioClient) {
    console.warn('WhatsApp service is not configured. Message not sent.');
    return;
  }

  try {
    await twilioClient.messages.create({
      body: body,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`
    });
    console.log('WhatsApp message sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

module.exports = {
  sendEmail,
  sendWhatsAppMessage
};
