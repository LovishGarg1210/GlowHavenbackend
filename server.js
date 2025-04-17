const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const productRoutes = require('./routres/product');
const connectionRoutes = require('./Routres/Connection');
const authRoutes = require('./routres/Loginmodel');

app.use('/api/auth', authRoutes); // Auth route for login

app.use('/api/products', productRoutes);
app.use('/api/connection', connectionRoutes);

// DB and Server Start
mongoose.connect('mongodb+srv://user1210:Q3jrDucJ32OCoqcL@cluster0.4aniz.mongodb.net/GlowHaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err));
