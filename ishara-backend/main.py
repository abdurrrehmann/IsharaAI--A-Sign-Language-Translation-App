from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import torch
import numpy as np
import json
import cv2
from typing import List

from model_utils import HybridSignRecognitionModel, HandsOnlyFeatureExtractor, normalize_frame_hands_only
from urdu_sentence_generator import UrduSentenceGenerator # Naya import

app = FastAPI()

# 1. Model Setup
device = torch.device("cpu")
model = None
labels = []
generator = None # Gemini Generator global variable

def load_model_once():
    global model, labels, generator
    with open("labels.json", 'r', encoding='utf-8') as f:
        labels = json.load(f)['labels']
    
    checkpoint = torch.load("best_model.pth", map_location=device)
    model = HybridSignRecognitionModel(input_size=126, num_classes=len(labels))
    model.load_state_dict(checkpoint['model_state_dict'], strict=False)
    model.eval()
    
    # Initialize Generator
    generator = UrduSentenceGenerator()

load_model_once()
extractor = HandsOnlyFeatureExtractor()

# Request model for sentence generation
class WordList(BaseModel):
    words: List[str]

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    features, _, _ = extractor.extract(img)
    norm_feat = normalize_frame_hands_only(features)
    
    x = torch.from_numpy(norm_feat).unsqueeze(0).unsqueeze(0) 
    with torch.no_grad():
        logits = model(x, torch.LongTensor([1])) 
        pred = int(torch.argmax(logits, dim=1))
        
    return {"prediction": labels[pred]}

# --- NAYA ENDPOINT: Sentence Generator ---
@app.post("/generate_sentence")
async def generate_sentence(data: WordList):
    # Gemini API ko list of words bhej kar sentence lena
    sentence = generator.make_sentence(data.words)
    return {"sentence": sentence}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)