
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Setting up project permissions...');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('Creating .env file from example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('⚠️ Please update the .env file with your database credentials! ⚠️');
}

// Make scripts executable
try {
  if (process.platform !== 'win32') {
    console.log('Making scripts executable...');
    execSync('chmod +x db-setup.js', { stdio: 'inherit' });
    execSync('chmod +x index.js', { stdio: 'inherit' });
    console.log('Scripts are now executable.');
  }
} catch (error) {
  console.error('Error making scripts executable:', error.message);
}

// Check for database connectivity
try {
  console.log('Testing database connection...');
  // Load env variables
  require('dotenv').config();
  
  const { Pool } = require('pg');
  const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'predictifychurn',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  };

  const pool = new Pool(dbConfig);
  
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('⚠️ Database connection failed:', err.message);
      console.log('Please check your database credentials in the .env file and make sure PostgreSQL is running.');
      process.exit(1);
    } else {
      console.log('✅ Database connection successful!');
      console.log('Connected at:', res.rows[0].now);
      pool.end();
    }
  });
} catch (error) {
  console.error('Error testing database connection:', error.message);
}

console.log('\nSetup complete! Follow these next steps:');
console.log('1. Update your database credentials in the server/.env file if you haven\'t already');
console.log('2. Run "npm run setup-db" to set up the database schema');
console.log('3. Start the application with "npm run dev:all"');
