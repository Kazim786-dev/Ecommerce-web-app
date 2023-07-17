
import fs from 'fs';

import cloudinary from '../../middleware/cloudinary.js';

import Product from '../../models/product/index.js';
import Category from '../../models/category/index.js';
import { timeStamp } from 'console';

// Controller functions
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

export const getProductById = async (req, res) => {
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

export const createProduct = async (req, res) => {

    const { name, description, price, category } = req.body;

    try {
      // Check if the specified category exists
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      let imageUrl = '';
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
            imageUrl = result.secure_url;
            const newProduct = new Product({
              name,
              description,
              price,
              category,
              imageUrl
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

export const updateProduct = async (req, res) => {
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
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

export const deleteProduct = async (req, res) => {
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
