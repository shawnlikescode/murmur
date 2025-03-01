import { useCallback, useRef } from "react"
import { findWordBoundary, createUtterance as createUtteranceUtil } from "@/lib/speech-utils"
import { UtteranceStatus } from "@/types/tts"

type SpeechControlHookProps = {
  synthesis: SpeechSynthesis | null;
  preferredVoiceName: string | null;
  findVoiceByName: (name: string) => SpeechSynthesisVoice | null;
  rate: number;
  text: string;
  status: UtteranceStatus;
  progress: { position: number };
  startPlayback: () => void;
  pausePlayback: () => void;
  resumePlayback: () => void;
  stopPlayback: () => void;
  trackProgress: (position: number, percentage: number) => void;
  completePlayback: () => void;
}

export function useSpeechControl({
  synthesis,
  preferredVoiceName,
  findVoiceByName,
  rate,
  text,
  status,
  progress,
  startPlayback,
  pausePlayback,
  resumePlayback,
  stopPlayback,
  trackProgress,
  completePlayback
}: SpeechControlHookProps) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastPositionRef = useRef<number>(0);
  
  const speak = useCallback((textToSpeak: string, startPosition = 0) => {
    if (!synthesis || !textToSpeak) return;
    
    synthesis.cancel();
    lastPositionRef.current = startPosition;
    
    if (startPosition <= 0) {
      startPlayback();
    } else {
      resumePlayback();
    }
    
    const textToUtter = startPosition > 0 
      ? textToSpeak.substring(startPosition) 
      : textToSpeak;
    
    const selectedVoice = preferredVoiceName 
      ? findVoiceByName(preferredVoiceName)
      : null;
    
    const utterance = createUtteranceUtil(textToUtter, selectedVoice, rate);
    utteranceRef.current = utterance;
    
    let lastCharIndex = 0;
    let wordBoundaryReceived = false;
    
    const updatePosition = (charIndex: number) => {
      const position = startPosition + charIndex;
      lastPositionRef.current = position;
      const percentage = (position / textToSpeak.length) * 100;
      trackProgress(position, percentage);
      return position;
    };
    
    const progressTimerId = setInterval(() => {
      if (!textToSpeak) {
        clearInterval(progressTimerId);
        return;
      }
      
      if (!wordBoundaryReceived && lastPositionRef.current === startPosition) {
        lastCharIndex += 2;
        
        if (startPosition + lastCharIndex >= textToSpeak.length) {
          clearInterval(progressTimerId);
          return;
        }
        
        updatePosition(lastCharIndex);
      }
    }, 100);
    
    utterance.onboundary = (e) => {
      if (e.name === 'word' && e.charIndex !== undefined) {
        wordBoundaryReceived = true;
        lastCharIndex = e.charIndex;
        updatePosition(e.charIndex);
      }
    };
    
    const cleanup = () => {
      clearInterval(progressTimerId);
    };
    
    utterance.onend = () => {
      cleanup();
      completePlayback();
    };
    
    utterance.onerror = (event) => {
      cleanup();
      
      if (event.error === 'interrupted') {
        return;
      }
      
      completePlayback();
    };
    
    synthesis.speak(utterance);
  }, [
    synthesis, 
    startPlayback, 
    resumePlayback, 
    preferredVoiceName, 
    findVoiceByName, 
    rate, 
    trackProgress,
    completePlayback
  ]);
  
  const toggleSpeech = useCallback(() => {
    if (!text || !synthesis) return;
    
    if (status === 'playing') {
      synthesis.cancel();
      const position = lastPositionRef.current;
      
      trackProgress(position, (position / text.length) * 100);
      pausePlayback();
    } else if (status === 'paused') {
      const currentPos = progress.position;
      const resumePosition = findWordBoundary(text, currentPos);
      
      speak(text, resumePosition);
    } else {
      speak(text, 0);
    }
  }, [text, synthesis, status, progress.position, speak, pausePlayback, trackProgress]);
  
  const stop = useCallback(() => {
    if (synthesis) {
      synthesis.cancel();
    }
    stopPlayback();
  }, [synthesis, stopPlayback]);
  
  const pauseSpeech = useCallback(() => {
    if (synthesis) {
      synthesis.cancel();
    }
    pausePlayback();
  }, [synthesis, pausePlayback]);
  
  const resumeSpeech = useCallback(() => {
    if (!text || !synthesis) return;
    const currentPos = progress.position;
    const resumePosition = findWordBoundary(text, currentPos);
    speak(text, resumePosition);
  }, [text, synthesis, progress.position, speak]);
  
  return {
    speak,
    toggleSpeech,
    stop,
    pauseSpeech,
    resumeSpeech,
    lastPositionRef
  };
} 