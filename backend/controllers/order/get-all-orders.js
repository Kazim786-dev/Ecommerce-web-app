import Order from '../../models/order';
import User from '../../models/user'

const getAllOrders = async ({role, searchQuery, page=1, size=10}) => {
  
  try {
    if (searchQuery) {
      
      const foundOrders = await searchOrders(searchQuery, page, size);
      return { status: 200, data: foundOrders };

    } else {
      const totalCount = await Order.countDocuments();
      const totalPages = Math.ceil(totalCount / size);

      const orders = await Order.find()
        .skip((page - 1) * size)
        .limit(size)
        .populate("user", "-password");

      return { status: 200, data: { totalPages: totalPages, data: orders } };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};



const searchOrders = async (searchQuery, page, size) => {
  try {
    const userSearchQuery = { name: { $regex: searchQuery, $options: 'i' } };
    const orderNumberSearchQuery = { orderNumber: { $regex: searchQuery, $options: 'i' } };

    const userMatches = await User.find(userSearchQuery);
    const userIds = userMatches.map(user => user._id);

    const orders = await Order.find({
      $or: [
        { user: { $in: userIds } },
        orderNumberSearchQuery
      ]
    })
      .skip((page - 1) * size)
      .limit(size)
      .populate("user", "-password");

    const totalPages = Math.ceil(orders.length / size);

    return { data: orders, totalPages };
  } catch (error) {
    throw new Error("Error occurred while fetching orders.");
  }
};

  export default getAllOrders