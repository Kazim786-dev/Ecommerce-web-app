import Order from '../../models/order/index.js';
import Product from '../../models/product/index.js';

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

    const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
    const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided

    const totalCount = await Order.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const orders = await Order.find({ user: user._id })
    .skip((page - 1) * pageSize)
    .limit(pageSize);


    res.status(200).json({
      totalPages,
      data: orders 
    });

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

    // Fetch the product details from the database
    const productIds = products.map((product) => product.product);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(existingProducts.map((product) => [product._id.toString(), product]));

    // Check for quantity validation
    for (const p of products) {
      const product = productMap.get(p.product);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${p.product} does not exist.` });
      }
      else if (p.quantity < 1 || p.quantity > product.quantity) {
        return res.status(400).json({
          error: `Invalid quantity for product with ID ${p.product}. Quantity should be between 1 and ${product.quantity}.`,
        });
      }
    }

    const newOrder = new Order({
      user: foundUser._id,
      products,
      totalAmount,
      status
    });

     // Update product quantities after saving the order
     for (const p of products) {
      const product = productMap.get(p.product);
      const updatedQuantity = product.quantity - p.quantity;
      await Product.updateOne({ _id: product._id }, { quantity: updatedQuantity });
    }


    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the order. '+ error });
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

const updateProductQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Check if the specified product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Validate the quantity to be greater than or equal to 1
    if (quantity < 1) {
      return res.status(400).json({ error: `Quantity can't be less than 1.` });
    }

    // Update the quantity of the product using updateOne
    await Product.updateOne({ _id: productId }, { quantity });

    res.json({ message: 'Product quantity updated successfully.' });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the product quantity.' });
  }
};


module.exports = {
  getAllOrders,
  getAllUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrderProducts,
  updateProductQuantity
}