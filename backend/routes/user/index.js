import { Router } from 'express';
import authMiddleware from '../../middleware/auth'

const router = Router();

//controller functions
import {
    getAllUsers,
    getUserById,
    // createUser,
    updateUser,
    deleteUser,
    verifyMail,
    updatePassword
  } from '../../controllers/user/index.js';

// User routes
router.get('/', getAllUsers);

router.get('/verify-mail', verifyMail);
router.patch('/update-password', updatePassword);

router.get('/:id', authMiddleware, getUserById);
// router.post('/', createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;