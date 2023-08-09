import User from '../../models/user';

const updateUser = async ({id, userData}) => {
  const { name, email, password, mobile } = userData;

  try {
    const user = await User.findById(id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.mobile = mobile || user.mobile;
      const updatedUser = await user.save();

      return { status: 200, message: 'User profile updated successfully', user: updatedUser };
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    throw new Error('An error occurred while updating the user.');
  }
};

  export default updateUser