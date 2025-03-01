import * as React from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause} from "lucide-react"
import { 
  useSelectedText, 
  useIsPlaying,
  useIsPaused,
} from "@/stores/tts-store"
import { useTTS } from "@/hooks/use-tts"
import { SettingsPopover } from "@/components/tts/settings-popover"
import { RatePopover } from "@/components/tts/rate-popover"
import { VoicePopover } from "@/components/tts/voice-popover"

export function TTSPlayButton() {
  const isPlaying = useIsPlaying()
  const isPaused = useIsPaused()
  const text = useSelectedText()
  const { toggleSpeech } = useTTS()

  const buttonText = React.useMemo(() => {
    if (isPlaying) return "Pause"
    if (isPaused) return "Resume"
    if (text) return "Play"
    return "Select text to speak"
  }, [isPlaying, isPaused, text])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      onClick={toggleSpeech}
      disabled={!text}
      title={buttonText}
    >
      {isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <span className="sr-only">{buttonText}</span>
    </Button>
  )
}

export function TTSExpandedControls() {
  return (
    <>
      <SettingsPopover />
      <RatePopover />
      <VoicePopover />
    </>
  )
}