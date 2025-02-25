import * as React from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { capitalizeFirstLetter } from "@/lib/utils"
interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void
}

export function VoiceSelector({ voices, selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  const groupedVoices = voices.reduce(
    (acc, voice) => {
      const lang = voice.lang.split("-")[0]
      if (!acc[lang]) {
        acc[lang] = []
      }
      acc[lang].push(voice)
      return acc
    },
    {} as Record<string, SpeechSynthesisVoice[]>,
  )

  return (
    <Select
      value={selectedVoice?.name}
      onValueChange={(value) => onVoiceChange(voices.find((v) => v.name === value) || null)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedVoices).map(([lang, langVoices]) => (
          <React.Fragment key={lang}>
            <SelectGroup>
              <SelectLabel className="font-black">
                {capitalizeFirstLetter(
                  new Intl.DisplayNames([lang], { type: "language" }).of(lang) || ""
                )}
              </SelectLabel>
              {langVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  )
} 