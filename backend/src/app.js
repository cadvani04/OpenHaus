const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import database connection
const db = require('./utils/database');

// Import routes
const authRoutes = require('./routes/auth');
const agreementRoutes = require('./routes/agreements');

const app = express();

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please set these variables in your Railway deployment');
  console.error('Current environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('JWT') || key.includes('PORT')));
  process.exit(1);
}

// Test database connection
async function testDatabaseConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your DATABASE_URL in Railway');
    console.error('DATABASE_URL format should be: postgresql://username:password@host:port/database');
    return false;
  }
}


+// Middleware
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

// Health check with database status
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      port: process.env.PORT || 3001
    });
  } catch (error) {
    res.status(200).json({ 
      status: 'WARNING', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      port: process.env.PORT || 3001,
      message: 'App is running but database is not connected'
    });
  }
});

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'HomeShow backend is running!',
    timestamp: new Date().toISOString(),
    clientIP: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    environment: process.env.NODE_ENV || 'development'
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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3001;

// Start server only after database connection test
async function startServer() {
  console.log('🔧 Starting server...');
  console.log('📊 Environment check:');
  console.log('   PORT:', process.env.PORT || 'not set (using 3001)');
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'not set');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');
  
  const dbConnected = await testDatabaseConnection();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HomeShow backend running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(` Agreement endpoints: http://localhost:${PORT}/api/agreements`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Database: ${dbConnected ? 'connected' : 'disconnected'}`);
  });
}

startServer().catch(error => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});