
import fs from 'fs';

import cloudinary from '../../middleware/cloudinary.js';

import Product from '../../models/product/index.js';

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send( 'Product not found.' );
    }
  } catch (error) {
    res.status(500).send( 'Error occurred while fetching the product.' );
  }
};

const createProduct = async (req, res) => {

  const {role} = req.user.user
  if(role!=='admin'){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, description, price, quantity, size, color } = req.body;

  try {
    // Check if the specified category exists
    // const existingCategory = await Category.findById(category);
    // if (!existingCategory) {
    //   return res.status(404).json({ error: 'Category not found.' });
    // }

    if (quantity < 1) {
      return res.status(400).json({ error: `Quantity can't be less than 1.` });
    }

    let image = '';
    // Check if an image was uploaded
    if (req.file) {
      const uniqueId = Date.now().toString(); // Generate a unique identifier (timestamp in this case)
      const localFilePath = req.file.path
      const cloudPath = "products/" + localFilePath.replace(/\\/g, "/") + uniqueId;
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, { public_id: cloudPath });

      // Remove the temporary file
      fs.unlink(localFilePath, async (error) => {
        if (error) {
          res.status(400).json({ error: 'Error in file' });
        } else {
          // Retrieve the image URL from the Cloudinary response
          image = result.secure_url;
          const newProduct = new Product({
            name:description,
            description,
            price,
            quantity,
            image: image,
          });
          const savedProduct = await newProduct.save();

          res.status(201).json(savedProduct);
        }
      });

    }
    else{
      return res.status(400).send('Error: Image not provided');
    }

  } catch (error) {
    // if (error.code === 11000) {
    //   // Duplicate name error
    //   res.status(400).json({ error: 'Product name must be unique.' });
    // } else {
      console.log(error)
      res.status(500).json({ error: 'Error occurred while creating the product.' });
    // }
  }
};

const updateProduct = async (req, res) => {
  const {role} = req.user.user
  if(role!=='admin'){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { description, price, quantity } = req.body;
  
  try {
    const product = await Product.findById(id);
    if (product) {
      // const existingCategory = await Category.findById(category);
      // if (!existingCategory) {
      //   return res.status(404).json({ error: 'Category not found.' });
      // }

      let image=''
      if(req.file){
        const uniqueId = Date.now().toString(); // Generate a unique identifier (timestamp in this case)
        const localFilePath = req.file.path
        const cloudPath = "products/" + localFilePath.replace(/\\/g, "/") + uniqueId;
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, { public_id: cloudPath });

        // Remove the temporary file
        fs.unlink(localFilePath, async (error) => {
          if (error) {
            res.status(400).json({ error: 'Error deleting file' });
          }
          else{
            image = result.secure_url;
            product.image = image
            product.description = description || product.description;
            product.price = price || product.price;
            product.quantity = quantity || product.quantity;
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
          }
        })
      }
      else{
        product.description = description || product.description;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;

        const updatedProduct = await product.save();
        
        res.status(200).json(updatedProduct);
      }
    } else {
      res.status(404).send('Product not found.' );
    }
  } catch (error) {
    res.status(500).send('Error occurred while updating the product.' );
  }
};

const deleteProduct = async (req, res) => {
  const {role} = req.user.user
  if(role!=='admin'){
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      product.isDeleted=true;
      await product.save()
      res.status(200).send(  'Product deleted successfully.' );
    } else {
      res.status(404).send(  'Product not found.' );
    }
  } catch (error) {
    console.log(error)
    res.status(500).send( 'Error occurred while deleting the product.');
  }
};

// const getProducts = async (req, res) => {
//   try {
//     const sortOrder = req.query.sort; // The query parameter for sorting ('asc' or 'desc')
//     if (sortOrder && (sortOrder !== 'asc' && sortOrder !== 'desc')) {
//       return res.status(400).json({ error: 'Invalid sort order. Use "asc" or "desc".' });
//     }

//     const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
//     const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided
//     const totalCount = await Product.countDocuments();
//     const totalPages = Math.ceil(totalCount / pageSize);

//     const sortField = 'price';
//     const sortOptions = {};
//     sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

//     let products = []
//     const queryName = req.query.name;

//     const findQuery = {
//       isDeleted:false,
//       $or: [
//         { name: { $regex: queryName, $options: 'i' } }, // Case-insensitive search on name
//         { description: { $regex: queryName, $options: 'i' } }, // Case-insensitive search on description
//       ],
//     }
    
//     if (queryName && sortOrder) {
//       products = await Product.find(findQuery)
//         .sort(sortOptions)
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
//     }
//     else if (queryName) {
//       products = await Product.find(findQuery)
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
//     }
//     else if (sortOrder) {
//       products = await Product.find({isDeleted:false})
//         .sort(sortOptions)
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
//     }
//     else {
//       products = await Product.find({isDeleted:false})
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
//     }

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'No products found.' });
//     }

//     res.status(200).json({
//       totalPages,
//       data: products,
//     });
//   } catch (error) {
//     console.error('Error while fetching products:', error);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// };

const getProducts = async (req, res) => {
  try {
    const sortOrder = req.query.sort;
    if (sortOrder && sortOrder !== 'asc' && sortOrder !== 'desc') {
      return res.status(400).json({ error: 'Invalid sort order. Use "asc" or "desc".' });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 8;
    const queryName = req.query.name;
    const sortField = 'price';
    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    const findQuery = queryName
      ? {
          isDeleted: false,
          $or: [
            { name: { $regex: queryName, $options: 'i' } },
            { description: { $regex: queryName, $options: 'i' } },
          ],
        }
      : { isDeleted: false };

    const totalCount = await Product.countDocuments(findQuery);
    const totalPages = Math.ceil(totalCount / pageSize);

    const products = await Product.find(findQuery)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }

    res.status(200).json({
      totalPages,
      data: products,
    });
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}