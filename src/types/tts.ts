export interface TTSState {
  text: string
  isPlaying: boolean
  rate: number
  progress: number
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
}

export interface TTSControls {
  toggleSpeech: () => void
  stop: () => void
  setVoice: (voice: SpeechSynthesisVoice | null) => void
  setRate: (rate: number) => void
  cycleRate: () => void
}

export type TTSHookReturn = TTSState & TTSControls 