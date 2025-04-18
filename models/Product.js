const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: String,
  description: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
