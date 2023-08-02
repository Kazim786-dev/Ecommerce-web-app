import Order from '../../models/order/index.js';
import Product from '../../models/product/index.js';
import User from '../../models/user/index.js'

// Controller functions
const getOrderByOrderNumber = async (id, page, size) => {
  try {
    const orders = await Order.find({ orderNumber: { $regex: id, $options: 'i'} })
      .skip((page - 1) * size)
      .limit(size)
      .populate("user", "-password");

    return orders.length>0 ? { data: orders, totalPages: 1 } : null;
  } catch (error) {
    throw new Error("Error occurred while fetching the order.");
  }
};

const getOrdersByUserName = async (id, page, size) => {
  try {
    const users = await User.find({ name: { $regex: id, $options: 'i' } });

    if (users.length === 0) {
      return { data: [], totalPages: 0 };
    }

    const userIds = users.map((user) => user._id);
    const totalCount = await Order.countDocuments({ user: { $in: userIds } });
    const totalPages = Math.ceil(totalCount / size);

    const orders = await Order.find({ user: { $in: userIds } })
      .skip((page - 1) * size)
      .limit(size)
      .populate("user", "-password");

    return { data: orders, totalPages };
  } catch (error) {
    throw new Error("Error occurred while fetching orders.");
  }
};

const getAllOrders = async (req, res) => {
  const { role } = req.user.user;
  if (role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id, page = 1, size = 9 } = req.query;

    if (id) {
      const foundOrders = await getOrderByOrderNumber(id, page, size );
      if (foundOrders.data.length>0) {
        return res.status(200).json(foundOrders);
      } else {
        const orders = await getOrdersByUserName(id, page, size);
        return res.status(200).json(orders);
      }
    } else {
      const totalCount = await Order.countDocuments();
      const totalPages = Math.ceil(totalCount / size);

      const orders = await Order.find()
        .skip((page - 1) * size)
        .limit(size)
        .populate("user", "-password");

      return res.status(200).json({
        totalPages,
        data: orders,
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};

const getAllUserOrders = async (req, res) => {
  const {role} = req.user.user
  if(role!=='customer'){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    
    const user = req.user.user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
    const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided

    const orders = await Order.find({ user: user._id })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

    const totalCount = orders.length
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      totalPages,
      data: orders 
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
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
//   const {id} = req.query
//   if(!id){
//     return res.status(400).json({error:"Bad request"})
//   }

//   try {
//     const order = await Order.findOne({orderNumber:id})

//     if (order) {
//       const totalPages = 1
//       const user = await User.findById(order.user)

//       const ordersWithUser = [
//         {
//           ...order.toObject(),
//           user:user
//         }
//       ]
//       return res.status(200).json({
//         data: ordersWithUser,
//         totalPages
//       });

//     } else {
//       getOrdersByUserName(req, res)
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Error occurred while fetching the order.' });
//   }
// };

const getOrderSummary = async (req, res) => {
  try {
    // Calculate total amount of all orders
    const totalAmountResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalAmount = totalAmountResult[0]?.totalAmount || 0;

    // Calculate total orders
    const totalOrdersResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalOrders = totalOrdersResult[0]?.totalOrders || 0;

    // Calculate total units in orders
    const totalUnitsResult = await Order.aggregate([
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum : 1 }, // total products in all orders

          // totalUnits: { $sum: '$products.quantity' },
        },
      },
    ]);

    const totalUnits = totalUnitsResult[0]?.totalUnits || 0;

    res.status(200).json({
      totalAmount,
      totalOrders,
      totalUnits,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the order summary.' });
  }
};

const createOrder = async (req, res) => {
  const {role} = req.user.user
  if(role!=='customer'){
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
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


module.exports = {
  getAllOrders,
  getAllUserOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrderProducts,
  getOrderSummary
}