import { Router } from 'express';

const router = Router();

//controller functions
import {
    getAllUsers,
    getUserById,
    // createUser,
    updateUser,
    deleteUser
  } from '../../controllers/user/index.js';

// User routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
// router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;