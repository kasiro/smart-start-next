"use client";

import { DEFAULT_ICONS } from "../../lib/constants";

export default function IconManager({
  newCustomIcon,
  setNewCustomIcon,
  addCustomIcon,
  customIcons,
  removeCustomIcon,
  setShowIconManager,
  getIcon,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
      <div className="settings-panel w-full max-w-2xl icon-manager-container">
        <div className="icon-manager-header">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Управление иконками
            </h2>
            <button
              className="p-2 text-black dark:text-white"
              onClick={() => setShowIconManager(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="icon-manager-content">
          <div className="icon-manager-form mb-6">
            <h3 className="text-lg font-medium mb-3 text-black dark:text-white">
              Добавить новую иконку
            </h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newCustomIcon}
                onChange={(e) => setNewCustomIcon(e.target.value)}
                placeholder="Название иконки (например: car)"
                className="flex-1 p-3 rounded-xl text-black dark:text-white bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
              />
              <button
                className="bg-primary-500 text-white p-3 px-4 rounded-xl hover:bg-primary-600"
                onClick={addCustomIcon}
              >
                Добавить
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Используйте названия иконок из Font Awesome. Пример: "car",
              "plane", "music". Для брендов добавьте префикс "fab fa-",
              например: "fab fa-google".
            </p>
          </div>

          <div className="mb-4 overflow-y-auto">
            <h3 className="text-lg font-medium mb-3 text-black dark:text-white">
              Все иконки
            </h3>
            <div className="icon-manager-scroll-container dark:border-slate-700 rounded-lg">
              <div className="icon-manager-grid">
                {[...DEFAULT_ICONS, ...customIcons].map((icon) => (
                  <div
                    key={icon}
                    className="text-primary-500 relative icon-grid-item"
                  >
                    <div className="icon-grid-item-icon">{getIcon(icon)}</div>
                    <div className="icon-grid-item-name">{icon}</div>
                    {!DEFAULT_ICONS.includes(icon) && (
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => removeCustomIcon(icon)}
                        title="Удалить иконку"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="icon-manager-footer">
          <div className="flex justify-end pt-4">
            <button
              className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
              onClick={() => setShowIconManager(false)}
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
