import subprocess
import time
import os

def run_cmd(cmd, cwd=None, wait=False):
    print(f"Running: {' '.join(cmd)}")
    if wait:
        result = subprocess.run(cmd, cwd=cwd, shell=True)
        if result.returncode != 0:
            print(f"Command failed: {' '.join(cmd)}")
            exit(1)
    else:
        # Popen without waiting
        return subprocess.Popen(cmd, cwd=cwd, shell=True)

def main():
    print("Starting MLOps Courier Rate Pipeline")
    
    # Check if models exist, if not, we should train
    model_path = os.path.join("models", "rate_calculator_model.joblib")
    if not os.path.exists(model_path):
        print("Model not found. Running training pipeline...")
        run_cmd(["py", "ml_pipeline\\train.py"], wait=True)
    else:
        print("Model already exists. Skipping training.")

    print("Starting FastAPI Backend...")
    api_proc = run_cmd(["py", "-m", "uvicorn", "api.main:app", "--reload", "--port", "8000"], wait=False)
    
    # Wait for API to start
    time.sleep(3)
    
    print("Starting React Frontend (Vite)...")
    app_proc = run_cmd(["npm", "run", "dev", "--", "--port", "5173"], cwd="web_app", wait=False)
    
    try:
        print("Services running. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping services...")
        api_proc.terminate()
        app_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
