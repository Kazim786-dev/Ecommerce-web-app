import Order from '../../models/order/index.js';

// Controller functions
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the order.' });
  }
};

export const createOrder = async (req, res) => {
  const { user, products, totalAmount, status } = req.body;
  try {
    const newOrder = new Order({
      user,
      products,
      totalAmount,
      status
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user, products, totalAmount, status } = req.body;
  try {
    const order = await Order.findById(id);
    if (order) {
      order.user = user || order.user;
      order.products = products || order.products;
      order.totalAmount = totalAmount || order.totalAmount;
      order.status = status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the order.' });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (order) {
      await order.remove();
      res.json({ message: 'Order deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the order.' });
  }
};