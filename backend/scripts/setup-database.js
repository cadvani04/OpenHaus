const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up database...');
  
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Reading schema from:', schemaPath);
    console.log('🔗 Connecting to database...');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database schema applied successfully!');
    console.log('📋 Tables created:');
    console.log('   - users');
    console.log('   - agreements');
    console.log('   - indexes');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    // Check if it's a "relation already exists" error (schema already applied)
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Schema already exists, skipping...');
    } else {
      throw error;
    }
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('🎉 Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }); 