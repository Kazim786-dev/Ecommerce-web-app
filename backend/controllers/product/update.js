import fs from 'fs';

import cloudinary from '../../middleware/cloudinary.js';

import Product from '../../models/product';

const updateProduct = async ({id, productData, imageFile, user}) => {
  if (user.role !== 'admin') {
    return { status: 401, data: { error: 'Unauthorized' } };
  }

  const { description, price, quantity } = productData;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return { status: 404, data: { error: 'Product not found.' } };
    }

    let image=''
        if(imageFile){
          const uniqueId = Date.now().toString(); // Generate a unique identifier (timestamp in this case)
          const localFilePath = imageFile.path
          const cloudPath = "products/" + localFilePath.replace(/\\/g, "/") + uniqueId;
          // Upload the image to Cloudinary
          const result = await cloudinary.uploader.upload(localFilePath, { public_id: cloudPath });
  
          // Remove the temporary file
          fs.unlink(localFilePath, async (error) => {
            if (error) {
              return { status: 400, data: 'Error deleting file' };
            }
            else{
              image = result.secure_url;
              product.image = image
              product.description = description || product.description;
              product.price = price || product.price;
              product.quantity = quantity || product.quantity;
              const updatedProduct = await product.save();
              return { status: 200, data: updatedProduct };
            }
          })
        }
        else{
          product.description = description || product.description;
          product.price = price || product.price;
          product.quantity = quantity || product.quantity;
  
          const updatedProduct = await product.save();
          return { status: 200, data: updatedProduct };
        }
        // Return a pending status, as the response will be handled asynchronously
      return { status: 202};

  } catch (error) {
    throw new Error('An error occurred while updating the product.');
  }
};

  export default updateProduct