# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000 
ENV HOST=0.0.0.0

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the api directory contents into the container at /app/api
COPY api/ /app/api/

# Expose the port the app runs on
EXPOSE ${PORT}

# Run the application using shell form to expand environment variables
CMD uvicorn api.main:app --host $HOST --port $PORT
