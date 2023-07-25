
import nodemailer from 'nodemailer'

const myEmail = 'asifkazim09@gmail.com'

// Function to send an email
const sendEmail = (toEmail, subject, htmlContent) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: myEmail,
      pass: 'hwfkqmsxzkaomijp',
    },
  });

  // Email options
  const mailOptions = {
    from: myEmail,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  // Return a promise for sending the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });

};

module.exports = { sendEmail };