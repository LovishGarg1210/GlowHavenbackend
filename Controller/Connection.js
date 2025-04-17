const Connection = require('../models/Connection');
const nodemailer = require('nodemailer');

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password (not your real email password)
  },
  logger: true,  // To log the email transport
  debug: true     // To show debug logs in console
});

// Get all connections (admin view)
exports.getConnections = async (req, res) => {
  try {
    const connections = await Connection.find().sort({ createdAt: -1 });
    res.json(connections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch connections' });
  }
};

// Save new connection (from frontend form)
exports.createConnection = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    const newConnection = new Connection({ fullName, email, message });
    await newConnection.save();

    // Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newConnection.email, // Your admin email
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${newConnection.fullName}</p>
        <p><strong>Email:</strong> ${newConnection.email}</p>
        <p><strong>Message:</strong><br/>Thanks for Registering, we will update u soon </p>
      `
    };

    // Send email and log any errors
    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', newConnection.email);
    } catch (mailError) {
      console.error('❌ Error sending email:', mailError);
    }

    res.status(201).json({ message: 'Message submitted successfully and email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit message' });
  }
};

// Update connection status (send email on status update)
exports.updateConnectionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const connection = await Connection.findByIdAndUpdate(id, { status }, { new: true });
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Send Email to user about status change
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: connection.email,
      subject: 'Update on Your Contact Message',
      html: `
        <h2>Hello ${connection.fullName},</h2>
        <p>Thank you for reaching out to us.</p>
        <p>We have updated the status of your message to: <strong>${status}</strong>.</p>
        <p>If you have any further questions, feel free to reply.</p>
        <br/>
        <p>— Your Support Team</p>
      `
    };

    // Send email and log any errors
    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Status update email sent successfully to:', connection.email);
    } catch (mailError) {
      console.error('❌ Error sending email:', mailError);
    }

    res.json({ message: 'Status updated and email sent.', connection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update connection status' });
  }
};
