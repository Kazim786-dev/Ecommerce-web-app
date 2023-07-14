import { Router } from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../../controllers/product/index.js';
import {verifyuserloggedin} from '../../middleware/auth.js'

const router = Router();

// Product routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/',verifyuserloggedin, createProduct);
router.put('/:id',verifyuserloggedin, updateProduct);
router.delete('/:id',verifyuserloggedin, deleteProduct);

export default router;
