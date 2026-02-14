"use client";

import { useState, useEffect } from "react";

export default function StorageMonitor({
  customWallpapers,
  themePresets,
  cleanupOldData,
  setCustomWallpapers,
  setWallpapers,
  wallpapers,
  refreshTrigger,
  showConfirmModal,
}) {
  const [usage, setUsage] = useState({ used: 0, total: 0, percent: 0 });

  useEffect(() => {
    const calculateUsage = () => {
      try {
        const total = JSON.stringify(localStorage).length;
        const limit = 10 * 1024 * 1024; // 10 МБ
        const percent = Math.min((total / limit) * 100, 100);

        setUsage({
          used: (total / 1024 / 1024).toFixed(2),
          total: (limit / 1024 / 1024).toFixed(1),
          percent,
        });
      } catch (e) {
        console.error("Ошибка расчёта хранилища:", e);
      }
    };

    calculateUsage();
    window.addEventListener("storage", calculateUsage);
    return () => window.removeEventListener("storage", calculateUsage);
  }, [customWallpapers, themePresets, refreshTrigger]);

  return (
    <div className="settings-panel">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        <i className="fas fa-database mr-2"></i>Использование хранилища
      </h2>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-black dark:text-white">
            Использовано: {usage.used} МБ из {usage.total} МБ
          </span>
          <span className="text-black dark:text-white">
            {usage.percent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-dark-600 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              usage.percent > 90
                ? "bg-red-500"
                : usage.percent > 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${usage.percent}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400 mt-3">
        <p>
          <strong>Рекомендации:</strong>
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Удаляйте неиспользуемые обои</li>
          <li>Используйте ссылки на изображения вместо загрузки</li>
          <li>Создавайте пресеты без сохранения изображений</li>
        </ul>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="text-black dark:text-white flex-1 bg-slate-200 dark:bg-dark-800 p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-dark-600"
          onClick={cleanupOldData}
        >
          <i className="fas fa-broom mr-2"></i>Очистить старые данные
        </button>
        <button
          className="flex-1 bg-red-500/10 text-red-600 dark:text-red-400 p-2 rounded-lg hover:bg-red-500/20"
          onClick={() => {
            // Используем переданную функцию showConfirmModal
            if (showConfirmModal) {
              showConfirmModal("Удалить все пользовательские обои?", () => {
                setCustomWallpapers([]);
                setWallpapers([]);
              });
            } else {
              // Резервный вариант - использовать стандартный confirm
              if (confirm("Удалить все пользовательские обои?")) {
                setCustomWallpapers([]);
                setWallpapers([]);
              }
            }
          }}
        >
          <i className="fas fa-trash mr-2"></i>
          Удалить все обои
        </button>
      </div>
    </div>
  );
}
