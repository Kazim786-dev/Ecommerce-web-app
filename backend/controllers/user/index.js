import User from '../../models/user/index.js';

// Controller functions
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

export const getUserById = async (req, res) => {
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

export const createUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
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

export const deleteUser = async (req, res) => {
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
