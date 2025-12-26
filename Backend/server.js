const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============ DATABASE CONNECTION ============
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI && process.env.MONGO_URI.trim() !== '') {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB Connected Successfully');
    } else {
      console.log('⚠️  MongoDB not configured. Running without database.');
    }
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    console.log('⚠️  Continuing without database...');
  }
};

connectDB();

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Wheelix API is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ============ API ROUTES ============
try {
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/user');
  const adminRoutes = require('./routes/admin');
  const garageRoutes = require('./routes/garage');

  console.log('Auth routes loaded:', typeof authRoutes);
  console.log('User routes loaded:', typeof userRoutes);
  console.log('Admin routes loaded:', typeof adminRoutes);
  console.log('Garage routes loaded:', typeof garageRoutes);

  if (authRoutes) app.use('/api/auth', authRoutes);
  if (userRoutes) app.use('/api/user', userRoutes);
  if (adminRoutes) app.use('/api/admin', adminRoutes);
  if (garageRoutes) app.use('/api/garage', garageRoutes);

  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error(error.stack);
}


// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Wheelix Backend Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================\n');
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
