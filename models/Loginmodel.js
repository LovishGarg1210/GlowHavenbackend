
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // To hash passwords

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash password before saving user


const User = mongoose.model('User', UserSchema);
module.exports = User;
