
import Product from '../../models/product';

const getProductById = async ({id}) => {
  try {
    const product = await Product.findById(id);
    if (product) {
      return { status: 200, data: product };
    } else {
      return { status: 404, data: { error: 'Product not found.' } };
    }
  } catch (error) {
    throw new Error('An error occurred while fetching the product.');
  }
};

  export default getProductById