import { useEffect, useMemo } from "react"
import { TTSHookReturn } from "@/types/tts"
import { initializeSpeechSynthesis, sortVoicesByLanguage } from "@/lib/speech-utils"
import {
  useVoices,
  useCurrentVoice,
  usePreferredVoiceName,
  useSelectedText,
  useIsPlaying,
  useIsPaused,
  useProgress,
  useUtteranceStatus,
  useSpeechRate,
  useTTSActions
} from "@/stores/tts-store"
import { useSpeechVoices } from "./use-speech-voices"
import { useTextSelection } from "./use-text-selection"
import { useSpeechControl } from "./use-speech-control"
import { useVoicePreferences } from "./use-voice-preferences"

export function useTTS(): TTSHookReturn {
  const voices = useVoices()
  const currentVoice = useCurrentVoice()
  const preferredVoiceName = usePreferredVoiceName()
  const text = useSelectedText()
  const status = useUtteranceStatus()
  const isPlaying = useIsPlaying()
  const isPaused = useIsPaused()
  const progress = useProgress()
  const rate = useSpeechRate()
  
  const {
    selectVoice,
    adjustRate,
    startPlayback,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    trackProgress,
    completePlayback
  } = useTTSActions()
  
  const synthesis = useMemo(() => initializeSpeechSynthesis(), [])
  
  const { findVoiceByName } = useSpeechVoices(synthesis)
  
  useTextSelection()
  
  useEffect(() => {
    return () => {
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, [synthesis]);
  
  const voicesByLanguage = useMemo(() => 
    sortVoicesByLanguage(voices), [voices]);
  
  const { 
    speak,
    toggleSpeech, 
    stop, 
    pauseSpeech, 
    resumeSpeech,
    lastPositionRef
  } = useSpeechControl({
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
  });
  
  const {
    setVoice,
    increaseRate,
    decreaseRate
  } = useVoicePreferences({
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
  });
  
  return {
    voices,
    currentVoice,
    preferredVoiceName,
    text,
    status,
    isPlaying,
    isPaused,
    progress,
    rate,
    voicesByLanguage,
    toggleSpeech,
    stop,
    pause: pauseSpeech,
    resume: resumeSpeech,
    setVoice,
    adjustRate,
    increaseRate,
    decreaseRate,
  } as TTSHookReturn;
} 