import User from '../../models/user/index.js';

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
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, mobile } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
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

const verifyMail = async (req, res) => {
  const { email } = req.body;

  // Logic to verify email
  try {
    const user = await User.findOne({email:email})
    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while verifying email' });
  }
};

const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user in the database based on the user's ID
    const user = await User.findOne({email:email})  
    // wait to return promise is necessary otherwise condition will always be true
    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating password. '+ error });
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
