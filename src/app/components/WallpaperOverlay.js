"use client";

import { useEffect, useRef, useCallback } from "react";

export default function WallpaperOverlay({ wallpaper, darkMode }) {
  const overlayRef = useRef(null);

  const updateWallpaperStyle = useCallback(() => {
    const overlay = overlayRef.current;
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
      // Для мобильных устройств используем более производительную стратегию
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (isMobile) {
        // На мобильных устройствах используем background-attachment: scroll для лучшей производительности
        overlay.style.backgroundImage = `url("${wallpaper.value}")`;
        overlay.style.backgroundSize = "cover";
        overlay.style.backgroundPosition = "center";
        overlay.style.backgroundRepeat = "no-repeat";
        overlay.style.backgroundAttachment = "scroll"; // Изменяем на scroll для мобильных устройств
      } else {
        // На десктопах можно использовать fixed
        overlay.style.backgroundImage = `url("${wallpaper.value}")`;
        overlay.style.backgroundSize = "cover";
        overlay.style.backgroundPosition = "center";
        overlay.style.backgroundRepeat = "no-repeat";
        overlay.style.backgroundAttachment = "fixed";
      }

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
        // Добавляем оптимизации для производительности
        transform: "translateZ(0)", // Активирует аппаратное ускорение
        willChange: "opacity", // Подсказывает браузеру, что свойство будет меняться
        // Оптимизация для мобильных устройств
        WebkitTransform: "translateZ(0)", // Дополнительная оптимизация для Safari
        MozTransform: "translateZ(0)", // Дополнительная оптимизация для Firefox
      }}
    />
  );
}
