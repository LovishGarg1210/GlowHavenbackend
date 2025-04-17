const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary (make sure env variables are set)
cloudinary.config({
  cloud_name: "dkd7nlrmy",
  api_key: "213862567431516",
  api_secret: "H3zQG-k7HG6t7ZV2k5mlyJ4GpV8"
});

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a product with Cloudinary
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // remove temp file
    }

    const product = new Product({ name, price, category, description, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update a product with Cloudinary
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const updateFields = { name, price, category, description };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateFields.imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};