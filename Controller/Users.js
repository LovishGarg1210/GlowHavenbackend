const bcrypt = require('bcrypt');
const Userrr = require('../models/Users');

// Register Controller
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Userrr.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Userrr({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  const { product, email } = req.body;

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingItem = user.cart.find(item => 
      item.productId.toString() === product._id.toString()
    );

    if (existingItem) {
      return res.status(200).json({ 
        message: 'Product already in cart', 
        alreadyExists: true,
        cart: user.cart 
      });
    } else {
      user.cart.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });

      await user.save();
      return res.status(200).json({ 
        message: 'Product added to cart', 
        alreadyExists: false, 
        cart: user.cart 
      });
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get Cart Items
const getCartItems = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove Cart Item
const removeCartItem = async (req, res) => {
  const { email, productId } = req.body;

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter(item => item.productId !== productId);
    await user.save();

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 📦 Place Order (NEW!)
const placeOrder = async (req, res) => {
  const { email, shippingInfo } = req.body;

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = user.cart.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );

    // Add new order
    user.orders.push({
      cartItems: user.cart,
      totalPrice,
      shippingInfo,
    });

    // Clear the cart
    user.cart = [];

    await user.save();

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Fetch user orders
const getUserOrders = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming user has a property "orders" storing order data
    res.status(200).json({ orders: user.orders || [] });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user password
const updateUserPassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await Userrr.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save updated password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};
const getAllUsersWithOrders = async (req, res) => {
  try {
    // Fetch all users with their orders
    const users = await Userrr.find();

    const usersWithOrders = users.map((user) => {
      return {
        email: user.email,
        orders: user.orders || [],
      };
    });

    res.status(200).json({ success: true, users: usersWithOrders });
  } catch (error) {
    console.error('Error fetching users and orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users and orders' });
  }
};
// Update cart item quantity

const updateCartQuantity = async (req, res) => {
  const { email, productId, quantity } = req.body;

  if (!email || !productId || typeof quantity !== 'number') {
    return res.status(400).json({ message: 'Missing or invalid data' });
  }

  try {
    const result = await Userrr.updateOne(
      { email, 'cart.productId': productId },
      { $set: { 'cart.$.quantity': quantity } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      res.status(404).json({ message: 'Item not found or not updated' });
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = {
  registerUser,
  loginUser,
  addToCart,
  getCartItems,
  removeCartItem,
  placeOrder,
  getUserOrders ,
  updateUserPassword,
  getAllUsersWithOrders,
  updateCartQuantity
  
  // ✅ Don't forget to add to your routes!
};