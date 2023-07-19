import Order from '../../models/order/index.js';
import Product from '../../models/product/index.js';
import User from '../../models/user/index.js'

// Controller functions
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
};

const getAllUserOrders = async (req, res) => {
  try {
    const user = req.user.user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const orders = await Order.find({ user: user._id });
    res.status(200).json({ orders: orders });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
};

const getOrderById = async (req, res) => {
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

const createOrder = async (req, res) => {
  const { products, totalAmount, status } = req.body;
  try {
    
    const foundUser = req.user.user

    if (!foundUser) {
      res.status(404).json({ error: "user not found" })
    }

    if (products.length < 1) {
      return res.status(400).json({ error: 'No products is added to order.' });
    }
    const productIds = products.map((product) => product.product);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({ error: 'One or more products do not exist.' });
    }

    const newOrder = new Order({
      user: foundUser._id,
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

const updateOrder = async (req, res) => {
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

const deleteOrder = async (req, res) => {
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

const getAllOrderProducts = async (req, res) => {
  const { products } = req.body;
  try {
    // Retrieve all product IDs and quantities from the 'products' field
    const productData = products.map(product => ({
      productId: product.product,
      quantity: product.quantity
    }));

    // Extract all product IDs from the 'products' field
    const productIds = productData.map(item => item.productId);

    // Use the $in operator to find products with IDs in the 'productIds' array
    const foundProducts = await Product.find({ _id: { $in: productIds } });

    // If no products are found, return an empty array
    if (!foundProducts) {
      return res.status(200).json([]);
    }

    // Associate quantities with respective products
    const productsWithQuantities = foundProducts.map(product => {
      const foundProductData = productData.find(item => item.productId.toString() === product._id.toString());
      return { ...product._doc, quantity: foundProductData.quantity };
    });

    res.status(200).json(productsWithQuantities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
}

module.exports = {
  getAllOrders,
  getAllUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrderProducts
}