
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database Configuration
// Update these values with your actual PostgreSQL connection details
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'predictifychurn',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

// Create a new pool instance
const pool = new Pool(dbConfig);

// Read SQL file
const sqlFilePath = path.join(__dirname, '../src/database/schema.sql');
const sqlScript = fs.readFileSync(sqlFilePath).toString();

// Execute SQL script
async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Connect to database
    const client = await pool.connect();
    console.log('Connected to database');
    
    // Execute SQL script
    await client.query(sqlScript);
    console.log('Database schema created successfully');
    
    // Release client
    client.release();
    console.log('Database setup complete');
    
    // Close pool
    await pool.end();
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
