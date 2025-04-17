const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../Controller/Product.js');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.get('/Get', productController.getAllProducts);
router.post('/Post', upload.single('image'), productController.createProduct);
router.put('/Update/:id', upload.single('image'), productController.updateProduct);
router.delete('/Delete/:id', productController.deleteProduct);

module.exports = router;
