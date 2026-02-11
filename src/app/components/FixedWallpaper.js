"use client";

import { useEffect, useRef, useCallback } from "react";

export default function FixedWallpaper({ wallpaper, darkMode }) {
  const overlayRef = useRef(null);

  const updateWallpaperStyle = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (wallpaper.type === "none") {
      overlay.style.backgroundImage = "";
      if (darkMode) {
        overlay.style.backgroundColor = "#2d2d2d";
        overlay.style.opacity = "1";
      } else {
        overlay.style.backgroundColor = "transparent";
        overlay.style.opacity = "0";
      }
    } else if (wallpaper.type === "image") {
      overlay.style.backgroundColor = "transparent";
      overlay.style.backgroundImage = `url("${wallpaper.value}")`;
      overlay.style.opacity = wallpaper.opacity;

      // Дополнительно устанавливаем размер и позиционирование для лучшей совместимости
      overlay.style.backgroundSize = "cover";
      overlay.style.backgroundPosition = "center";
      overlay.style.backgroundRepeat = "no-repeat";
    }
  }, [wallpaper, darkMode]);

  useEffect(() => {
    updateWallpaperStyle();
  }, [updateWallpaperStyle]);

  return <div ref={overlayRef} className="wallpaper-fixed" />;
}
