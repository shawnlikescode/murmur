import * as React from "react"
import { TTSPlayButton, TTSExpandedControls } from "./tts/controls"
import { Panel, PanelTrigger, PanelContent, usePanelContext } from "@/components/ui/panel"
import { cn } from "@/lib/utils"

// Component for the expanded content with proper alignment
function ExpandedContent() {
  const { side } = usePanelContext()
  const isLeftSide = side === "left"
  
  return (
    <div className="flex items-center w-full">
      <div className="flex items-center gap-3">
        {isLeftSide ? (
          <>
            <TTSPlayButton />
            <TTSExpandedControls />
          </>
        ) : (
          <>
            <TTSExpandedControls />
            <TTSPlayButton />
          </>
        )}
      </div>
    </div>
  )
}

export default function TTSReader() {
  return (
    <Panel side="right" position="bottom">
      {/* Play button at the edge when collapsed */}
      <PanelTrigger>
        <TTSPlayButton />
      </PanelTrigger>
      
      {/* When expanded, show play button and controls with proper alignment */}
      <PanelContent>
        <ExpandedContent />
      </PanelContent>
    </Panel>
  )
}

