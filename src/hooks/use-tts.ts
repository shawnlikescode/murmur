import { useState, useRef, useEffect } from "react"
import { TTSState, TTSHookReturn } from "@/types/tts"
import { INITIAL_TTS_STATE, RATE_PRESETS } from "@/constants/tts"
import { debounce } from "@/lib/utils"

/**
 * Custom hook for text-to-speech functionality
 * Provides speech synthesis with voice selection, rate control, and text selection
 */
export function useTTS(): TTSHookReturn {
  const [state, setState] = useState<TTSState>(INITIAL_TTS_STATE)
  const synthesis = useRef<SpeechSynthesis | null>(null)
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)
  const isStopping = useRef(false)

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported")
      return
    }

    synthesis.current = window.speechSynthesis

    const initializeVoices = () => {
      const availableVoices = synthesis.current?.getVoices() || []
      setState(prev => ({
        ...prev,
        voices: availableVoices,
        selectedVoice: prev.selectedVoice || availableVoices[0] || null
      }))
    }

    synthesis.current.addEventListener("voiceschanged", initializeVoices)
    initializeVoices()

    return () => {
      synthesis.current?.removeEventListener("voiceschanged", initializeVoices)
    }
  }, [])

  // Handle text selection with debouncing
  useEffect(() => {
    const updateSelectedText = (text: string) => {
      setState(prev => ({ ...prev, text }))
    }

    const debouncedUpdateText = debounce(updateSelectedText, 200)

    const handleSelectionChange = () => {
      const selection = window.getSelection()
      const text = selection?.toString() || ""
      debouncedUpdateText(text)
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => synthesis.current?.cancel()
  }, [])

  /**
   * Creates a new utterance with the current voice and rate settings
   */
  const configureUtterance = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    
    if (!state.selectedVoice) {
      throw new Error("No voice selected")
    }

    utterance.voice = state.selectedVoice
    utterance.rate = state.rate

    utterance.onboundary = (event) => {
      const progress = (event.charIndex / text.length) * 100
      setState(prev => ({ ...prev, progress }))
    }

    utterance.onend = () => {
      if (!isStopping.current) {
        setState(prev => ({ ...prev, isPlaying: false, progress: 100 }))
      }
      isStopping.current = false
    }

    utterance.onerror = (event) => {
      const isIntentionalStop = event.error === 'interrupted' && isStopping.current
      if (!isIntentionalStop) {
        console.error("TTS Error:", event)
        setState(prev => ({ ...prev, isPlaying: false }))
      }
    }

    return utterance
  }

  /**
   * Starts speaking the provided text
   */
  const startNewSpeech = (text: string) => {
    if (!synthesis.current) {
      console.error("Speech synthesis not initialized")
      return
    }

    try {
      isStopping.current = false
      synthesis.current.cancel()
      currentUtterance.current = configureUtterance(text)
      synthesis.current.speak(currentUtterance.current)
      setState(prev => ({ ...prev, isPlaying: true, progress: 0 }))
    } catch (error) {
      console.error("Error in speak function:", error)
      setState(prev => ({ ...prev, isPlaying: false }))
    }
  }

  /**
   * Toggles between playing and pausing speech
   */
  const toggleSpeech = () => {
    if (!synthesis.current) {
      console.error("Speech synthesis not initialized")
      return
    }

    // If currently playing, pause the speech
    if (state.isPlaying) {
      synthesis.current.pause()
      setState(prev => ({ ...prev, isPlaying: false }))
      return
    }

    // Check if we have text to speak
    const trimmedText = state.text.trim()
    if (!trimmedText) {
      console.error("No text to speak")
      return
    }

    // Either resume paused speech or start new speech
    if (synthesis.current.paused) {
      synthesis.current.resume()
      setState(prev => ({ ...prev, isPlaying: true }))
    } else {
      startNewSpeech(trimmedText)
    }
  }

  /**
   * Stops speech and clears selection
   */
  const stopSpeech = () => {
    if (!synthesis.current) return

    isStopping.current = true
    synthesis.current.cancel()
    setState(prev => ({
      ...prev,
      isPlaying: false,
      progress: 0
    }))
    window.getSelection()?.removeAllRanges()
  }

  /**
   * Updates the selected voice
   */
  const updateVoice = (voice: SpeechSynthesisVoice | null) => {
    setState(prev => ({ ...prev, selectedVoice: voice }))
  }

  /**
   * Updates the speech rate
   */
  const updateRate = (rate: number) => {
    setState(prev => ({ ...prev, rate }))
    if (currentUtterance.current) {
      currentUtterance.current.rate = rate
    }
  }

  /**
   * Cycles through preset speech rates
   */
  const advanceToNextRate = () => {
    const currentIndex = RATE_PRESETS.indexOf(state.rate as typeof RATE_PRESETS[number])
    const nextIndex = (currentIndex + 1) % RATE_PRESETS.length
    updateRate(RATE_PRESETS[nextIndex])
  }

  return {
    ...state,
    toggleSpeech,
    stop: stopSpeech,
    setVoice: updateVoice,
    setRate: updateRate,
    cycleRate: advanceToNextRate,
  }
} 