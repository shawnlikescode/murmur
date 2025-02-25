import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, Play, Pause, Mic } from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Play button component
export function TTSPlayButton() {
  const {
    isPlaying,
    toggleSpeech,
    text: selectedText,
  } = useTTS()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      onClick={toggleSpeech}
      disabled={!selectedText}
      title={isPlaying ? "Pause" : selectedText ? "Play" : "Select text to speak"}
    >
      {isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
    </Button>
  )
}

// Expanded controls component
export function TTSExpandedControls() {
  const {
    voices,
    selectedVoice,
    rate,
    setVoice,
    setRate,
    cycleRate,
  } = useTTS()

  const handleRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Command/Control click to increase rate
    if (event.metaKey || event.ctrlKey) {
      cycleRate()
      return
    }
    
    // Option/Alt click to decrease rate
    if (event.altKey) {
      setRate(Math.max(0.5, rate - 0.25))
      return
    }
  }

  return (
    <>
      {/* Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">TTS Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure Text-to-Speech settings
            </p>
            {/* Settings content will go here */}
            <p className="text-sm">Settings coming soon...</p>
          </div>
        </PopoverContent>
      </Popover>

      {/* Speech Rate */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 relative"
            onClick={handleRateChange}
          >
            <span className="text-xs font-medium">{rate}x</span>
            <span className="sr-only">Speech Rate</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h4 className="font-medium leading-none">Speech Rate</h4>
              <span className="text-sm font-medium">{rate}x</span>
            </div>
            <Slider
              value={[rate]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(value) => setRate(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Tip: Cmd+Click to increase, Alt+Click to decrease</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Voice Selection */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Voice Selection</h4>
            <Select
              value={selectedVoice?.name || ""}
              onValueChange={(value) => {
                const voice = voices.find((v) => v.name === value)
                if (voice) setVoice(voice)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}