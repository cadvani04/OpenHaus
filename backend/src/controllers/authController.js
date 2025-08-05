const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  console.log('🔐 [AUTH] Registration attempt:', { email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name });
  
  try {
    const { email, password, first_name, last_name, phone, company_name, license_number, state } = req.body;
    
    // Validate required fields
    if (!email || !password || !first_name || !last_name || !phone || !state) {
      console.log('❌ [AUTH] Registration failed - missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('❌ [AUTH] Registration failed - user already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      email, password, first_name, last_name, phone, company_name, license_number, state
    });
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    console.log('✅ [AUTH] Registration successful:', { user_id: user.id, email: user.email });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name,
        company_name: user.company_name,
        state: user.state 
      },
      token
    });
  } catch (error) {
    console.error('❌ [AUTH] Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  console.log('🔐 [AUTH] Login attempt:', { email: req.body.email });
  
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      console.log('❌ [AUTH] Login failed - missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('❌ [AUTH] Login failed - user not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      console.log('❌ [AUTH] Login failed - invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    console.log('✅ [AUTH] Login successful:', { user_id: user.id, email: user.email });
    
    res.json({
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name,
        company_name: user.company_name,
        state: user.state 
      },
      token
    });
  } catch (error) {
    console.error('❌ [AUTH] Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  console.log('🔐 [AUTH] Get profile request for user:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ [AUTH] Profile not found for user:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ [AUTH] Profile retrieved successfully for user:', userId);
    res.json({ user });
  } catch (error) {
    console.error('❌ [AUTH] Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login, getProfile };