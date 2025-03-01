import { useEffect } from "react"
import { debounce } from "@/lib/utils"
import { useTTSActions } from "@/stores/tts-store"

export function useTextSelection() {
  const { updateSelectedText } = useTTSActions();
  
  useEffect(() => {
    const handleSelectionChange = debounce(() => {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || "";
      
      if (selectedText) {
        updateSelectedText(selectedText);
      }
    }, 200);
    
    document.addEventListener("selectionchange", handleSelectionChange);
    
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [updateSelectedText]);
} 