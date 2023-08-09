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

import VerifyRole from '../../middleware/role-verification.js';

const router = Router();

// Order routes
router.get('/', VerifyRole({ roleToCheck: 'admin' }), async (req, res) => {
    const { searchQuery, page = 1, size = 9 } = req.query;
    const { role } = req.user.user;

    try {
        const result = await getAllOrders({role: role, searchQuery: searchQuery, page: page, size: size});
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
})

router.get('/user-orders', async (req, res) => {
    const { role } = req.user.user;
    const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
    const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided

    try {
        const result = await getAllUserOrders({role: role, user: req.user.user, page: page, pageSize: pageSize});
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching orders.' });
    }
});

router.get('/summary', VerifyRole({ roleToCheck: 'admin' }), async (req, res) => {
    try {
        const result = await getOrderSummary();
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching the order summary.' });
    }
})

router.post('/order-products', async (req, res) => {
    const { products } = req.body;
    try {
        const result = await getAllOrderProducts({products: products});
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await createOrder({user: req.user.user, body: req.body});
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating the order. ' + error.message });
    }
});

router.put('/:id', VerifyRole({ roleToCheck: 'admin' }), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await updateOrder(id, req.body);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while updating the order.' });
    }
});

router.delete('/:id', VerifyRole({ roleToCheck: 'admin' }), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteOrder(id);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while deleting the order.' });
    }
});

export default router;
