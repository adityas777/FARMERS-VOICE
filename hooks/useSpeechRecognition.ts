
import { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '../services/api';

interface SpeechRecognitionHook {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: (lang: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentLangRef = useRef<string>('en-IN');
  const mimeTypeRef = useRef<string>('audio/webm');

  const getSupportedMimeType = () => {
    const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  const startListening = useCallback((lang: string = 'en-IN') => {
    if (isListening || isProcessing) return;
    
    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      setError("Your browser does not support audio recording.");
      return;
    }
    mimeTypeRef.current = mimeType;
    
    currentLangRef.current = lang;
    setTranscript('');
    setError(null);
    audioChunksRef.current = [];

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream, { 
          mimeType: mimeTypeRef.current,
          audioBitsPerSecond: 128000
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            try {
              const text = await transcribeAudio(base64Audio, mimeTypeRef.current, currentLangRef.current);
              setTranscript(text);
            } catch (err) {
              setError("Failed to transcribe audio. Please try again.");
            } finally {
              setIsProcessing(false);
              // Stop all tracks in the stream
              stream.getTracks().forEach(track => track.stop());
            }
          };
        };

        mediaRecorder.start();
        setIsListening(true);
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied or not available.");
      });
  }, [isListening, isProcessing]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isProcessing,
    transcript,
    error,
    isSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    startListening,
    stopListening,
    resetTranscript,
  };
};
