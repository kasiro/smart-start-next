"use client";

import { useState, useEffect, useMemo } from "react";

export default function ThemePresets({
  themePresets,
  setThemePresets,
  wallpaper,
  primaryColor,
  newPresetName,
  setNewPresetName,
  generateId,
  updatePresetName,
  editingPresetId,
  setEditingPresetId,
  applyThemePreset,
  removeThemePreset,
  setWallpaper,
  setPrimaryColor,
}) {
  const addThemePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset = {
      id: generateId(),
      name: newPresetName.trim(),
      wallpaper: { ...wallpaper },
      primaryColor: { ...primaryColor },
      createdAt: new Date().toISOString(),
    };

    setThemePresets([...themePresets, newPreset]);
    setNewPresetName("");
  };

  // Вычисляем ID активного пресета
  const activePresetId = useMemo(() => {
    return (
      themePresets.find(
        (preset) =>
          wallpaper.type === preset.wallpaper.type &&
          wallpaper.value === preset.wallpaper.value &&
          wallpaper.opacity === preset.wallpaper.opacity &&
          primaryColor.hue === preset.primaryColor.hue &&
          primaryColor.saturation === preset.primaryColor.saturation &&
          primaryColor.lightness === preset.primaryColor.lightness,
      )?.id || null
    );
  }, [wallpaper, primaryColor, themePresets]);

  return (
    <div className="settings-panel lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
        <i className="fas fa-palette"></i> Пресеты тем
      </h2>

      <div className="mb-6 p-4 bg-slate-50 dark:bg-dark-800 rounded-lg">
        <h3 className="font-medium mb-3 text-black dark:text-white">
          Создать новый пресет
        </h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Название пресета"
            className="flex-1 p-2 rounded-lg bg-white dark:bg-dark-700 theme-input text-black dark:text-white"
            onKeyDown={(e) => e.key === "Enter" && addThemePreset()}
          />
          <button
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
            onClick={addThemePreset}
            disabled={!newPresetName.trim()}
          >
            <i className="fas fa-plus mr-2"></i>
            Создать
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Пресет сохранит текущие обои и цветовую схему
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themePresets.map((preset) => (
          <div key={preset.id} className="relative group">
            <div
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activePresetId === preset.id
                  ? "border-primary-500 ring-2 ring-primary-500/20"
                  : "border-slate-200 dark:border-dark-600 hover:border-slate-300 dark:hover:border-dark-500"
              }`}
              onClick={() =>
                applyThemePreset(preset, setWallpaper, setPrimaryColor)
              }
            >
              <div className="relative h-24 mb-3 rounded-md overflow-hidden bg-slate-100 dark:bg-dark-700">
                {preset.wallpaper.type === "image" ? (
                  <img
                    src={preset.wallpaper.value}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <i className="fas fa-image text-2xl"></i>
                  </div>
                )}
                {activePresetId === preset.id && (
                  <div className="absolute top-2 left-2 bg-primary-500 text-white dark:text-white text-xs px-2 py-1 rounded-md">
                    Активно
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {editingPresetId === preset.id ? (
                    <input
                      type="text"
                      defaultValue={preset.name}
                      autoFocus
                      onBlur={(e) => {
                        const updatedPresets = updatePresetName(
                          themePresets,
                          preset.id,
                          e.target.value,
                        );
                        setThemePresets(updatedPresets);
                        setEditingPresetId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const updatedPresets = updatePresetName(
                            themePresets,
                            preset.id,
                            e.target.value,
                          );
                          setThemePresets(updatedPresets);
                          setEditingPresetId(null);
                        }
                        if (e.key === "Escape") setEditingPresetId(null);
                      }}
                      className="w-full bg-transparent border-b text-black dark:text-white border-slate-300 dark:border-dark-500 focus:border-primary-500 outline-none"
                    />
                  ) : (
                    <h3 className="font-medium truncate text-black dark:text-white">
                      {preset.name}
                    </h3>
                  )}
                  <div className="flex items-center mt-2">
                    <div
                      className="w-4 h-4 rounded-full mr-2 border border-slate-200 dark:border-dark-600"
                      style={{
                        backgroundColor: `hsl(${preset.primaryColor.hue}, ${preset.primaryColor.saturation}%, ${preset.primaryColor.lightness}%)`,
                      }}
                    ></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    className="p-2 text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPresetId(preset.id);
                    }}
                    title="Редактировать"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThemePresets(
                        removeThemePreset(themePresets, preset.id),
                      );
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
