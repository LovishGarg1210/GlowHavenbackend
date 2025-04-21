const express = require('express');
const { registerUser, loginUser, addToCart, getCartItems, removeCartItem, getUserOrders, updateUserPassword,getAllUsersWithOrders ,updateCartQuantity,placeOrder} = require('../Controller/Users.js');
const router = express.Router();

// POST route to register user
router.post('/register', registerUser);

// POST route to log in user
router.post('/loginUser', loginUser);

// POST route to get user orders
router.post('/getUserOrders', getUserOrders);

// POST route to update user details
router.post('/updateUserpass', updateUserPassword);

// POST route to add product to cart
router.post("/cart", addToCart);

// POST route to get cart items
router.post("/Getcart", getCartItems);

// POST route to remove cart item
router.post('/Removecartitem', removeCartItem);
// POST route to remove cart item
router.post('/placeOrder', placeOrder);
router.get('/getAllUsersWithOrders', getAllUsersWithOrders);
router.post('/updateCartQuantity', updateCartQuantity);
module.exports = router;