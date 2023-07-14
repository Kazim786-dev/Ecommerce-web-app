import Product from '../../models/product/index.js';

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
    const newProduct = new Product({
      name,
      description,
      price,
      category
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate name error
      res.status(400).json({ error: 'Product name must be unique.' });
    } else {
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
