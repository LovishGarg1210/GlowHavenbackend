// routes/authRoutes.js
const express = require('express');
const { loginUser, updateAdminInfo  } = require('../controller/Loginmodel');

const router = express.Router();

// Login route
router.post('/login', loginUser);
router.put('/Update', updateAdminInfo);

module.exports = router;
