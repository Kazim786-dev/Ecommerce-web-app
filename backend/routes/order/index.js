import { Router } from 'express';
import { 
    getAllOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from '../../controllers/order/index.js';

const router = Router();

// Order routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
