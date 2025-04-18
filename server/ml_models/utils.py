# Utility functions for ML models
import pandas as pd
import numpy as np

def preprocess_dataset(data):
    """
    Common preprocessing for datasets
    
    Args:
        data (pd.DataFrame): Raw dataset
        
    Returns:
        tuple: Processed X features, y target, and metadata
    """
    # Handle different column naming conventions
    def get_column(df, possible_names):
        for name in possible_names:
            if name in df.columns:
                return name
        return None
    
    # Map common column names
    customer_id_col = get_column(data, ['CustomerID', 'customer_id'])
    churn_col = get_column(data, ['Churn', 'churn', 'is_churned'])
    
    metadata = {
        'customer_id_col': customer_id_col,
        'churn_col': churn_col
    }
    
    # Identify the target variable
    if churn_col:
        y = data[churn_col].map(lambda x: 1 if x == 'Yes' or x == True or x == 1 or x == '1' else 0)
    else:
        raise ValueError("Could not find churn column in the dataset")
    
    # Remove customer ID and target column from features
    feature_cols = [col for col in data.columns if col not in [customer_id_col, churn_col]]
    X = data[feature_cols]
    
    return X, y, metadata
