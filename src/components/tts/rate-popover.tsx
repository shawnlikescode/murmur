import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import { useSpeechRate, useTTSActions } from "@/stores/tts-store"

export function RatePopover() {
  const rate = useSpeechRate()
  const { adjustRate } = useTTSActions()
  const [open, setOpen] = React.useState(false)

  const displayRate = Number(rate.toFixed(1))
  const formattedRate = displayRate + 'x'
  
  const handleSlower =() => {
    adjustRate(-0.1)
  }
  
  const handleFaster =() => {
    adjustRate(0.1)
  }

  const handleSliderChange = (value: number) => {
    adjustRate(value)
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 relative"
        >
          <span className="text-xs font-medium">{formattedRate}</span>
          <span className="sr-only">Speech Rate</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="bottom" sideOffset={5}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Speech Rate</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formattedRate}</span>
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
          </div>
          <Slider
            value={[displayRate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => handleSliderChange(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSlower}
            >
              Slower
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFaster}
            >
              Faster
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 