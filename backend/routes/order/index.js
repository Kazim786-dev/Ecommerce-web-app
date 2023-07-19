import { Router } from 'express';
import { 
    getAllOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder,
    getAllUserOrders,
    getAllOrderProducts
} from '../../controllers/order/index.js';

const router = Router();

// Order routes
router.get('/', getAllOrders);
router.get('/user-orders', getAllUserOrders);
router.post('/order-products', getAllOrderProducts);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
