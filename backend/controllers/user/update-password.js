import User from '../../models/user';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../mail/index.js';

const jwtSecret = process.env.secret_key

const updatePassword = async ({token, newPassword}) => {
  try {
    // Verify the token and extract the email from it
    const decodedToken = jwt.verify(token, jwtSecret);
    const email = decodedToken.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    user.password = newPassword;
    await user.save();

    const emailContent = `<p>Your password has been changed. Do not share it with anyone</p>`;
    await sendEmail(user.email, 'Password Changed Successfully', emailContent);

    return { status: 200, message: 'Password updated successfully' };
  } catch (error) {
    throw new Error('An error occurred while updating password.');
  }
};

  export default updatePassword