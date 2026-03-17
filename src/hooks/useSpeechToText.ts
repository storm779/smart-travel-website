import { useState, useRef, useCallback, useEffect } from "react";
import { isGeminiAvailable, getModel } from "../services/geminiApi";

interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  isProcessing: boolean;
}

export function useSpeechToText(
  onResult?: (text: string) => void
): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // MediaRecorder is supported in all modern browsers
  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    isGeminiAvailable();

  const processAudio = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert blob to base64
      const buffer = await audioBlob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const model = getModel();
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/webm",
            data: base64,
          },
        },
        "Transcribe this audio to text. Return ONLY the transcribed text, nothing else. If the audio is unclear or empty, return an empty string.",
      ]);

      const text = result.response.text().trim();
      if (text && text.length > 0) {
        setTranscript(text);
        onResultRef.current?.(text);
      }
    } catch (err) {
      console.error("Gemini audio transcription failed:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 0) {
          processAudio(audioBlob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to access microphone:", err);
      setIsListening(false);
    }
  }, [isSupported, processAudio]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    isProcessing,
  };
}
