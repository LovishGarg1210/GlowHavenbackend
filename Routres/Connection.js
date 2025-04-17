const express = require('express');
const router = express.Router();
const {
  getConnections,
  createConnection,updateConnectionStatus
} = require('../Controller/Connection');

// POST from user (frontend form)
router.post('/add', createConnection);

// GET for admin
router.get('/all', getConnections);
router.put('/update/:id', updateConnectionStatus);

module.exports = router;
