
import jwt from 'jsonwebtoken';
import User from '../../models/user/index.js';

const { secret_key } = process.env

const Signup = async (req, res) => {
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

      // Save the user to the database
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id }, 
        secret_key, 
        { expiresIn: '3h' }
      );

      // Return the token
      res.status(201).json({ token });

    }

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }

}

const Signin = async (req, res) => {

  // Extract the email and password from the request body
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate the password
    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      secret_key,
      { expiresIn: '3h' }
    );

    // Return the token
    res.json({token: token, user:user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  Signin,
  Signup
}