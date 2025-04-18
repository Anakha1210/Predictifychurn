-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add default admin user (password: admin123)
INSERT INTO users (name, email, password)
VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$mj1JDnE7tKn8K6G5p.qz7OYwzVG5v3P6VHEf7tuVcJ5Qj0yUQh.Hy'
)
ON CONFLICT (email) DO NOTHING;

-- Add user_id foreign key to prediction_models table
ALTER TABLE prediction_models
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);