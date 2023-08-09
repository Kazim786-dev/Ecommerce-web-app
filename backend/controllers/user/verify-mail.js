import User from '../../models/user';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../mail/index.js';

const jwtSecret = process.env.secret_key

const generateResetToken = (email) => {
    return jwt.sign({ email }, jwtSecret, { expiresIn: '10m' });
  };

  const verifyMail = async ({email}) => {
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return { status: 404, message: 'User not found' };
      }
  
      const resetToken = generateResetToken(email);
      const resetLink = `http://localhost:3000/new-pass/${resetToken}`;
      const emailContent = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;
  
      sendEmail(user.email, 'Password Reset', emailContent);
  
      return { status: 200, message: 'Email verification link sent successfully' };
    } catch (error) {
      throw new Error('An error occurred while verifying email.');
    }
  };
  

  export default verifyMail