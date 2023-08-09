import { Router } from 'express';
import authMiddleware from '../../middleware/auth'

const router = Router();

//controller functions
import {
    getUserById,
    updateUser,
    verifyMail,
    updatePassword
  } from '../../controllers/user/index.js';

// User routes
router.post('/verify-mail', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await verifyMail({email:email});
    return res.status(result.status).json(result.message);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while verifying email.' });
  }
});

// Update Password
router.patch('/update-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await updatePassword({token: token, newPassword: newPassword});
    return res.status(result.status).json(result.message);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating password.' });
  }
});

// Get User by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await getUserById({id:id});
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
});

// Update User
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, mobile } = req.body;

  try {
    const result = await updateUser({id: id, userData: { name, email, password, mobile } });
    return res.status(result.status).json(result.message);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
});


export default router;