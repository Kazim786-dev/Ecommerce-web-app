import {Router} from 'express'
import { Signup, Signin } from "../../controllers/auth/index.js";

const router = Router();

router.post("/signup", async (req, res)=> {
    const { name, email, password, mobile, role } = req.body;
    
    try{
        const result = await Signup({ name, email, password, mobile, role });
        return res.status(result.status).json({message: result.message})
    }
    catch(err){
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
});

router.post("/signin", async (req, res) => {
    
    const { email, password } = req.body;
    
    try {
      const result = await Signin({ email, password });
      res.status(result.status).json(result.data);
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });

export default router;