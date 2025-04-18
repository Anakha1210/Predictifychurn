-- PostgreSQL Database Schema for Customer Churn Prediction System

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Datasets table
CREATE TABLE datasets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(512),
    record_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded', -- uploaded, processing, processed, error
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Customer data table
CREATE TABLE customer_data (
    id SERIAL PRIMARY KEY,
    dataset_id INTEGER NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    senior_citizen BOOLEAN,
    partner BOOLEAN,
    dependents BOOLEAN,
    tenure INTEGER,
    phone_service BOOLEAN,
    multiple_lines VARCHAR(50),
    internet_service VARCHAR(50),
    online_security VARCHAR(50),
    online_backup VARCHAR(50),
    device_protection VARCHAR(50),
    tech_support VARCHAR(50),
    streaming_tv VARCHAR(50),
    streaming_movies VARCHAR(50),
    contract VARCHAR(50),
    paperless_billing BOOLEAN,
    payment_method VARCHAR(100),
    monthly_charges NUMERIC(10, 2),
    total_charges NUMERIC(10, 2),
    is_churned BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dataset FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

-- Prediction models table
CREATE TABLE prediction_models (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    model_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(512),
    accuracy NUMERIC(5, 4),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prediction results table
CREATE TABLE prediction_results (
    id SERIAL PRIMARY KEY,
    dataset_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    customer_data_id INTEGER NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    churn_probability NUMERIC(5, 4),
    is_churn BOOLEAN,
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dataset FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES prediction_models(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_data FOREIGN KEY (customer_data_id) REFERENCES customer_data(id) ON DELETE CASCADE
);

-- Feature importance table to track which features are most predictive of churn
CREATE TABLE feature_importance (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    importance_score NUMERIC(5, 4), -- Higher scores mean more predictive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES prediction_models(id) ON DELETE CASCADE
);

-- Recommendations table for storing AI-generated strategies to reduce churn
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    customer_data_id INTEGER,
    recommendation_text TEXT NOT NULL,
    category VARCHAR(100), -- e.g. "pricing", "service", "technical support", etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_data FOREIGN KEY (customer_data_id) REFERENCES customer_data(id) ON DELETE SET NULL
);

-- Indexes for improving query performance
CREATE INDEX idx_datasets_user_id ON datasets(user_id);
CREATE INDEX idx_customer_data_dataset_id ON customer_data(dataset_id);
CREATE INDEX idx_customer_data_customer_id ON customer_data(customer_id);
CREATE INDEX idx_prediction_results_dataset_id ON prediction_results(dataset_id);
CREATE INDEX idx_prediction_results_customer_id ON prediction_results(customer_id);
CREATE INDEX idx_feature_importance_model_id ON feature_importance(model_id);
