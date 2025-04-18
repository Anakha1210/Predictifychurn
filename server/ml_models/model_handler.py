import numpy as np
import pandas as pd
from DT import DecisionTreeModel
from LR import LogisticRegressionModel
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

def prepare_data(data):
    # Convert target variable to numeric
    le = LabelEncoder()
    target = 'Churn' if 'Churn' in data.columns else 'churn'
    y = le.fit_transform(data[target])
    
    # Drop target and ID columns
    X = data.drop([target], axis=1)
    if 'CustomerID' in X.columns:
        X = X.drop(['CustomerID'], axis=1)
    elif 'customer_id' in X.columns:
        X = X.drop(['customer_id'], axis=1)
    
    # Handle categorical variables
    X = pd.get_dummies(X)
    
    return X, y

def train_model(model_type, data):
    """Train the selected model and return metrics and feature importance"""
    # Prepare data
    X, y = prepare_data(data)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize the selected model
    if model_type.lower() == 'dt':
        model = DecisionTreeModel()
    elif model_type.lower() == 'lr':
        model = LogisticRegressionModel()
    else:
        raise ValueError(f"Unsupported model type: {model_type}")
    
    # Train the model and get metrics
    metrics, roc_curve_data = model.train(X_train, y_train)
    
    # Get feature importance
    feature_importance = model.get_feature_importance(X.columns)
    
    return {
        'metrics': metrics,
        'roc_curve': roc_curve_data,
        'feature_importance': feature_importance
    }