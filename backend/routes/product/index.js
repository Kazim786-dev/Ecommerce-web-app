import { Router } from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../../controllers/product/index.js';
import authMiddleware from '../../middleware/auth.js'

const router = Router();

// Product routes
router.get('/', getAllProducts);
router.get('/:id',authMiddleware, getProductById);
router.post('/',authMiddleware, createProduct);
router.put('/:id',authMiddleware, updateProduct);
router.delete('/:id',authMiddleware, deleteProduct);

export default router;
