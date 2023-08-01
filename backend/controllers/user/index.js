import User from '../../models/user/index.js';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../mail/index.js';

const jwtSecret = process.env.secret_key

// Controller functions
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {

    const foundUser = await User.findOne({ email: email })
    if (foundUser) {
      res.status(500).json({ message: 'Email already exists.' })
    }

    else {
      const newUser = new User({
        name,
        email,
        password,
        mobile
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, mobile } = req.body;

  // Define the regex patterns for validation
  const capitalRegex = /[A-Z]/;
  const smallRegex = /[a-z]/;
  const digitRegex = /[0-9]/;
  const symbol = /[!@#$%^&*]/;

  // Check if the password meets all validation criteria
  if (
    !capitalRegex.test(password) ||
    !smallRegex.test(password) ||
    !digitRegex.test(password) ||
    !symbol.test(password) ||
    password.length < 4
  ) {
    return res.status(400).json({
      error: 'Password must contain at least 1 capital letter, 1 small letter, 1 digit, 1 symbol, and be at least 8 characters long.',
    });
  }


  try {
    const user = await User.findById(id);
    if (user) {
      user.name = name || user.name;
      user.password = password || user.password;
      user.mobile = mobile || user.mobile;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      await user.remove();
      res.json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
};

const generateResetToken = (email) => {
  return jwt.sign({ email }, jwtSecret, { expiresIn: '10m' });
};

const verifyMail = async (req, res) => {
  const { email } = req.body;

  // Logic to verify email
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a JWT token for password reset
    const resetToken = generateResetToken(email);

    // Compose the email with the link containing the token
    const resetLink = `http://localhost:3000/new-pass/${resetToken}`;

    // Compose the email content
    const emailContent = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;

    sendEmail(user.email, 'Password Reset', emailContent)
      .then(() => {
        // Email sent successfully, send a success response
        res.status(200).json({ message: 'Email verification link sent successfully' });
      })
      .catch((error) => {
        // Error sending the email, send an error response
        res.status(500).json({ error: 'An error occurred while sending the email' });
      });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while verifying email.\n' });
  }
};

const updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token and extract the email from it
    const decodedToken = jwt.verify(token, jwtSecret);
    const email = decodedToken.email;
    // Find the user in the database based on the email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Compose the email content
    const emailContent = `<p>Your new password has been changed. Do not share it with anyone</p>`;

    // Send the email using the generic sendEmail function
    sendEmail(user.email, 'Password Changed Successfully', emailContent);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating password. ' + error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  verifyMail,
  updatePassword
}
