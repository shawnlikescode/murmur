import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, X } from "lucide-react"

export function SettingsPopover() {
  const [open, setOpen] = React.useState(false)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="bottom" sideOffset={5}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">TTS Settings</h4>
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
          <p className="text-sm text-muted-foreground">
            Configure Text-to-Speech settings
          </p>
          <p className="text-sm">Settings coming soon...</p>
        </div>
      </PopoverContent>
    </Popover>
  )
} 