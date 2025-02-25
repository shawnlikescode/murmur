import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const PanelContext = React.createContext<{
  isOpen: boolean;
  isHovered: boolean;
  setIsOpen: (open: boolean) => void;
  side: "left" | "right";
}>({
  isOpen: false,
  isHovered: false,
  setIsOpen: () => {},
  side: "right",
})

interface PanelProps {
  children: React.ReactNode
  side?: "left" | "right"
  position?: "top" | "bottom"
}

export function Panel({ 
  children,
  side = "right",
  position = "bottom"
}: PanelProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={cn(
        "fixed bg-background rounded-lg shadow-lg border",
        "transition-[width,transform,opacity] duration-300 ease-out",
        "h-12",
        position === "top" ? "top-6" : "bottom-6",
        side === "left" 
          ? "left-6" 
          : "right-6",
        // Width classes
        isOpen 
          ? isHovered
            ? "w-auto max-w-[24rem]"
            : "w-auto max-w-[22rem]" 
          : isHovered 
            ? "w-[4.5rem]"
            : "w-12"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {/* Toggle button - only visible on hover when collapsed */}
        {!isOpen && (
          <div className={cn(
            "absolute inset-y-0 flex items-center z-10",
            "transition-[opacity,transform] duration-200 ease-in-out",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none",
            side === "left" ? "right-0 pr-1" : "left-0 pl-1"
          )}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-transparent"
              onClick={() => setIsOpen(true)}
            >
              <ChevronLeft 
                className={cn(
                  "h-4 w-4",
                  side === "left" ? "rotate-180" : ""
                )}
              />
              <span className="sr-only">Expand Panel</span>
            </Button>
          </div>
        )}

        {/* Close button - only visible when expanded */}
        {isOpen && (
          <div className={cn(
            "absolute inset-y-0 flex items-center z-10",
            "transition-[opacity,transform] duration-200 ease-in-out",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none",
            side === "left" ? "right-0 pr-1" : "left-0 pl-1"
          )}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-transparent"
              onClick={() => {
                setIsOpen(false)
                setIsHovered(false) // Reset hover state when closing
              }}
            >
              <ChevronLeft 
                className={cn(
                  "h-4 w-4",
                  side === "left" ? "rotate-0" : "rotate-180"
                )}
              />
              <span className="sr-only">Collapse Panel</span>
            </Button>
          </div>
        )}
        
        {/* Provide panel state via context */}
        <PanelContext.Provider value={{ isOpen, isHovered, setIsOpen, side }}>
          {children}
        </PanelContext.Provider>
      </div>
    </div>
  )
}

export function usePanelContext() {
  const context = React.useContext(PanelContext)
  if (context === undefined) {
    throw new Error('usePanelContext must be used within a Panel')
  }
  return context
}

interface PanelContentProps {
  children: React.ReactNode
}

export function PanelContent({ children }: PanelContentProps) {
  const { isOpen, isHovered, side } = usePanelContext()
  
  if (!isOpen) {
    return null
  }
  
  return (
    <div className={cn(
      "flex items-center h-full w-full",
      "transition-[padding] duration-300 ease-out",
      // Add padding based on side and hover state
      side === "left"
        ? isHovered ? "pl-3 pr-8" : "px-3" // Right padding for toggle on left side
        : isHovered ? "pl-8 pr-3" : "px-3"  // Left padding for toggle on right side
    )}>
      {children}
    </div>
  )
}

interface PanelTriggerProps {
  children: React.ReactNode
}

export function PanelTrigger({ children }: PanelTriggerProps) {
  const { isOpen, side } = usePanelContext()
  
  // When collapsed, position the trigger at the edge based on the side
  if (!isOpen) {
    return (
      <div className={cn(
        "absolute inset-y-0 flex items-center",
        side === "left" ? "left-0" : "right-0"
      )}>
        <div className="w-12 h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    )
  }
  
  // When expanded, don't render anything
  return null
} 