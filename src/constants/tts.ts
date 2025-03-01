import { TTSState } from "@/types/tts"

export const RATE_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

export const INITIAL_TTS_STATE: TTSState = {
  // Persistent preferences
  preferredVoiceName: null,
  rate: 1,
  
  // Transient state
  voices: [],
  currentVoice: null,
  text: "",
  status: "idle",
  progress: {
    percent: 0,
    position: 0,
    wordBoundaries: []
  }
} 