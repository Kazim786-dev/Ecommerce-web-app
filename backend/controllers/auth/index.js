
import jwt from 'jsonwebtoken';
import User from '../../models/user/index.js';

export const Signup = async (req, res) => {
  const { name, email, password, mobile } = req.body;

try {
  const foundUser = await User.findOne({ email: email })
    if (foundUser) {
      res.status(500).json({ message: 'Email already exists.' })
    }

    else{
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
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }

}


export const Signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // Find user by email
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ Success: false, Message: 'User not found' });
        }
  
        if (user.password !== password) {
          return res.status(400).json({ Success: false, Message: 'Incorrect password' });
        }
  
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id
            },
            process.env.secret_key,
            { expiresIn: '3h' }
        );

        res.status(200).json({
            Success: true,
            user,
            token,
            Message: 'User login successfull',
        });
        })
      .catch((err) => {
        res.status(400).json({ Success: false, Message: 'User login failed: ' + err });
      });
  };