FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

RUN apt-get update && \
    apt-get install -y libsndfile1 && \
    rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80

ENV NAME World

CMD ["uvicorn", "model_api:app", "--host", "0.0.0.0", "--port", "80"]