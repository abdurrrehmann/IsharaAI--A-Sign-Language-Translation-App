from fastapi import FastAPI, UploadFile, File
import torch
import numpy as np
import json
import cv2
from model_utils import HybridSignRecognitionModel, HandsOnlyFeatureExtractor, normalize_frame_hands_only

app = FastAPI()

# 1. Model Setup (Global variables)
device = torch.device("cpu")
model = None
labels = []

# Load model ek baar start hone par
def load_model_once():
    global model, labels
    with open("labels.json", 'r', encoding='utf-8') as f:
        labels = json.load(f)['labels']
    
    checkpoint = torch.load("best_model.pth", map_location=device)
    model = HybridSignRecognitionModel(input_size=126, num_classes=len(labels))
    model.load_state_dict(checkpoint['model_state_dict'], strict=False)
    model.eval()

load_model_once()
extractor = HandsOnlyFeatureExtractor()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 2. Image Decode
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 3. Inference Logic
    features, _, _ = extractor.extract(img)
    norm_feat = normalize_frame_hands_only(features)
    
    # Simple inference (Aap buffer logic yahan add karenge)
    x = torch.from_numpy(norm_feat).unsqueeze(0).unsqueeze(0) # [1, 1, 126]
    with torch.no_grad():
        logits = model(x, torch.LongTensor([1])) # Dummy length
        pred = int(torch.argmax(logits, dim=1))
        
    return {"prediction": labels[pred]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)