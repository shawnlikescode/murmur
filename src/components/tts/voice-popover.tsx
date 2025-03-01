import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Mic, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { VoiceGroup } from "@/types/tts"
import { useCurrentVoice, useTTSActions } from "@/stores/tts-store"
import { useTTS } from "@/hooks/use-tts"

const VoiceSelector = React.memo(function VoiceSelector({
  voicesByLanguage,
  currentVoice,
  setVoice,
  setVoiceOpen
}: {
  voicesByLanguage: VoiceGroup[],
  currentVoice: SpeechSynthesisVoice | null,
  setVoice: (voice: SpeechSynthesisVoice) => void,
  setVoiceOpen: (open: boolean) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Search voices..." className="h-9"  />
      <CommandList className="max-h-60">
        <CommandEmpty>No voices found.</CommandEmpty>
        
        {voicesByLanguage.map((langGroup) => (
          <CommandGroup key={langGroup.code} heading={langGroup.name}>
            {langGroup.voices.map((voice: SpeechSynthesisVoice) => (
              <CommandItem
                key={voice.name}
                value={`${voice.lang} ${voice.name}`}
                onSelect={() => {
                  setVoice(voice);
                  setVoiceOpen(false);
                }}
              >
                {voice.name} 
                <span className="ml-1 text-muted-foreground">({voice.lang})</span>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    currentVoice?.name === voice.name 
                      ? "opacity-100" 
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
});

export function VoicePopover() {
  const currentVoice = useCurrentVoice()
  const { selectVoice } = useTTSActions()
  const { voicesByLanguage } = useTTS()
  const [open, setOpen] = React.useState(false)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9"
          aria-label="Select voice"
        >
          <Mic className="h-4 w-4" />
          <span className="sr-only">Voice</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="bottom" sideOffset={5}>
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-medium leading-none">Voice Selection</h4>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        {currentVoice && (
          <div className="px-3 py-2 border-b">
            <div className="text-sm font-medium">Current voice:</div>
            <div className="text-sm flex items-center">
              {currentVoice.name}
              <span className="ml-1 text-muted-foreground">({currentVoice.lang})</span>
            </div>
          </div>
        )}
        
        <VoiceSelector 
          voicesByLanguage={voicesByLanguage}
          currentVoice={currentVoice}
          setVoice={selectVoice}
          setVoiceOpen={setOpen}
        />
      </PopoverContent>
    </Popover>
  )
}

// Export the VoiceSelector for reuse
export { VoiceSelector } 