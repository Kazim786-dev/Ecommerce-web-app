import { Router } from 'express';
import authMiddleware from '../../middleware/auth'

const router = Router();

//controller functions
import {
    getUserById,
    updateUser,
    deleteUser,
    verifyMail,
    updatePassword
  } from '../../controllers/user/index.js';

// User routes

router.post('/verify-mail', verifyMail);
router.patch('/update-password', updatePassword);

router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;