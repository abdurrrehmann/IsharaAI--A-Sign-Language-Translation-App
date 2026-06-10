import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LiveIshara() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState("Ready to scan.");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleToggleCamera = async () => {
    if (hasPermission === false) {
      setDetectionResult("Camera permission denied");
      return;
    }
    setCameraOpen((v) => !v);
  };

  const handleDetectFromCamera = async () => {
    if (!cameraRef.current) return;
    
    setIsDetecting(true);
    setDetectionResult("Taking picture...");
    
    try {
      // 1. Photo Capture
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
      if (!photo) {
        setDetectionResult("Failed to capture photo.");
        setIsDetecting(false);
        return;
      }

      setDetectionResult("Sending to AI Server...");

      // 2. Prepare Form Data
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: 'sign_frame.jpg',
        type: 'image/jpeg',
      } as any);

      // 3. FastAPI Server IP (Laptop's IPv4)
      const SERVER_URL = 'http://192.168.100.18:8000/predict'; 

      // 4. API Request
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      
      // 5. Update UI with Prediction
      if (data.prediction) {
        setDetectionResult(`Detected: ${data.prediction}`);
      } else {
        setDetectionResult("Could not detect sign.");
      }

    } catch (err) {
      console.error("Server Connection Error:", err);
      setDetectionResult("Network Error: Ensure Server is running & IP is correct");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SignDetectrrr</Text>

      {cameraOpen ? (
        <View style={styles.cameraPlaceholder}>
          <CameraView style={styles.camera} ref={cameraRef} ratio="4:3" />
        </View>
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraText}>Camera Feed Placeholder</Text>
        </View>
      )}

      <View style={styles.statusContainer}>
        {isDetecting && <ActivityIndicator size="small" color="#FFB400" style={{ marginRight: 8 }} />}
        <Text
          style={[
            styles.statusText,
            isDetecting ? styles.statusPending : styles.statusReady,
          ]}
        >
          {isDetecting ? "Processing Frame..." : "AI Server Ready"}
        </Text>
      </View>

      <TouchableOpacity style={styles.recordBtn} onPress={handleToggleCamera}>
        <Text style={styles.recordText}>
          {cameraOpen ? "Close Camera" : "Open Camera"}
        </Text>
      </TouchableOpacity>

      {cameraOpen && (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <TouchableOpacity 
            style={[styles.loadBtn, isDetecting && styles.disabledBtn]} 
            onPress={handleDetectFromCamera}
            disabled={isDetecting}
          >
            <Text style={styles.loadText}>Detect Sign</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.translationBubble}>
        <Text style={styles.translationText}>{detectionResult}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#001F3F", 
    marginBottom: 16 
  },
  cameraPlaceholder: { 
    height: 300, 
    backgroundColor: "#333", 
    borderRadius: 12, 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 16, 
    overflow: "hidden" 
  },
  camera: { width: "100%", height: "100%" },
  cameraText: { color: "#fff" },
  statusContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 16 
  },
  statusText: { textAlign: "center", fontWeight: "600", fontSize: 16 },
  statusReady: { color: "#28a745" },
  statusPending: { color: "#FFB400" },
  loadBtn: { 
    alignSelf: "center", 
    backgroundColor: "#001F3F", 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 30, 
    marginBottom: 12, 
    width: 200, 
    alignItems: "center" 
  },
  loadText: { fontWeight: "700", color: "#fff" },
  recordBtn: { 
    alignSelf: "center", 
    backgroundColor: "#FFB400", 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 30, 
    marginBottom: 16, 
    width: 200, 
    alignItems: "center" 
  },
  recordText: { fontWeight: "700", color: "#001F3F" },
  disabledBtn: { opacity: 0.6 },
  translationBubble: { 
    minHeight: 48, 
    borderRadius: 12, 
    backgroundColor: "#f7f7f7", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 10 
  },
  translationText: { color: "#444", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});