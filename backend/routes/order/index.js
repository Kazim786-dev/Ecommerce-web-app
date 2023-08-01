import { Router } from 'express';
import {
    getAllOrders,
    createOrder, 
    updateOrder, 
    deleteOrder,
    getAllUserOrders,
    getAllOrderProducts,
    getOrderSummary
} from '../../controllers/order/index.js';

const router = Router();

// Order routes
router.get('/', getAllOrders)
router.get('/user-orders', getAllUserOrders);
router.get('/summary', getOrderSummary)
router.post('/order-products', getAllOrderProducts);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
