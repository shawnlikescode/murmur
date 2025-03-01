import { useCallback } from "react"
import { findWordBoundary } from "@/lib/speech-utils"
import { UtteranceStatus } from "@/types/tts"

type VoicePreferencesHookProps = {
  synthesis: SpeechSynthesis | null;
  status: UtteranceStatus;
  text: string | null;
  rate: number;
  selectVoice: (voice: SpeechSynthesisVoice) => void;
  adjustRate: (delta: number) => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  speak: (text: string, position: number) => void;
  lastPositionRef: React.RefObject<number>;
}

export function useVoicePreferences({
  synthesis,
  status,
  text,
  rate,
  selectVoice,
  adjustRate,
  pausePlayback,
  stopPlayback,
  speak,
  lastPositionRef
}: VoicePreferencesHookProps) {
  
  const increaseRate = useCallback(() => {
    adjustRate(0.1);
  }, [adjustRate]);
  
  const decreaseRate = useCallback(() => {
    adjustRate(-0.1);
  }, [adjustRate]);
  
  const setVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    if (!voice) return;
    
    const wasPlaying = status === 'playing';
    const currentPosition = lastPositionRef.current;
    
    if (synthesis) {
      synthesis.cancel();
    }
    
    selectVoice(voice);
    
    if (wasPlaying && text) {
      setTimeout(() => {
        const resumePosition = findWordBoundary(text, currentPosition);
        speak(text, resumePosition);
      }, 50);
    } else if (status === 'paused') {
      pausePlayback();
    } else {
      stopPlayback();
    }
  }, [synthesis, text, status, selectVoice, pausePlayback, stopPlayback, speak, lastPositionRef]);
  
  return {
    setVoice,
    increaseRate,
    decreaseRate
  };
} 