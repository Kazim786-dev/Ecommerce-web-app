
import jwt from 'jsonwebtoken';
import User from '../../models/user/index.js';
import { sendEmail } from '../../mail/index.js';

const { secret_key } = process.env

const Signup = async (req, res) => {
  const { name, email, password, mobile, role } = req.body;

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


  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]{3,}@gmail.com$/; //check to have at least 3 characters for gmail
    return emailRegex.test(email);
  };

  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    res.status(500).json({ message: 'Invalid email address. Gmail addresses must have at least three characters before @gmail.com.' })
    return;
  }


  try {
    const foundUser = await User.findOne({ email: email })
    if (foundUser) {
      res.status(500).json({ message: 'Email already exists.' })
    }
    else {
      let Role = 'customer'
      if(role && role==='admin'){
        Role = role
      }
      const newUser = new User({
        name,
        email,
        password,
        mobile,
        role: Role
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id },
        secret_key,
        { expiresIn: '3h' }
      );


      // Compose the email content
      const emailContent = `<p>Welcome ${newUser.name} to this amazing e-commerce platform.<br/>
      We are absolutely thrilled to have you join our ever-growing family of online shoppers.<br/>
      Congratulations on successfully creating your account! 🎉
      Note: Do not share your password with anyone</p>`;

      // Send the email using the generic sendEmail function
      await sendEmail(newUser.email, 'Account Created Successfully', emailContent);

      // Save the user to the database
      await newUser.save();

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
      { 
        id: user._id,
        role: user.role,
       },
      secret_key,
      { expiresIn: '3h' }
    );

    // Return the token
    res.json({ token: token, user: user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  Signin,
  Signup
}