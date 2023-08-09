

import Product from '../../models/product';

const deleteProduct = async ({id, user}) => {
  if (user.role !== 'admin') {
    return { status: 401, message: 'Unauthorized' };
  }

  try {
    const product = await Product.findById(id);
    if (product) {
      product.isDeleted = true;
      await product.save();
      return { status: 200, message: 'Product deleted successfully.' };
    } else {
      return { status: 404, message: 'Product not found.' };
    }
  } catch (error) {
    throw new Error('An error occurred while deleting the product.');
  }
};

  export default deleteProduct