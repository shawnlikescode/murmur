import { VoiceGroup } from "@/types/tts"

let globalSynthesis: SpeechSynthesis | null = null;
let globalVoices: SpeechSynthesisVoice[] = [];
let initAttempted = false;

export function initializeSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  
  if (!globalSynthesis && !initAttempted) {
    initAttempted = true;
    
    if (window.speechSynthesis) {
      globalSynthesis = window.speechSynthesis;
    }
  }
  
  return globalSynthesis;
}

export function getAvailableVoices(synthesis: SpeechSynthesis | null): SpeechSynthesisVoice[] {
  if (!synthesis) return [];
  
  if (globalVoices.length === 0) {
    try {
      const freshVoices = synthesis.getVoices();
      if (freshVoices.length > 0) {
        globalVoices = freshVoices;
      }
    } catch (error) {
      console.error("Error loading voices:", error);
    }
  }
  
  return globalVoices;
}

export function findVoiceByName(name: string, synthesis: SpeechSynthesis | null): SpeechSynthesisVoice | null {
  const voice = globalVoices.find(v => v.name === name);
  if (!voice && synthesis) {
    const freshVoices = synthesis.getVoices();
    return freshVoices.find(v => v.name === name) || null;
  }
  return voice || null;
}

export function updateGlobalVoices(voices: SpeechSynthesisVoice[]): void {
  if (voices.length > 0) {
    globalVoices = voices;
  }
}

export function sortVoicesByLanguage(voices: SpeechSynthesisVoice[]): VoiceGroup[] {
  const groupedVoices: Record<string, VoiceGroup> = {};
  
  const userLanguage = navigator.language.split('-')[0].toLowerCase();
  const commonLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja'];
  
  voices.forEach(voice => {
    const langCode = voice.lang.split('-')[0].toLowerCase();
    const langName = new Intl.DisplayNames([navigator.language], { type: 'language' }).of(langCode) || langCode;
    
    if (!groupedVoices[langCode]) {
      groupedVoices[langCode] = {
        code: langCode,
        name: langName,
        voices: []
      };
    }
    
    groupedVoices[langCode].voices.push(voice);
  });
  
  Object.values(groupedVoices).forEach(group => {
    group.voices.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return Object.values(groupedVoices).sort((a, b) => {
    // User's language always comes first
    if (a.code === userLanguage) return -1;
    if (b.code === userLanguage) return 1;
    
    // Then prioritize common languages
    const aCommonIndex = commonLanguages.indexOf(a.code);
    const bCommonIndex = commonLanguages.indexOf(b.code);
    
    // If both are common languages, sort by their order in commonLanguages
    if (aCommonIndex !== -1 && bCommonIndex !== -1) {
      return aCommonIndex - bCommonIndex;
    }
    
    // If only one is a common language, prioritize it
    if (aCommonIndex !== -1) return -1;
    if (bCommonIndex !== -1) return 1;
    
    // Otherwise sort alphabetically by language name
    return a.name.localeCompare(b.name);
  });
}

export function createUtterance(
  text: string,
  voice: SpeechSynthesisVoice | null,
  rate: number
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = rate;
  return utterance;
}

export function isWordBoundary(char: string): boolean {
  return /[\s,.!?;:()\[\]{}"'\-–—]/.test(char);
}

export function findWordBoundary(text: string, currentPosition: number): number {
  if (!text) return 0;
  if (currentPosition <= 0) return 0;
  if (currentPosition >= text.length) return 0;
  
  const pos = Math.min(currentPosition, text.length - 1);
  let wordStart = pos;
  
  while (wordStart > 0) {
    if (isWordBoundary(text[wordStart - 1])) {
      break;
    }
    wordStart--;
  }
  
  return wordStart;
} 