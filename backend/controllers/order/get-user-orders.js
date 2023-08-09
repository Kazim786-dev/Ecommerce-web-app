import Order from '../../models/order';


const getAllUserOrders = async ({role, user, page, pageSize}) => {
  if (role !== 'customer') {
    return { status: 401, data: { error: 'Unauthorized' } };
  }

  try {
    if (!user) {
      return { status: 404, data: { error: 'User not found' } };
    }

    const orders = await Order.find({ user: user._id })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalCount = orders.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      status: 200,
      data: {
        totalPages,
        data: orders
      }
    };

  } catch (error) {
    console.log(error)
    throw new Error('An error occurred while fetching orders.');
  }
};


  export default getAllUserOrders