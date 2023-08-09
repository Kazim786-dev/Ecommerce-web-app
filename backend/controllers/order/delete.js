import Order from '../../models/order';

// const deleteOrder = async (req, res) => {
//     const { id } = req.params;
//     try {
//       const order = await Order.findById(id);
//       if (order) {
//         await order.remove();
//         res.json({ message: 'Order deleted successfully.' });
//       } else {
//         res.status(404).json({ error: 'Order not found.' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while deleting the order.' });
//     }
//   };

const deleteOrder = async (id) => {
  try {
    const order = await Order.findById(id);
    if (order) {
      await order.remove();
      return {
        status: 200,
        data: { message: 'Order deleted successfully.' },
      };
    } else {
      return {
        status: 404,
        data: { error: 'Order not found.' },
      };
    }
  } catch (error) {
    throw new Error('An error occurred while deleting the order.');
  }
};

  export default deleteOrder