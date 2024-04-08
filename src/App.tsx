import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);  // State for file error message

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);  // Reset file error state
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 5242880) {  // Check if file is larger than 1MB
        setFileError('File size should be less than 5MB');
        return;
      }
      if (!file.type.includes('audio/')) {  // Check if file is an audio type
        setFileError('Only audio files are allowed');
        return;
      }
      else{
        setAudioFile(file);
      }
      setPredictionResult(null);  // Reset prediction result on new file selection
    }
  };

  const predictEmotion = async () => {
    if (audioFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', audioFile);

      try {
        const response = await fetch('http://18.232.116.252/predict/', {
          method: 'POST',
          body: formData,
        });

        const resultText = await response.text();
        setPredictionResult(resultText);
      } catch (error) {
        console.error('Error during prediction:', error);
        setPredictionResult('Error processing the audio file.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Ajayla</h1>
        <h1>Test my speech recognition model here</h1>
        <input type="file" onChange={handleFileChange} accept="audio/*" />
        <button onClick={predictEmotion} disabled={!audioFile || isLoading}>
          {isLoading ? 'Predicting...' : 'Predict Emotion'}
        </button>
        {fileError && <div className="file-error">{fileError}</div>}
        {predictionResult && <div className="prediction-result">{predictionResult}</div>}
      </header>
    </div>
  );
}

export default App;
