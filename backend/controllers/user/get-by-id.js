import User from '../../models/user';

const getUserById = async ({id}) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return user;
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    throw new Error('An error occurred while fetching the user.');
  }
};
  export default getUserById