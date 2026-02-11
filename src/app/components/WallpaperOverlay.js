"use client";

import { useEffect, useRef, useCallback } from "react";

export default function WallpaperOverlay({ wallpaper, darkMode }) {
  const overlayRef = useRef(null);
  const imageRef = useRef(null);

  const updateWallpaperStyle = useCallback(() => {
    const overlay = overlayRef.current;
    const img = imageRef.current;
    if (!overlay) return;

    // Сбрасываем стили перед установкой новых
    overlay.style.backgroundImage = "";
    overlay.style.backgroundColor = "";

    if (wallpaper.type === "none") {
      // Если темная тема включена и нет фонового изображения, устанавливаем темный фон
      if (darkMode) {
        overlay.style.backgroundColor = "#2d2d2d"; // темно-серый цвет
        overlay.style.opacity = "1";
      } else {
        overlay.style.opacity = "0";
      }
    } else if (wallpaper.type === "image") {
      // На всех устройствах используем img элемент для стабильного отображения
      overlay.style.opacity = wallpaper.opacity;
    }
  }, [wallpaper, darkMode]);

  useEffect(() => {
    updateWallpaperStyle();
  }, [updateWallpaperStyle]);

  // Добавляем обработчик изменения размера экрана для оптимизации на мобильных устройствах
  useEffect(() => {
    const handleResize = () => {
      updateWallpaperStyle();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateWallpaperStyle]);

  return (
    <div
      ref={overlayRef}
      className="wallpaper-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        transition: "opacity 1s ease",
        overflow: "hidden",
      }}
    >
      {wallpaper.type === "image" && (
        <img
          ref={imageRef}
          src={wallpaper.value}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            // Фиксируем изображение для предотвращения дёргания при скролле
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          draggable={false}
        />
      )}
    </div>
  );
}
