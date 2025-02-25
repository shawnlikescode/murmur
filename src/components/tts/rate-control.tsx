import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Gauge } from "lucide-react"
import { RATE_PRESETS } from "@/constants/tts"

interface RateControlProps {
  rate: number
  onRateChange: (rate: number) => void
  onCycleRate: () => void
}

export function RateControl({ rate, onRateChange, onCycleRate }: RateControlProps) {
  return (
    <div className="flex items-center space-x-2">
      <Select value={rate.toString()} onValueChange={(value) => onRateChange(Number(value))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Rate" />
        </SelectTrigger>
        <SelectContent>
          {RATE_PRESETS.map((preset) => (
            <SelectItem key={preset} value={preset.toString()}>
              {preset}x
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onCycleRate}>
              <Gauge className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Cycle rate</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
} 