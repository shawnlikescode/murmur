export type UtteranceStatus = 'idle' | 'playing' | 'paused';

export type TTSState = {
  preferredVoiceName: string | null
  rate: number
  
  voices: SpeechSynthesisVoice[]
  currentVoice: SpeechSynthesisVoice | null
  text: string
  status: UtteranceStatus
  progress: {
    percent: number
    position: number
    wordBoundaries: number[]
  }
}

export type TTSActions = {
  selectVoice: (voice: SpeechSynthesisVoice) => void
  selectVoiceByName: (name: string) => void
  
  adjustRate: (delta: number) => void
  resetRate: () => void
  
  startPlayback: () => void
  pausePlayback: () => void
  resumePlayback: () => void
  stopPlayback: () => void
  togglePlayback: () => void
  
  updateSelectedText: (text: string) => void
  
  loadVoices: (availableVoices: SpeechSynthesisVoice[]) => void
  
  trackProgress: (position: number, percent: number) => void
  trackWordBoundary: (position: number) => void
  completePlayback: () => void
}

export type VoiceGroup = {
  code: string
  name: string
  voices: SpeechSynthesisVoice[]
}

export type TTSControls = {
  toggleSpeech: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  
  setVoice: (voice: SpeechSynthesisVoice | null) => void
  adjustRate: (rate: number) => void
  increaseRate: () => void
  decreaseRate: () => void
  
  voicesByLanguage: VoiceGroup[]
}

export type TTSHookReturn = TTSState & TTSControls 