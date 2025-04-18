import pg from 'pg';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:5001/api';

const { Pool } = pg;

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'predictifychurn',
  password: "ARV12",
  port: 5432,
});

async function createTestUser() {
  try {
    // First, create the users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Test user credentials
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    };

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);

    // Insert the test user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [testUser.name, testUser.email, hashedPassword]
    );

    console.log('Test user created:', result.rows[0]);

    // Test login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    console.log('Login successful! Token:', loginResponse.data.token);

  } catch (error) {
    if (error.code === '23505') { // Unique violation error code
      console.log('User already exists, trying to login...');
      try {
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: 'test@example.com',
          password: 'test123'
        });
        console.log('Login successful! Token:', loginResponse.data.token);
      } catch (loginError) {
        console.error('Login failed:', loginError.response?.data || loginError.message);
      }
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await pool.end();
  }
}

// Run the test
createTestUser();