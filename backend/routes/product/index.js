import { Router } from 'express';
import upload from '../../middleware/multer.js';
import multer from 'multer';
const updateupload=multer()

import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
} from '../../controllers/product/index.js';
import authMiddleware from '../../middleware/auth.js'

const router = Router();

// Product routes
router.get('/', getProducts);
router.get('/:id',authMiddleware, getProductById);

// Use the multer middleware to handle the form data (after this iddleware all form data will be in request body)
router.post('/',authMiddleware, upload, createProduct);
router.put('/:id',authMiddleware, upload, updateProduct);

router.delete('/:id',authMiddleware, deleteProduct);

export default router;
