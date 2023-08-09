import Order from '../../models/order';

const updateOrder = async (id, body) => {
  try {
    const { user, products, totalAmount, status } = body;
    const order = await Order.findById(id);
    if (order) {
      order.user = user || order.user;
      order.products = products || order.products;
      order.totalAmount = totalAmount || order.totalAmount;
      order.status = status || order.status;
      const updatedOrder = await order.save();
      return {
        status: 200,
        data: updatedOrder,
      };
    } else {
      return {
        status: 404,
        data: { error: 'Order not found.' },
      };
    }
  } catch (error) {
    throw new Error('An error occurred while updating the order.');
  }
};




  export default updateOrder