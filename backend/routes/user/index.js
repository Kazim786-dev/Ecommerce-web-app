import { Router } from 'express';
import {verifyuserloggedin} from '../../middleware/auth.js'

const router = Router();

//controller functions
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } from '../../controllers/user/index.js';
import {
  Signup,
  Signin
} from '../../controllers/auth/index.js'  

// User routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
// router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;