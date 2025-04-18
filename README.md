
# PredictifyChurn

A customer churn prediction application with React frontend and Express backend.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd predictifychurn
```

2. Install dependencies for both frontend and backend:
```bash
# Install dependencies for frontend
npm install

# Install dependencies for backend
cd server
npm install
```

3. Set up database connection and permissions:
```bash
# Navigate to server directory (if not already there)
cd server

# Add dotenv dependency
npm install dotenv --save

# Run permissions setup script
npm run setup-permissions
```

4. Update your database configuration:
   The setup script creates a `.env` file in the `server` directory. Edit this file with your PostgreSQL credentials:
```
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=predictifychurn
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

5. Create the database in PostgreSQL:
```bash
# Using psql (you may need to provide password when prompted)
psql -U your_postgres_username -c "CREATE DATABASE predictifychurn;"
```

6. Run the database setup script:
```bash
npm run setup-db
```

7. Start the development servers:
```bash
# Start both frontend and backend
npm run dev:all

# Or start them separately:
# Backend: npm run dev
# Frontend: npm run frontend
```

## Troubleshooting Permission Issues

If you encounter permission errors:

### Database Permissions
- Make sure your PostgreSQL user has the right permissions
- Verify the credentials in the .env file are correct
- Ensure PostgreSQL is running

### File Permissions
For Unix/Linux/Mac:
```bash
# Make scripts executable if needed
chmod +x server/db-setup.js
chmod +x server/index.js
```

For Windows:
- Run your terminal or VS Code as Administrator if needed
- Check if Windows Defender or antivirus is blocking execution
- Ensure node is in your PATH environment variable

## Available Scripts

- `npm run dev:all`: Start both frontend and backend servers
- `npm run setup-permissions`: Configure permissions and test database connection
- `npm run setup-db`: Set up database schema
- `npm start`: Start production server

## Database Schema

The PostgreSQL schema includes the following tables:
- Users - User authentication and profile information
- Datasets - Uploaded customer datasets
- Customer Data - Individual customer records
- Prediction Models - Trained machine learning models
- Prediction Results - Churn prediction results
- Feature Importance - Model feature importance data
- Recommendations - AI-generated strategies to reduce churn

For details, see `src/database/schema.sql` or the Database Schema view in the application.
