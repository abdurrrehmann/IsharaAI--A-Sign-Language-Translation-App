import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { loadTensorflowModel } from 'react-native-fast-tflite';

export default function LiveIshara() {
  const [modelStatus, setModelStatus] = useState("Model Not Loaded");
  const [isLoading, setIsLoading] = useState(false);
  
  // FIX 1: Explicitly type the state variables
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [tfliteInstance, setTfliteInstance] = useState<any>(null);
  
  const [detectionResult, setDetectionResult] = useState("Translation output placeholder");

  const handleLoadModel = async () => {
    setIsLoading(true);
    setModelStatus("Loading native model...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // FIX 2: Tell ESLint that require() is necessary for React Native assets here
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      // To this:
const coreModel = await loadTensorflowModel(require('../assets/model/sign_model.tflite'), ['default']);
      
      setTfliteInstance(coreModel);
      setModelStatus("AI Ready to Detect");
      setDetectionResult("Ready to scan.");

    } catch (error) {
      console.error("Error loading native model:", error);
      setModelStatus("Failed to load model");
    } finally {
      setIsLoading(false);
    }
  };

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
    
    // FIX 3: Temporarily using the variable to silence the ESLint warning 
    // until we switch to VisionCamera
    if (tfliteInstance) {
        console.log("Model is ready for VisionCamera frames!");
    }
    
    setDetectionResult("Taking picture...");
    
    try {
      setDetectionResult("Warning: .tflite models need VisionCamera to process JPEGs.");
    } catch (err) {
      console.error(err);
      setDetectionResult("Detection failed");
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
        {isLoading && <ActivityIndicator size="small" color="#FFB400" style={{ marginRight: 8 }} />}
        <Text
          style={[
            styles.statusText,
            modelStatus === "AI Ready to Detect" ? styles.statusReady : styles.statusPending,
          ]}
        >
          {modelStatus}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.loadBtn, isLoading && styles.disabledBtn]}
        onPress={handleLoadModel}
        disabled={isLoading || modelStatus === "AI Ready to Detect"}
      >
        <Text style={styles.loadText}>
          {modelStatus === "AI Ready to Detect" ? "Model Loaded" : "Load Model"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recordBtn} onPress={handleToggleCamera}>
        <Text style={styles.recordText}>
          {cameraOpen ? "Close Camera" : "Open Camera"}
        </Text>
      </TouchableOpacity>

      {cameraOpen && (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <TouchableOpacity style={[styles.loadBtn]} onPress={handleDetectFromCamera}>
            <Text style={styles.loadText}>Detect</Text>
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
  statusPending: { color: "#dc3545" },
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
  translationText: { color: "#444", textAlign: "center" },
});