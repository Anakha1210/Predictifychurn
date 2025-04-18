const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createUser() {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE
      );
    `);

    // User credentials
    const user = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    };

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Insert the user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email',
      [user.username, user.email, hashedPassword, user.role]
    );

    console.log('User created successfully:', {
      id: result.rows[0].id,
      email: result.rows[0].email
    });
    console.log('You can now login with:');
    console.log('Email:', user.email);
    console.log('Password:', user.password);

  } catch (error) {
    if (error.code === '23505') {
      console.log('User already exists with this email');
    } else {
      console.error('Error creating user:', error.message);
    }
  } finally {
    await pool.end();
  }
}

createUser();