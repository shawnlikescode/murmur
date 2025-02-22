import { useState, useLayoutEffect } from "react";

export function useContrastingBackground() {
  const [isDark, setIsDark] = useState(false);

  useLayoutEffect(() => {
    const updateBackground = () => {
      const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
      const bodyBg = getComputedStyle(document.body).backgroundColor;

      // If body has a specific background color, it may be overruled by html styles.
      const bgColor = bodyBg !== "rgba(0, 0, 0, 0)" ? bodyBg : htmlBg;

      setIsDark(isBackgroundDark(bgColor));
    };

    updateBackground();

    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

function isBackgroundDark(rgb: string) {
  const match = rgb.match(/\d+/g);
  if (!match) return false;
  const [r, g, b] = match.map(Number);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
} 