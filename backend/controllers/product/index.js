
import fs from 'fs';

import cloudinary from '../../middleware/cloudinary.js';

import Product from '../../models/product/index.js';
import Category from '../../models/category/index.js';

// Controller functions
// const getProducts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
//     const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided

//     const totalCount = await Product.countDocuments();
//     const totalPages = Math.ceil(totalCount / pageSize);
    
//     const products = await Product.find()
//       .skip((page - 1) * pageSize)
//       .limit(pageSize);

//       res.status(200).json({
//         totalPages,
//         data: products,
//       });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while fetching products.' });
//   }
// };

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

const createProduct = async (req, res) => {

    const { name, description, price, quantity, category, size, color } = req.body;

    try {
      // Check if the specified category exists
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      if(quantity<1){
        return res.status(400).json({ error: `Quantity can't be less than 1.` });
      }


      let image = '';
      // Check if an image was uploaded
      if (req.file) {
        const uniqueId = Date.now().toString(); // Generate a unique identifier (timestamp in this case)
        const localFilePath = req.file.path
        const cloudPath = "products/" + localFilePath.replace(/\\/g, "/") + uniqueId ;
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, { public_id: cloudPath });

        // Remove the temporary file
        fs.unlink(localFilePath, async(error) => {
          if (error) {
            res.json({error:'Error deleting file'});
          } else {
            // Retrieve the image URL from the Cloudinary response
            image = result.secure_url;
            const newProduct = new Product({
              name,
              description,
              price,
              quantity,
              category,
              image:image,
              size,
              color
            });
            const savedProduct = await newProduct.save();
            
            res.status(201).json(savedProduct);
          }
        });

      }

    } catch (error) {
      if (error.code === 11000) {
        // Duplicate name error
        res.status(400).json({ error: 'Product name must be unique.' });
      } else {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while creating the product.' });
      }
    }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  try {
    const product = await Product.findById(id);
    if (product) {

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.size = size || product.size;
      product.color = color || product.color;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      await product.remove();
      res.json({ message: 'Product deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
};

const getProductsByName = async (req, res) => {
  try {
    const query = req.query.name;
    if (!query) {
      return res.status(400).json({ error: 'Name query parameter is missing.' });
    }

    const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
    const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided

    const totalCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search on name
        { description: { $regex: query, $options: 'i' } }, // Case-insensitive search on description
      ],
    }).skip((page - 1) * pageSize)
      .limit(pageSize);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found with the provided name.' });
    }

    res.status(200).json({ 
      totalPages,
      data: products,
    });
  } catch (error) {
    console.error('Error while fetching products by name:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getProducts = async (req, res) => {
  try {
    const sortOrder = req.query.sort; // The query parameter for sorting ('asc' or 'desc')
    if (!sortOrder || (sortOrder !== 'asc' && sortOrder !== 'desc')) {
      return res.status(400).json({ error: 'Invalid sort order. Use "asc" or "desc".' });
    }

    const page = parseInt(req.query.page) || 1; // Default page 1 if not provided
    const pageSize = parseInt(req.query.size) || 8; // Default size 8 if not provided

    const totalCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const sortField = 'price'; // Default sort field (you can change this to any other field)

    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    let products =[]

    const queryName = req.query.name;
    if (queryName) {

      const findQuery = {
        $or: [
          { name: { $regex: queryName, $options: 'i' } }, // Case-insensitive search on name
          { description: { $regex: queryName, $options: 'i' } }, // Case-insensitive search on description
        ],
      }

      products = await Product.find(findQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    }
    else{
       products = await Product.find()
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    }

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
  getProductsByName
}