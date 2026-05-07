# NexLogis AI | Industrial Logistics Optimization

A high-fidelity logistics rate aggregator and asset tracking platform powered by an MLOps pipeline.

## System Components

- **Backend**: FastAPI server for ML inference and data management.
- **Frontend**: React (Vite) + TypeScript with a premium "Greyish Blue" aesthetic.
- **MLOps**: Scikit-learn models tracked via MLflow.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

## How to Run

### 1. Start the Backend API
The backend handles the predictive logic for courier rates.
```bash
# From the project root
pip install -r requirements.txt
py -m uvicorn api.main:app --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Start the Frontend
The frontend provides the interactive dashboard for rates and tracking.
```bash
# Navigate to the web_app directory
cd web_app
npm install
npm run dev
```
The site will be available at `http://localhost:5173`.

### 3. Run the ML Pipeline (Optional)
To retrain the model or regenerate mock data:
```bash
# From the project root
python run_pipeline.py
```

## Features
- **Rate Prediction**: Real-time neural inference for shipment costs.
- **Asset Telemetry**: Visualized shipment tracking through the logistics grid.
- **Theme Support**: Seamless Dark/Light mode switching (Light by default).
- **Responsive Design**: Fully optimized for mobile and desktop viewports.
