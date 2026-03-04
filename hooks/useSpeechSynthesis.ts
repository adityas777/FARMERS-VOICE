import { useState, useEffect, useCallback } from 'react';

interface SpeakOptions {
  text: string;
  lang?: string;
  onEnd?: () => void;
}

interface SpeechSynthesisHook {
  isSupported: boolean;
  isSpeaking: boolean;
  isReady: boolean;
  speak: (options: SpeakOptions) => void;
  cancel: () => void;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const handleVoicesChanged = () => {
        setIsReady(true);
        // Remove the event listener once voices are loaded.
        window.speechSynthesis.onvoiceschanged = null;
      };
      
      // Check if voices are already loaded.
      if (window.speechSynthesis.getVoices().length > 0) {
        setIsReady(true);
      } else {
        // If not, set up an event listener.
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      }
    }
    // Cleanup function to cancel any ongoing speech when the component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(({ text, lang = 'en-US', onEnd }: SpeakOptions) => {
    if (!isSupported || isSpeaking || !isReady) return;

    // Cancel any previous utterances before speaking a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) {
        onEnd();
      }
    };
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis Error', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, isSpeaking, isReady]);

  const cancel = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return { isSupported, isSpeaking, isReady, speak, cancel };
};