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
const productRoutes = require('./Routes/product');
const connectionRoutes = require('./Routes/Connection');
const authRoutes = require('./Routes/Loginmodel');

app.use('/api/auth', authRoutes); // Auth route for login

app.use('/api/products', productRoutes);
app.use('/api/connection', connectionRoutes);

// DB and Server Start
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err));
