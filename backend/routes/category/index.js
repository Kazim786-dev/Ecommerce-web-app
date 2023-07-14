import { Router } from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from '../../controllers/category/index.js';

const router = Router();

// Category routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
