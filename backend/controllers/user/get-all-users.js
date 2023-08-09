
import User from '../../models/user';

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
  };

  export default getAllUsers