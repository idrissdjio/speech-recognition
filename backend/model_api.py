from fastapi import FastAPI, File, UploadFile, HTTPException
import numpy as np
from tensorflow.keras.models import load_model
import librosa
import pandas as pd
from data_processing import get_features
import tempfile
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000", "https://speech-recognition-dusky.vercel.app", "https://speech-recognition-dusky.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

model = load_model('./saved_checkpoint.h5')
class_names = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad']

def prepare_audio_file(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
        tmp_file_name = tmp_file.name
        tmp_file.write(file.file.read())
    return tmp_file_name

def process_audio(file_path):
    audio_features = get_features(file_path)
    require_size = 2376
    # audio_np = np.array(my_audio)
    if audio_features.size < require_size:
        audio_features = np.pad(audio_features, (0, require_size - audio_features.size), 'constant', constant_values=(0))
    return audio_features.reshape(1, require_size, 1)

@app.post("/predict/")
async def create_upload_file(file: UploadFile):
    try:
        file_path = prepare_audio_file(file)
        processed_audio = process_audio(file_path)
        prediction = model.predict(processed_audio)
        predicted_class_name = class_names[np.argmax(prediction, axis=1)[0]]
        return f'The model predicted: {predicted_class_name}'
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path:
            os.remove(file_path)
        
    