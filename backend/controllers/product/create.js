import fs from 'fs';

import cloudinary from '../../middleware/cloudinary.js';

import Product from '../../models/product';

const createProduct = async ({productData, imageFile, user}) => {
  if (user.role !== 'admin') {
    return { status: 401, data: { error: 'Unauthorized' } };
  }

  const { name, description, price, quantity, size, color } = productData;

  try {
    if (quantity < 1) {
      return { status: 400, data: { error: "Quantity can't be less than 1." } };
    }

    let image = '';
    // Check if an image was uploaded
    if (imageFile) {
      const uniqueId = Date.now().toString(); // Generate a unique identifier (timestamp in this case)
      const localFilePath = imageFile.path;
      const cloudPath = "products/" + localFilePath.replace(/\\/g, "/") + uniqueId;

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, { public_id: cloudPath });

      // Remove the temporary file
      fs.unlink(localFilePath, async (error) => {
        if (error) {
          console.log(error);
          throw new Error('Error in file');
        } else {
          // Retrieve the image URL from the Cloudinary response
          image = result.secure_url;
          const newProduct = new Product({
            name: description,
            description,
            price,
            quantity,
            image: image,
          });
          const savedProduct = await newProduct.save();

          return { status: 201, data: savedProduct };
        }
      });

    } else {
      return { status: 400, data: 'Error: Image not provided' };
    }
    // Return a pending status, as the response will be handled asynchronously
    return { status: 202};
  } catch (error) {
    console.log(error);
    throw new Error('An error occurred while creating the product.');
  }
};


export default createProduct