const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const agreementRoutes = require('./routes/agreements');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true, // Allow all origins temporarily for debugging
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip || req.connection.remoteAddress}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agreements', agreementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'HomeShow backend is running!',
    timestamp: new Date().toISOString(),
    clientIP: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  });
});

// Simple test route without /api prefix
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Simple test - HomeShow backend is running!',
    timestamp: new Date().toISOString(),
    clientIP: req.ip || req.connection.remoteAddress
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 HomeShow backend running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(` Agreement endpoints: http://localhost:${PORT}/api/agreements`);
});