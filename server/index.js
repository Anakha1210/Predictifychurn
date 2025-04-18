
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to avoid port conflicts

// Import routes
const datasetRoutes = require('./routes/datasetRoutes');
const customerRoutes = require('./routes/customerRoutes');
const modelRoutes = require('./routes/modelRoutes');
const systemRoutes = require('./routes/systemRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/datasets', authMiddleware, datasetRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/models', authMiddleware, modelRoutes);
app.use('/api', systemRoutes);

// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
