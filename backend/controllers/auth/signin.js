import jwt from 'jsonwebtoken';
import User from '../../models/user';

const { secret_key } = process.env

// const Signin = async ({ email, password }) => {
  
//     try {
//       // Find the user by email
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Validate the password
//       const isMatch = await user.isValidPassword(password);
  
//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate JWT token
//       const token = jwt.sign(
//         { 
//           id: user._id,
//           role: user.role,
//          },
//         secret_key,
//         { expiresIn: '3h' }
//       );
  
//       // Return the token
//       res.json({ token: token, user: user });
//     } catch (error) {
//       console.log(error)
//       res.status(500).json({ message: 'Error logging in' });
//     }
//   };



  const Signin = async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return { status: 401, data: { message: 'Invalid credentials' } };
      }
  
      const isMatch = await user.isValidPassword(password);
  
      if (!isMatch) {
        return { status: 401, data: { message: 'Invalid credentials' } };
      }
  
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        secret_key,
        { expiresIn: '3h' }
      );
  
      return { status: 200, data: { token: token, user: user } };
    } catch (error) {
      throw error;
    }
  };


  export default Signin