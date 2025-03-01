import { INITIAL_TTS_STATE } from "@/constants/tts"
import { TTSActions, TTSState } from "@/types/tts"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// -------------------------------------------------------------------------------
// Store Types
// -------------------------------------------------------------------------------

interface TTSStore extends TTSState {
  actions: TTSActions
}

// -------------------------------------------------------------------------------
// Store Implementation
// -------------------------------------------------------------------------------

const useTTSStore = create<TTSStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_TTS_STATE,
      actions: {
        selectVoice: (voice) => {
          if (!voice) return
          
          set({
            preferredVoiceName: voice.name,
            currentVoice: voice
          })
        },
        
        selectVoiceByName: (name) => {
          if (!name) return
          
          const voice = get().voices.find(v => v.name === name)
          
          if (voice) {
            set({
              preferredVoiceName: name,
              currentVoice: voice
            })
          } else {
            set({ preferredVoiceName: name })
          }
        },
        
        adjustRate: (delta) => {
          const currentRate = get().rate
          const newRate = Math.max(0.5, Math.min(2.0, currentRate + delta))
          set({ rate: Number(newRate.toFixed(1)) })
        },
        
        resetRate: () => set({ rate: 1.0 }),
        
        startPlayback: () => {
          const { text } = get()
          if (text.trim() === "") return
          
          set({ 
            status: "playing",
            progress: {
              percent: 0,
              position: 0,
              wordBoundaries: []
            }
          })
        },
        
        pausePlayback: () => {
          set({ status: "paused" })
        },
        
        resumePlayback: () => {
          const { text } = get()
          if (text.trim() === "") return
          
          set({ status: "playing" })
        },
        
        stopPlayback: () => {
          set({ 
            status: "idle",
            progress: {
              percent: 0,
              position: 0,
              wordBoundaries: []
            }
          })
        },
        
        togglePlayback: () => {
          const { text, status } = get()
          if (text.trim() === "") return
          
          if (status === "playing") {
            set({ status: "paused" })
          } else if (status === "paused") {
            set({ status: "playing" })
          } else {
            set({ 
              status: "playing",
              progress: {
                percent: 0,
                position: 0,
                wordBoundaries: []
              }
            })
          }
        },
        
        updateSelectedText: (text) => {
          set({ 
            text,
            status: "idle",
            progress: {
              percent: 0,
              position: 0,
              wordBoundaries: []
            }
          })
        },
        
        loadVoices: (availableVoices) => {
          set({ voices: availableVoices })
          
          const { preferredVoiceName, currentVoice } = get()
          if (!preferredVoiceName && availableVoices.length > 0) {
            const defaultVoice = availableVoices[0]
            set({
              preferredVoiceName: defaultVoice.name,
              currentVoice: defaultVoice
            })
          } else if (preferredVoiceName && !currentVoice) {
            const matchingVoice = availableVoices.find(
              voice => voice.name === preferredVoiceName
            )
            
            if (matchingVoice) {
              set({ currentVoice: matchingVoice })
            }
          }
        },
        
        trackProgress: (position, percent) => {
          const currentProgress = get().progress
          set({ 
            progress: {
              ...currentProgress,
              position,
              percent
            }
          })
        },
        
        trackWordBoundary: (position) => {
          const currentProgress = get().progress
          if (!currentProgress.wordBoundaries.includes(position)) {
            set({
              progress: {
                ...currentProgress,
                wordBoundaries: [...currentProgress.wordBoundaries, position].sort((a, b) => a - b)
              }
            })
          }
        },
        
        completePlayback: () => {
          set({ 
            status: "idle",
            progress: {
              ...get().progress,
              percent: 100
            }
          })
        }
      }
    }),
    {
      name: "tts-preferences",
      partialize: (state) => ({ 
        preferredVoiceName: state.preferredVoiceName,
        rate: state.rate
      })
    }
  )
)

// -------------------------------------------------------------------------------
// Selectors
// -------------------------------------------------------------------------------

export const useVoices = () => useTTSStore(state => state.voices)
export const useCurrentVoice = () => useTTSStore(state => state.currentVoice)
export const usePreferredVoiceName = () => useTTSStore(state => state.preferredVoiceName)
export const useSelectedText = () => useTTSStore(state => state.text)
export const useUtteranceStatus = () => useTTSStore(state => state.status)
export const useIsPlaying = () => useTTSStore(state => state.status === "playing")
export const useIsPaused = () => useTTSStore(state => state.status === "paused")
export const useProgress = () => useTTSStore(state => state.progress)
export const useSpeechRate = () => useTTSStore(state => state.rate)

export const useTTSActions = () => useTTSStore(state => state.actions) 