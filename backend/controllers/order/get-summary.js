import Order from '../../models/order';

// const getOrderSummary = async (req, res) => {
//     try {
//       // Calculate total amount of all orders
//       const totalAmountResult = await Order.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalAmount: { $sum: '$totalAmount' },
//           },
//         },
//       ]);
  
//       const totalAmount = totalAmountResult[0]?.totalAmount || 0;
  
//       // Calculate total orders
//       const totalOrdersResult = await Order.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalOrders: { $sum: 1 },
//           },
//         },
//       ]);
  
//       const totalOrders = totalOrdersResult[0]?.totalOrders || 0;
  
//       // Calculate total units in orders
//       const totalUnitsResult = await Order.aggregate([
//         {
//           $unwind: '$products',
//         },
//         {
//           $group: {
//             _id: null,
//             totalUnits: { $sum : 1 }, // total products in all orders
  
//             // totalUnits: { $sum: '$products.quantity' },
//           },
//         },
//       ]);
  
//       const totalUnits = totalUnitsResult[0]?.totalUnits || 0;
  
//       res.status(200).json({
//         totalAmount:totalAmount.toFixed(2),
//         totalOrders,
//         totalUnits,
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while fetching the order summary.' });
//     }
//   };


const getOrderSummary = async () => {
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
          totalUnits: { $sum: 1 },
        },
      },
    ]);

    const totalUnits = totalUnitsResult[0]?.totalUnits || 0;

    return {
      status: 200,
      data: {
        totalAmount: totalAmount.toFixed(2),
        totalOrders,
        totalUnits,
      },
    };
  } catch (error) {
    throw new Error('An error occurred while fetching the order summary.');
  }
};

  export default getOrderSummary