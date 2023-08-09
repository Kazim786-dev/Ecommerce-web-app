
import Product from '../../models/product';

const getAllOrderProducts = async ({products}) => {
  try {
    const productData = products.map(product => ({
      productId: product.product,
      quantity: product.quantity,
    }));

    const productIds = productData.map(item => item.productId);

    const foundProducts = await Product.find({ _id: { $in: productIds } });

    if (!foundProducts) {
      return {
        status: 200,
        data: [],
      };
    }

    const productsWithQuantities = foundProducts.map(product => {
      const foundProductData = productData.find(item => item.productId.toString() === product._id.toString());
      return { ...product._doc, quantity: foundProductData.quantity };
    });

    return {
      status: 200,
      data: productsWithQuantities,
    };
  } catch (error) {
    throw new Error('Error fetching products');
  }
};

  export default getAllOrderProducts