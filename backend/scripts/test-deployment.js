const { Pool } = require('pg');
require('dotenv').config();

async function testDeployment() {
  console.log('🧪 Testing deployment configuration...');
  
  // Test 1: Environment Variables
  console.log('\n📋 Test 1: Environment Variables');
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const optionalVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'FRONTEND_URL'];
  
  const missingRequired = requiredVars.filter(varName => !process.env[varName]);
  const presentOptional = optionalVars.filter(varName => process.env[varName]);
  
  if (missingRequired.length > 0) {
    console.error('❌ Missing required variables:', missingRequired);
    return false;
  } else {
    console.log('✅ All required variables present');
  }
  
  console.log('📊 Optional variables present:', presentOptional);
  
  // Test 2: Database Connection
  console.log('\n🔗 Test 2: Database Connection');
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connection successful');
    console.log('   Current time:', result.rows[0].current_time);
    console.log('   Database version:', result.rows[0].db_version.split(' ')[0]);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
  
  // Test 3: Database Schema
  console.log('\n📋 Test 3: Database Schema');
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'agreements')
      ORDER BY table_name
    `);
    
    const foundTables = tablesResult.rows.map(row => row.table_name);
    const expectedTables = ['users', 'agreements'];
    const missingTables = expectedTables.filter(table => !foundTables.includes(table));
    
    if (missingTables.length > 0) {
      console.error('❌ Missing tables:', missingTables);
      console.log('💡 Run: npm run deploy-setup');
      await pool.end();
      return false;
    } else {
      console.log('✅ All required tables present:', foundTables);
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    return false;
  }
  
  // Test 4: JWT Configuration
  console.log('\n🔐 Test 4: JWT Configuration');
  try {
    const jwt = require('jsonwebtoken');
    const testPayload = { userId: 'test' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userId === 'test') {
      console.log('✅ JWT signing and verification working');
    } else {
      console.error('❌ JWT verification failed');
      return false;
    }
  } catch (error) {
    console.error('❌ JWT test failed:', error.message);
    return false;
  }
  
  // Test 5: Optional Services
  console.log('\n📱 Test 5: Optional Services');
  
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    console.log('✅ Twilio SMS service configured');
  } else {
    console.log('⚠️ Twilio SMS service not configured (optional)');
  }
  
  if (process.env.FRONTEND_URL) {
    console.log('✅ Frontend URL configured:', process.env.FRONTEND_URL);
  } else {
    console.log('⚠️ Frontend URL not configured (will use localhost:3000)');
  }
  
  console.log('\n🎉 All tests passed! Your backend is ready for deployment.');
  console.log('\n📝 Next steps:');
  console.log('   1. Deploy to Railway');
  console.log('   2. Run: npm run deploy-setup (if not done already)');
  console.log('   3. Test endpoints: /health, /api/test');
  
  return true;
}

// Run the test
testDeployment()
  .then((success) => {
    if (success) {
      console.log('\n✅ Deployment test completed successfully');
      process.exit(0);
    } else {
      console.log('\n❌ Deployment test failed');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Test error:', error);
    process.exit(1);
  }); 