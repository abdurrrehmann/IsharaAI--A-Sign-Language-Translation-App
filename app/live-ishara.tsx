import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

export default function LiveIshara() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Gemini loading state
  const [detectionResult, setDetectionResult] = useState("Ready to scan.");
  
  // NAYI STATES
  const [detectedWords, setDetectedWords] = useState<string[]>([]); // Array of words
  const [finalSentence, setFinalSentence] = useState(""); // Gemini generated sentence

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleToggleCamera = async () => {
    if (hasPermission === false) return;
    setCameraOpen((v) => !v);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Clear sub kuch
  const handleClearAll = () => {
    setDetectedWords([]);
    setFinalSentence("");
    setDetectionResult("Cleared.");
  };

  // 1. Detect single word
  const handleDetectFromCamera = async () => {
    if (!cameraRef.current) return;
    
    setIsDetecting(true);
    setDetectionResult("Taking picture...");
    
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
      if (!photo) throw new Error("No photo");

      setDetectionResult("Detecting sign...");
      const formData = new FormData();
      formData.append('file', { uri: photo.uri, name: 'sign.jpg', type: 'image/jpeg' } as any);

      const response = await fetch('https://isharaai-a-sign-language-translation-app.onrender.com/predict', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();
      
      if (data.prediction) {
        setDetectionResult(`Detected: ${data.prediction}`);
        setDetectedWords((prev) => [...prev, data.prediction]); // Array mein word add kiya
      } else {
        setDetectionResult("Could not detect sign.");
      }
    } catch (err) {
      setDetectionResult("Network Error.");
    } finally {
      setIsDetecting(false);
    }
  };

  // 2. Generate Final Sentence from Gemini
  const handleGenerateSentence = async () => {
    if (detectedWords.length === 0) {
        setDetectionResult("No words to process.");
        return;
    }
    
    setIsGenerating(true);
    setDetectionResult("Gemini is composing sentence...");
    
    try {
      const response = await fetch('https://isharaai-a-sign-language-translation-app.onrender.com/generate_sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ words: detectedWords }) // Send array of words
      });

      const data = await response.json();
      if (data.sentence) {
        setFinalSentence(data.sentence);
        setDetectionResult("Sentence Generated!");
      }
    } catch (err) {
      console.error(err);
      setDetectionResult("Failed to generate sentence.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>IsharaAI</Text>

      {cameraOpen ? (
        <View style={styles.cameraPlaceholder}>
          <CameraView style={styles.camera} ref={cameraRef} ratio="4:3" facing={facing} />
        </View>
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraText}>Camera is Closed</Text>
        </View>
      )}

      <View style={styles.statusContainer}>
        {(isDetecting || isGenerating) && <ActivityIndicator size="small" color="#FFB400" style={{ marginRight: 8 }} />}
        <Text style={styles.statusText}>{detectionResult}</Text>
      </View>

      <TouchableOpacity style={styles.recordBtn} onPress={handleToggleCamera}>
        <Text style={styles.recordText}>{cameraOpen ? "Close Camera" : "Open Camera"}</Text>
      </TouchableOpacity>

      {cameraOpen && (
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.switchBtn} onPress={toggleCameraFacing}>
            <Text style={styles.switchText}>🔄 Switch</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.loadBtn, isDetecting && styles.disabledBtn]} 
            onPress={handleDetectFromCamera} disabled={isDetecting}
          >
            <Text style={styles.loadText}>Detect Sign</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- SENTENCE BUILDER UI --- */}
      <View style={styles.sentenceContainer}>
        
        {/* Raw Words Stream */}
        <Text style={styles.sentenceTitle}>Detected Words:</Text>
        <ScrollView style={styles.wordsBox} horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.wordsText}>
            {detectedWords.length > 0 ? detectedWords.join("  →  ") : "No words yet..."}
          </Text>
        </ScrollView>

        {/* Generate Button */}
        <TouchableOpacity 
          style={[styles.generateBtn, (detectedWords.length === 0 || isGenerating) && styles.disabledBtn]} 
          onPress={handleGenerateSentence}
          disabled={detectedWords.length === 0 || isGenerating}
        >
          <Text style={styles.generateText}>✨ Generate Sentence</Text>
        </TouchableOpacity>

        {/* Final Sentence Result */}
        <Text style={styles.sentenceTitle}>Final Translation:</Text>
        <View style={styles.sentenceBox}>
          <Text style={styles.sentenceText}>
            {finalSentence ? finalSentence : "Final translated sentence will appear here..."}
          </Text>
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
          <Text style={styles.clearBtnText}>🗑️ Clear All</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "800", color: "#001F3F", marginBottom: 12, textAlign: "center" },
  cameraPlaceholder: { height: 260, backgroundColor: "#333", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 12, overflow: "hidden" },
  camera: { width: "100%", height: "100%" },
  cameraText: { color: "#fff", fontWeight: "600" },
  statusContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  statusText: { textAlign: "center", fontWeight: "600", fontSize: 14, color: "#28a745" },
  
  controlsRow: { flexDirection: "row", justifyContent: "space-evenly", marginBottom: 10 },
  switchBtn: { backgroundColor: "#e0e0e0", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, alignItems: "center" },
  switchText: { fontWeight: "700", color: "#333", fontSize: 14 },
  loadBtn: { backgroundColor: "#001F3F", paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30, alignItems: "center" },
  loadText: { fontWeight: "700", color: "#fff" },
  recordBtn: { alignSelf: "center", backgroundColor: "#FFB400", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, marginBottom: 10, width: 200, alignItems: "center" },
  recordText: { fontWeight: "700", color: "#001F3F" },
  disabledBtn: { opacity: 0.5 },
  
  sentenceContainer: { flex: 1, padding: 12, backgroundColor: "#f0f4f8", borderRadius: 12, borderWidth: 1, borderColor: "#d1d9e6" },
  sentenceTitle: { fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 4, marginTop: 4 },
  
  wordsBox: { backgroundColor: "#e9ecef", borderRadius: 8, padding: 10, minHeight: 40, maxHeight: 45, marginBottom: 10 },
  wordsText: { fontSize: 15, color: "#555", fontStyle: "italic" },
  
  generateBtn: { backgroundColor: "#28a745", paddingVertical: 10, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  generateText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  
  sentenceBox: { flex: 1, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#28a745" },
  sentenceText: { fontSize: 18, color: "#001F3F", fontWeight: "bold", textAlign: "center" },
  
  clearBtn: { backgroundColor: "#ff4d4d", paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  clearBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 }
});