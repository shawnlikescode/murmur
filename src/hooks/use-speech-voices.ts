import { useEffect, useCallback } from "react"
import { 
  findVoiceByName as findVoiceByNameUtil,
  updateGlobalVoices
} from "@/lib/speech-utils"
import { useTTSActions } from "@/stores/tts-store"

export function useSpeechVoices(synthesis: SpeechSynthesis | null) {
  const { loadVoices } = useTTSActions();
  
  useEffect(() => {
    if (!synthesis) return;
    
    const handleVoicesLoaded = () => {
      if (!synthesis) return;
      
      try {
        const availableVoices = synthesis.getVoices() || [];
        if (availableVoices.length > 0) {
          updateGlobalVoices(availableVoices);
          loadVoices(availableVoices);
        }
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    };
    
    handleVoicesLoaded();
    synthesis.addEventListener('voiceschanged', handleVoicesLoaded);
    
    return () => {
      synthesis.removeEventListener('voiceschanged', handleVoicesLoaded);
    };
  }, [synthesis, loadVoices]);
  
  const findVoiceByName = useCallback((name: string): SpeechSynthesisVoice | null => {
    return findVoiceByNameUtil(name, synthesis);
  }, [synthesis]);
  
  return { findVoiceByName };
} 