const mongoose = require('mongoose');

// Define Order Schema
const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      productId: String,
      title: String,
      quantity: Number,
      price: Number,
      imageUrl: String
    }
  ],
  totalPrice: Number,
  shippingInfo: {
    name: String,
    address: String,
    city: String,
    zip: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  cart: {
    type: Array,
    default: []
  },

  orders: [orderSchema] // History of placed orders

}, { timestamps: true }); // Adds createdAt & updatedAt

const User = mongoose.model('Userrr', userSchema);

module.exports = User;