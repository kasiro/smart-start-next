"use client";

import { useState } from "react";
import { useClickOutside } from "@/lib/hooks";

export default function FullscreenWallpaper({
  wallpaper,
  fullscreenWallpaper,
  setFullscreenWallpaper,
  updateWallpaper,
  removeWallpaper,
  removeCustomWallpaper,
  wallpapers,
  customWallpapers,
}) {
  const [swipeState, setSwipeState] = useState({
    startY: 0,
    currentY: 0,
    isSwiping: false,
  });

  const handleTouchStart = (e) => {
    setSwipeState({
      startY: e.touches[0].clientY,
      currentY: e.touches[0].clientY,
      isSwiping: true,
    });
  };

  const handleTouchMove = (e) => {
    if (!swipeState.isSwiping) return;

    const currentY = e.touches[0].clientY;
    setSwipeState((prev) => ({
      ...prev,
      currentY,
    }));
  };

  const handleTouchEnd = () => {
    const deltaY = swipeState.currentY - swipeState.startY;

    if (Math.abs(deltaY) > 150) {
      setFullscreenWallpaper(null);
    }

    setSwipeState({
      startY: 0,
      currentY: 0,
      isSwiping: false,
    });
  };

  const overlayRef = useClickOutside(() => {
    setFullscreenWallpaper(null);
  });

  if (!fullscreenWallpaper) return null;

  const isCurrent =
    wallpaper.type === fullscreenWallpaper.type &&
    wallpaper.value === fullscreenWallpaper.value;

  return (
    <div
      ref={overlayRef}
      className="fullscreen-wallpaper-overlay"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="fullscreen-wallpaper-content"
        style={{
          transform: `translateY(${swipeState.isSwiping ? swipeState.currentY - swipeState.startY : 0}px)`,
          transition: swipeState.isSwiping
            ? "none"
            : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {fullscreenWallpaper.type === "image" ? (
          <img
            src={fullscreenWallpaper.value}
            alt={fullscreenWallpaper.name}
            className="fullscreen-wallpaper-image rounded-xl"
            style={{
              opacity:
                1 -
                Math.min(
                  Math.abs(swipeState.currentY - swipeState.startY) / 300,
                  0.5,
                ),
              touchAction: "none",
            }}
            draggable="false"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <i className="fas fa-image text-5xl"></i>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-md">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            className={`flex-1 ${isCurrent ? "bg-white text-black" : "bg-primary-500 text-white"} py-3 rounded-lg`}
            disabled={isCurrent}
            onClick={() => {
              updateWallpaper(
                fullscreenWallpaper.type,
                fullscreenWallpaper.value,
              );
              setFullscreenWallpaper(null);
            }}
          >
            {isCurrent ? "Активно" : "Применить"}
          </button>
          <button
            className="flex-1 bg-red-500 text-white py-3 rounded-lg"
            onClick={() => {
              const index = [...wallpapers, ...customWallpapers].indexOf(
                fullscreenWallpaper,
              );
              if (index < wallpapers.length) {
                removeWallpaper(index);
              } else {
                removeCustomWallpaper(index - wallpapers.length);
              }
              setFullscreenWallpaper(null);
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
