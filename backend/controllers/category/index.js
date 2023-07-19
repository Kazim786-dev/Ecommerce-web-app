import Category from '../../models/category/index.js';

// Controller functions
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching categories.' });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the category.' });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({
      name
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the category.' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findById(id);
    if (category) {
      category.name = name || category.name;
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the category.' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (category) {
      await category.remove();
      res.json({ message: 'Category deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Category not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the category.' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};