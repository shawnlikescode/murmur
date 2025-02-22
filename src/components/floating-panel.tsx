import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useContrastingBackground } from "@/hooks/use-contrasting-background";

interface FloatingPanelProps {
  children?: React.ReactNode;
}

export function FloatingPanel({ children }: FloatingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = useContrastingBackground();

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className={`
        shadow-lg w-10 rounded-lg border transition-colors
        ${isExpanded ? 'h-[200px]' : 'h-10'}
        ${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
      `}
    >
      <CollapsibleContent>
        {children}
      </CollapsibleContent>

      <CollapsibleTrigger asChild>
        <Button
          size="sm"      
          className={`
            size-10 rounded-lg bg-transparent hover:bg-transparent
            ${isDark ? 'text-gray-900' : 'text-white'}
          `}
        >
          {isExpanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronUp className="size-4" />
          )}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
} 