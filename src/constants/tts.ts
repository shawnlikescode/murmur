import { TTSState } from "@/types/tts"

export const RATE_PRESETS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const

export const INITIAL_TTS_STATE: TTSState = {
  text: "",
  isPlaying: false,
  rate: 1,
  progress: 0,
  voices: [],
  selectedVoice: null,
} as const 