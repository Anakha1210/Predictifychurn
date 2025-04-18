
# Logistic Regression Model Implementation
import sys
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.impute import SimpleImputer
import pickle

def run_model(input_data):
    """
    Run Logistic Regression model on the provided dataset
    
    Args:
        input_data (dict): Contains csv_path, model_id, and output_dir
    
    Returns:
        dict: Results including metrics and predictions
    """
    csv_path = input_data.get('csv_path')
    model_id = input_data.get('model_id')
    output_dir = input_data.get('output_dir')
    
    # Load the CSV data
    data = pd.read_csv(csv_path)
    
    # Handle different column naming conventions
    def get_column(df, possible_names):
        for name in possible_names:
            if name in df.columns:
                return name
        return None

    # Map column names
    customer_id_col = get_column(data, ['CustomerID', 'customer_id'])
    gender_col = get_column(data, ['Gender', 'gender'])
    senior_citizen_col = get_column(data, ['SeniorCitizen', 'senior_citizen'])
    partner_col = get_column(data, ['Partner', 'partner'])
    dependents_col = get_column(data, ['Dependents', 'dependents'])
    tenure_col = get_column(data, ['Tenure', 'tenure'])
    phone_service_col = get_column(data, ['PhoneService', 'phone_service'])
    multiple_lines_col = get_column(data, ['MultipleLines', 'multiple_lines'])
    internet_service_col = get_column(data, ['InternetService', 'internet_service'])
    online_security_col = get_column(data, ['OnlineSecurity', 'online_security'])
    online_backup_col = get_column(data, ['OnlineBackup', 'online_backup'])
    device_protection_col = get_column(data, ['DeviceProtection', 'device_protection'])
    tech_support_col = get_column(data, ['TechSupport', 'tech_support'])
    streaming_tv_col = get_column(data, ['StreamingTV', 'streaming_tv'])
    streaming_movies_col = get_column(data, ['StreamingMovies', 'streaming_movies'])
    contract_col = get_column(data, ['Contract', 'contract'])
    paperless_billing_col = get_column(data, ['PaperlessBilling', 'paperless_billing'])
    payment_method_col = get_column(data, ['PaymentMethod', 'payment_method'])
    monthly_charges_col = get_column(data, ['MonthlyCharges', 'monthly_charges'])
    total_charges_col = get_column(data, ['TotalCharges', 'total_charges'])
    churn_col = get_column(data, ['Churn', 'churn', 'is_churned'])

    # Identify the target variable
    if churn_col:
        y = data[churn_col].map(lambda x: 1 if x == 'Yes' or x == True or x == 1 or x == '1' else 0)
    else:
        raise ValueError("Could not find churn column in the dataset")

    # Remove customer ID and target column from features
    feature_cols = [col for col in data.columns if col not in [customer_id_col, churn_col]]

    # Define feature types
    numeric_features = [col for col in [tenure_col, monthly_charges_col, total_charges_col] if col in feature_cols]
    categorical_features = [col for col in feature_cols if col not in numeric_features]

    # Handle the TotalCharges column which might have spaces
    if total_charges_col in data.columns:
        # Convert empty strings or spaces to NaN
        data[total_charges_col] = pd.to_numeric(data[total_charges_col], errors='coerce')

    # Preprocessing for numeric features
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # Preprocessing for categorical features
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    # Bundle preprocessing for numerical and categorical features
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    # Prepare the data
    X = data[feature_cols]

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    # Create Logistic Regression classifier
    clf = Pipeline(steps=[('preprocessor', preprocessor),
                          ('classifier', LogisticRegression(max_iter=1000))])

    # Train the model
    clf.fit(X_train, y_train)

    # Make predictions
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    # Calculate metrics
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred, zero_division=0)),
        'f1_score': float(f1_score(y_test, y_pred, zero_division=0)),
        'auc_roc': float(roc_auc_score(y_test, y_prob))
    }

    # Save the model
    model_filename = f"{output_dir}/model_{model_id}.pkl"
    with open(model_filename, 'wb') as f:
        pickle.dump(clf, f)

    # Get feature importance (coefficients for logistic regression)
    feature_names = clf.named_steps['preprocessor'].get_feature_names_out()
    coefficients = clf.named_steps['classifier'].coef_[0]
    # Take absolute values to measure importance regardless of direction
    abs_coefficients = np.abs(coefficients)
    # Normalize to get relative importance
    importance = abs_coefficients / np.sum(abs_coefficients)
    
    feature_importance = [{'feature': name, 'importance': float(imp)} 
                         for name, imp in zip(feature_names, importance)]

    # Prepare test predictions for individual customers
    customer_predictions = []
    for i in range(len(X_test)):
        customer_id = data[customer_id_col].iloc[X_test.index[i]] if customer_id_col else f"CUST-{X_test.index[i]}"
        customer_predictions.append({
            'customer_id': str(customer_id),
            'churn_probability': float(y_prob[i]),
            'is_churn': bool(y_pred[i])
        })

    # Output results
    result = {
        'model_id': model_id,
        'model_type': 'logistic_regression',
        'metrics': metrics,
        'feature_importance': feature_importance,
        'model_path': model_filename,
        'predictions': customer_predictions
    }

    return result

if __name__ == "__main__":
    # Read input data from stdin when called directly
    input_data = json.loads(sys.stdin.read())
    result = run_model(input_data)
    print(json.dumps(result))
