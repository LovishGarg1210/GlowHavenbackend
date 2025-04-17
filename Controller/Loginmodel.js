const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/Loginmodel'); // Adjust path if needed

// Configure the transporter (you can replace Gmail with any SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email (put in .env)
    pass: process.env.EMAIL_PASS  // your app password or real password (put in .env)
  }
});

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordCorrect = await user.password === password;

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    "fdsdjkgjksdfjksdfjksdf", // Ideally move to process.env.JWT_SECRET
    { expiresIn: '30d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
};

const updateAdminInfo = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const admin = await User.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  const isMatch = await admin.password === oldPassword;
  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' });
  }

  admin.password = newPassword;
  await admin.save();

  // ✅ Send email after update
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: admin.email,
    subject: 'Admin Credentials Updated',
    text: `Hello ${admin.email},\n\nYour admin password was successfully updated.\n\nIf you did not make this change, please contact support immediately.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  res.json({ message: 'Admin credentials updated successfully' });
};

module.exports = { loginUser, updateAdminInfo };
