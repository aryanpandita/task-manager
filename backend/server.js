require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Express server is running' });
});

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Start server first so you see "Server running" immediately
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// MongoDB connection (runs in background)
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/app';
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
