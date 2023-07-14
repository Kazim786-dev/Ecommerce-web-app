import {Router} from 'express'
import { Signup, Signin } from "../../controllers/auth/index.js";

const router = Router();

router.post("/signup", Signup);
router.get("/signin", Signin);

export default router;