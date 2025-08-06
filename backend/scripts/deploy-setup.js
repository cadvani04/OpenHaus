const { Pool } = require('pg');
require('dotenv').config();

async function deploySetup() {
  console.log('🚀 Starting deployment setup...');
  
  // Validate environment variables
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('Please set these in your Railway deployment variables');
    process.exit(1);
  }
  
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔗 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    console.log('📋 Setting up database schema...');
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    console.log('✅ Database schema applied successfully!');
    
    console.log('📊 Checking tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'agreements')
    `);
    
    console.log('📋 Found tables:', tablesResult.rows.map(row => row.table_name));
    
    console.log('🎉 Deployment setup complete!');
    
  } catch (error) {
    console.error('❌ Deployment setup failed:', error.message);
    
    // Check if it's a "relation already exists" error (schema already applied)
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Schema already exists, setup complete');
    } else {
      console.error('💥 Critical error during setup:', error);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

// Run the setup
deploySetup()
  .then(() => {
    console.log('✅ Deployment setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Deployment setup failed:', error);
    process.exit(1);
  }); 