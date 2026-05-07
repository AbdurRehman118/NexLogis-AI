import pandas as pd
import numpy as np
import os
import mlflow
import mlflow.sklearn
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib

def load_data(filepath):
    print(f"Loading data from {filepath}...")
    df = pd.read_csv(filepath)
    return df

def train_model():
    # Setup MLflow
    mlflow.set_tracking_uri("sqlite:///mlruns.db")
    mlflow.set_experiment("Courier_Rate_Prediction")

    with mlflow.start_run():
        # 1. Load Data
        df = load_data(os.path.join("data", "processed", "clean_rates.csv"))
        
        X = df.drop("Rate_Rs", axis=1)
        y = df["Rate_Rs"]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 2. Preprocessing
        categorical_features = ['Courier', 'Service_Category', 'Destination_Region']
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
            ],
            remainder='passthrough' # Weight_kg and Insured_Value_Rs
        )
        
        # 3. Model
        # Using RandomForestRegressor
        n_estimators = 100
        max_depth = 10
        model = RandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=42)
        
        # Create Pipeline
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('model', model)
        ])
        
        # 4. Train
        print("Training model...")
        pipeline.fit(X_train, y_train)
        
        # 5. Evaluate
        print("Evaluating model...")
        y_pred = pipeline.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"RMSE: {rmse:.2f}")
        print(f"MAE: {mae:.2f}")
        print(f"R2: {r2:.4f}")
        
        # 6. Log to MLflow
        mlflow.log_param("n_estimators", n_estimators)
        mlflow.log_param("max_depth", max_depth)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("mae", mae)
        mlflow.log_metric("r2", r2)
        
        mlflow.sklearn.log_model(pipeline, "model")
        
        # Also save a direct joblib file for the API to easily load
        os.makedirs("models", exist_ok=True)
        joblib_path = os.path.join("models", "rate_calculator_model.joblib")
        joblib.dump(pipeline, joblib_path)
        print(f"Model saved to {joblib_path}")

if __name__ == "__main__":
    train_model()
