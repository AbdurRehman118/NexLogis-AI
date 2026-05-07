from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Courier Rate Calculator API", description="AI powered MLOps backend for rate prediction")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow any origin for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model globally
model_path = os.path.join(os.path.dirname(__file__), "..", "models", "rate_calculator_model.joblib")
try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

class RateRequest(BaseModel):
    courier: str
    service_category: str
    destination_region: str
    weight_kg: float
    insured_value_rs: float

@app.get("/")
def read_root():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/calculate_rate")
def calculate_rate(request: RateRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
        
    try:
        # Create DataFrame from request
        data = {
            "Courier": [request.courier],
            "Service_Category": [request.service_category],
            "Destination_Region": [request.destination_region],
            "Weight_kg": [request.weight_kg],
            "Insured_Value_Rs": [request.insured_value_rs]
        }
        df = pd.DataFrame(data)
        
        # Predict using pipeline (handles preprocessing internally)
        prediction = model.predict(df)[0]
        
        return {
            "predicted_rate_rs": round(prediction, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
