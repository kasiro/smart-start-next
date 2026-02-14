"use client";

import { useState } from "react";
import StorageMonitor from "./StorageMonitor";
import ThemePresets from "./ThemePresets";

export default function Settings({
  onClose,
  darkMode,
  setDarkMode,
  primaryColor,
  setPrimaryColor,
  wallpaper,
  setWallpaper,
  siteGroups,
  setSiteGroups,
  customIcons,
  setCustomIcons,
  tabLayout,
  setTabLayout,
  setShowWallpaperTab,
  panelBlur,
  setPanelBlur,
  searchEngines,
  setSearchEngines,
  currentSearchEngine,
  setCurrentSearchEngine,
  colorPresets,
  setColorPresets,
  updatePrimaryColor,
  updateWallpaperOpacity,
  generateId,
  addSearchEngine,
  removeSearchEngine,
  openAddGroupForm,
  openEditGroupForm,
  deleteGroup,
  setShowIconManager,
  openEditSiteForm,
  deleteSite,
  openAddSiteForm,
  themePresets,
  setThemePresets,
  newPresetName,
  setNewPresetName,
  updatePresetName,
  editingPresetId,
  setEditingPresetId,
  applyThemePreset,
  removeThemePreset,
  wallpapers,
  setWallpapers,
  customWallpapers,
  setCustomWallpapers,
  showConfirmModal,
  showAlertModal,
}) {
  const [importExportStatus, setImportExportStatus] = useState(null);
  const [newSearchEngineName, setNewSearchEngineName] = useState("");
  const [newSearchEngineUrl, setNewSearchEngineUrl] = useState("");
  const [refreshStorageMonitor, setRefreshStorageMonitor] = useState(0);

  const cleanupOldData = () => {
    // Очистка старых данных из localStorage
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Поиск старых неиспользуемых ключей, которые могут занимать место
      if (
        key &&
        (key.startsWith("old_") ||
          key.startsWith("temp_") ||
          key.endsWith("_backup") ||
          key.includes("cache") ||
          key.includes("legacy"))
      ) {
        keysToRemove.push(key);
      }
    }

    // Удаление найденных ключей
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Также очищаем любые поврежденные или недействительные данные
    try {
      // Проверяем, содержит ли customWallpapers действительные данные
      if (Array.isArray(customWallpapers)) {
        const validWallpapers = customWallpapers.filter((wallpaper) => {
          if (typeof wallpaper !== "object" || wallpaper === null) return false;
          if (
            wallpaper.type === "image" &&
            wallpaper.value &&
            typeof wallpaper.value === "string"
          ) {
            // Проверяем, является ли это допустимым URL-адресом данных
            return wallpaper.value.startsWith("data:image");
          }
          return true;
        });

        if (validWallpapers.length !== customWallpapers.length) {
          setCustomWallpapers(validWallpapers);
        }
      }

      // Проверяем, содержит ли themePresets действительные данные
      if (Array.isArray(themePresets)) {
        const validPresets = themePresets.filter((preset) => {
          return typeof preset === "object" && preset !== null && preset.id;
        });

        if (validPresets.length !== themePresets.length) {
          setThemePresets(validPresets);
        }
      }
    } catch (e) {
      console.error("Ошибка очистки данных:", e);
    }

    setImportExportStatus(`${keysToRemove.length} старых записей удалено`);
    setTimeout(() => setImportExportStatus(null), 3000);
  };

  const handleAddSearchEngine = () => {
    if (!newSearchEngineName.trim() || !newSearchEngineUrl.trim()) {
      if (showAlertModal) {
        showAlertModal("Пожалуйста, заполните все поля");
      } else {
        alert("Пожалуйста, заполните все поля");
      }
      return;
    }

    if (!newSearchEngineUrl.includes("%s")) {
      if (showAlertModal) {
        showAlertModal("URL должен содержать %s для подстановки запроса");
      } else {
        alert("URL должен содержать %s для подстановки запроса");
      }
      return;
    }

    const newEngine = {
      name: newSearchEngineName.trim(),
      url: newSearchEngineUrl.trim(),
    };

    setSearchEngines([...searchEngines, newEngine]);
    setNewSearchEngineName("");
    setNewSearchEngineUrl("");
  };

  const exportSettings = () => {
    const settings = {
      version: 2,
      exportDate: new Date().toISOString(),
      darkMode,
      siteGroups,
      customIcons,
      primaryColor,
      wallpaper,
      wallpapers,
      customWallpapers,
      searchEngines,
      currentSearchEngine,
      tabLayout,
      panelBlur,
      themePresets,
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "SmartStart-Backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setImportExportStatus("Настройки успешно экспортированы");
    setTimeout(() => setImportExportStatus(null), 3000);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);

        if (!importedSettings.version) {
          throw new Error("Неподдерживаемая версия файла настроек");
        }

        // Применяем настройки
        if (importedSettings.darkMode !== undefined)
          setDarkMode(importedSettings.darkMode);
        if (importedSettings.siteGroups)
          setSiteGroups(importedSettings.siteGroups);
        if (importedSettings.customIcons)
          setCustomIcons(importedSettings.customIcons);
        if (importedSettings.primaryColor)
          setPrimaryColor(importedSettings.primaryColor);
        if (importedSettings.wallpaper) {
          setWallpaper(importedSettings.wallpaper);
        }
        if (importedSettings.wallpapers)
          setWallpapers(importedSettings.wallpapers);
        if (importedSettings.customWallpapers)
          setCustomWallpapers(importedSettings.customWallpapers);
        if (importedSettings.searchEngines)
          setSearchEngines(importedSettings.searchEngines);
        if (importedSettings.currentSearchEngine)
          setCurrentSearchEngine(importedSettings.currentSearchEngine);
        if (importedSettings.tabLayout)
          setTabLayout(importedSettings.tabLayout);
        if (importedSettings.panelBlur)
          setPanelBlur(importedSettings.panelBlur);
        if (importedSettings.themePresets) {
          setThemePresets(importedSettings.themePresets);
        }

        setImportExportStatus("Настройки успешно импортированы");

        // Обновляем показатели StorageMonitor
        setRefreshStorageMonitor((prev) => prev + 1);
      } catch (error) {
        console.error("Ошибка импорта настроек:", error);
        setImportExportStatus(`Ошибка: ${error.message}`);
      }
      setTimeout(() => setImportExportStatus(null), 3000);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="sm:max-w-3xl lg:max-w-7xl mx-auto grid sm:grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="settings-panel lg:col-span-2">
        <div className="modal-overlay mt-[-15px] mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Настройки
          </h1>
          <button
            className="p-3 mr-[-15px] text-black dark:text-white"
            onClick={onClose}
          >
            <i className="fas fa-times text-3xl"></i>
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-paint-brush"></i> Внешний вид
        </h2>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 text-black dark:text-white">
            {darkMode ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
            <span>{darkMode ? "Темная тема" : "Светлая тема"}</span>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="toggle-switch"></div>
          </label>
        </div>
      </div>

      <StorageMonitor
        customWallpapers={customWallpapers}
        themePresets={themePresets}
        cleanupOldData={cleanupOldData}
        setCustomWallpapers={setCustomWallpapers}
        wallpapers={wallpapers}
        setWallpapers={setWallpapers}
        refreshTrigger={refreshStorageMonitor}
        showConfirmModal={(message, callback) => {
          // Вызываем переданные функции для отображения модального окна подтверждения
          window.setConfirmMessage && window.setConfirmMessage(message);
          window.setConfirmCallback &&
            window.setConfirmCallback(() => callback);
          window.setShowConfirm && window.setShowConfirm(true);
        }}
      />

      <div className="settings-panel">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-file-import"></i> Импорт / Экспорт
        </h2>

        <div className="flex flex-col gap-3">
          <button
            className="flex items-center gap-2 bg-primary-500 text-white p-3 px-4 rounded-xl hover:bg-primary-600"
            onClick={exportSettings}
          >
            <i className="fas fa-file-export"></i>
            <span>Экспорт всех настроек</span>
          </button>

          <label className="flex items-center gap-2 bg-slate-200 dark:bg-dark-800 text-black dark:text-white p-3 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-dark-600 cursor-pointer">
            <i className="fas fa-file-import"></i>
            <span>Импорт настроек</span>
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>

          {importExportStatus && (
            <div
              className={`p-3 rounded-xl ${
                importExportStatus.startsWith("Ошибка")
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              }`}
            >
              {importExportStatus}
            </div>
          )}
        </div>
      </div>

      <div className="settings-panel">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-layer-group"></i> Расположение вкладок
        </h2>

        <div className="relative bg-slate-100 dark:bg-dark-800 p-1 rounded-xl inline-flex">
          <div
            className={`absolute top-1 bottom-1 rounded-lg bg-white dark:bg-dark-900 shadow-sm transition-all duration-300 ${
              tabLayout === "tabs"
                ? "left-1 w-[calc(50%-8px)]"
                : "left-[calc(50%+4px)] w-[calc(50%-12px)]"
            }`}
          />

          <button
            className={`relative z-10 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              tabLayout === "tabs"
                ? "text-primary-500"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
            onClick={() => setTabLayout("tabs")}
          >
            <div className="flex items-center gap-2">
              <i className="fas fa-align-left"></i>
              <span>Вкладки</span>
            </div>
          </button>

          <button
            className={`relative z-10 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              tabLayout === "dock"
                ? "text-primary-500"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
            onClick={() => setTabLayout("dock")}
          >
            <div className="flex items-center gap-2">
              <i className="fas fa-window-maximize"></i>
              <span>Док-бар</span>
            </div>
          </button>
        </div>

        {/* Динамическое превью */}
        <div className="mt-6 border border-slate-200 dark:border-dark-700 rounded-xl overflow-hidden">
          {/* Заголовок превью */}
          <div className="bg-slate-50 dark:bg-dark-800 px-4 py-2 border-b border-slate-200 dark:border-dark-700 text-black dark:text-white">
            <h3 className="font-medium text-sm">Предпросмотр</h3>
          </div>

          {/* Контент превью */}
          <div className="relative items-center h-40 bg-white dark:bg-dark-900">
            {/* Вкладки (если выбрано) */}
            {tabLayout === "tabs" && (
              <div className="absolute top-0 left-0 right-0 h-10 flex px-3 pt-2 gap-1 bg-slate-50 dark:bg-dark-800">
                <div className="h-8 rounded-lg bg-primary-500 w-1/4 flex items-center justify-center">
                  <span className="text-xs text-white">Активная</span>
                </div>
                <div className="h-8 rounded-lg bg-slate-200 dark:bg-dark-700 w-1/4"></div>
                <div className="h-8 rounded-lg bg-slate-200 dark:bg-dark-700 w-1/4"></div>
                <div className="h-8 rounded-lg bg-slate-200 dark:bg-dark-700 w-1/4"></div>
              </div>
            )}

            {/* Основной контент */}
            <div
              className={`absolute ${
                tabLayout === "tabs" ? "top-10" : "top-0"
              } bottom-0 left-0 right-0 flex items-center justify-center bg-slate-50 dark:bg-dark-800`}
            >
              <div className="text-slate-400 dark:text-slate-600 text-sm">
                Контент
              </div>
            </div>

            {/* Док-бар (если выбрано) */}
            {tabLayout === "dock" && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-12 bg-white dark:bg-dark-800 rounded-xl shadow-lg flex items-center justify-around px-4">
                <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
                  <i className="fas fa-home text-white text-xs"></i>
                </div>
                <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-dark-700"></div>
                <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-dark-700"></div>
                <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-dark-700"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="settings-panel">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-image"></i> Обои
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-black dark:text-white">
            Прозрачность обоев
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={wallpaper.opacity}
            onChange={(e) => updateWallpaperOpacity(e.target.value)}
            className="w-full"
          />
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Текущая прозрачность: {Math.round(wallpaper.opacity * 100)}%
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-black dark:text-white">
            Сила размытия панелей
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={panelBlur}
            onChange={(e) => setPanelBlur(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Текущее размытие: {panelBlur}px
          </div>
        </div>

        <button
          className="w-full bg-primary-500 text-white p-4 rounded-xl hover:bg-primary-600 flex items-center justify-center gap-3"
          onClick={() => setShowWallpaperTab(true)}
        >
          <i className="fas fa-image"></i>
          <span>Открыть галерею обоев</span>
        </button>
      </div>

      <ThemePresets
        themePresets={themePresets}
        setThemePresets={setThemePresets}
        newPresetName={newPresetName}
        setNewPresetName={setNewPresetName}
        generateId={generateId}
        updatePresetName={updatePresetName}
        editingPresetId={editingPresetId}
        setEditingPresetId={setEditingPresetId}
        applyThemePreset={applyThemePreset}
        removeThemePreset={removeThemePreset}
        primaryColor={primaryColor}
        wallpaper={wallpaper}
        setWallpaper={setWallpaper}
        setPrimaryColor={setPrimaryColor}
      />

      <div className="settings-panel">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-palette"></i> Цветовая схема
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-black dark:text-white">
            Основной цвет
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="360"
              value={primaryColor.hue}
              onChange={(e) =>
                updatePrimaryColor(
                  e.target.value,
                  primaryColor.saturation,
                  primaryColor.lightness,
                )
              }
              className="w-full"
            />
            <div
              className="w-10 h-10 rounded-lg border border-slate-200 dark:border-dark-600"
              style={{
                backgroundColor: `hsl(${primaryColor.hue}, ${primaryColor.saturation}%, ${primaryColor.lightness}%)`,
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label className="block mb-2 text-black dark:text-white">
              Насыщенность
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={primaryColor.saturation}
              onChange={(e) =>
                updatePrimaryColor(
                  primaryColor.hue,
                  e.target.value,
                  primaryColor.lightness,
                )
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-2 text-black dark:text-white">
              Яркость
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={primaryColor.lightness}
              onChange={(e) =>
                updatePrimaryColor(
                  primaryColor.hue,
                  primaryColor.saturation,
                  e.target.value,
                )
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-end my-3 w-full">
          <button
            className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
            onClick={() => updatePrimaryColor(250, 79, 59)}
          >
            Сбросить
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-black dark:text-white">
              Цветовые пресеты
            </h3>
            <button
              className="flex items-center outline-none gap-2 text-sm bg-primary-500 text-white p-2 rounded-lg"
              onClick={() => {
                const newColorPreset = {
                  id: generateId(),
                  name: `Цвет ${colorPresets.length + 1}`,
                  hue: primaryColor.hue,
                  saturation: primaryColor.saturation,
                  lightness: primaryColor.lightness,
                  createdAt: new Date().toISOString(),
                };
                setColorPresets([...colorPresets, newColorPreset]);
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Добавить текущий</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {colorPresets.map((preset) => (
              <div key={preset.id} className="relative group">
                <button
                  className="w-full h-10 rounded-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)`,
                  }}
                  onClick={() =>
                    updatePrimaryColor(
                      preset.hue,
                      preset.saturation,
                      preset.lightness,
                    )
                  }
                  title={preset.name}
                ></button>

                <button
                  className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setColorPresets(
                      colorPresets.filter((p) => p.id !== preset.id),
                    );
                  }}
                  title="Удалить пресет"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-panel">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-search"></i> Поисковые системы
        </h2>

        <div className="mb-6">
          <h3 className="font-medium mb-3 text-black dark:text-white">
            Список поисковых систем
          </h3>
          <div className="space-y-3">
            {searchEngines.map((engine, index) => (
              <div
                key={index}
                onClick={() => setCurrentSearchEngine(engine)}
                className={`flex text-black dark:text-white cursor-pointer items-center justify-between p-3 rounded-xl ${
                  currentSearchEngine.name === engine.name
                    ? "bg-primary-500 text-white"
                    : "bg-slate-200 dark:bg-dark-700"
                }`}
              >
                <div>
                  <div className="font-medium">{engine.name}</div>
                </div>
                {searchEngines.length > 1 && (
                  <div className="flex">
                    <button
                      className="px-3 py-1 rounded-md bg-red-500 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearchEngine(index);
                      }}
                    >
                      <i className="fas fa-times text-md"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3 text-black dark:text-white">
            Добавить новую поисковую систему
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newSearchEngineName}
              onChange={(e) => setNewSearchEngineName(e.target.value)}
              placeholder="Название (например: MySearch)"
              className="p-3 rounded-xl bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
            />
            <input
              type="text"
              value={newSearchEngineUrl}
              onChange={(e) => setNewSearchEngineUrl(e.target.value)}
              placeholder="URL с %s (например: https://example.com/search?q=%s)"
              className="p-3 rounded-xl bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
            />
            <button
              className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600"
              onClick={handleAddSearchEngine}
            >
              Добавить поисковую систему
            </button>
          </div>
        </div>
      </div>

      <div className="settings-panel lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-black dark:text-white">
          <i className="fas fa-layer-group"></i> Группы сайтов
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          <button
            className="flex items-center gap-2 bg-primary-500 text-white p-3 px-4 rounded-xl hover:bg-primary-600"
            onClick={openAddGroupForm}
          >
            <i className="fas fa-plus"></i>
            <span>Добавить группу</span>
          </button>

          <button
            className="flex text-black dark:text-white items-center gap-2 bg-slate-200 dark:bg-dark-800 p-3 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-dark-700"
            onClick={() => setShowIconManager(true)}
          >
            <i className="fas fa-icons"></i>
            <span>Управление иконками</span>
          </button>
        </div>

        <div className="space-y-4">
          {siteGroups.map((group) => (
            <div
              key={group.id}
              className="p-4 rounded-xl bg-slate-100 dark:bg-dark-800 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-primary-500">
                  <i className={`fas fa-${group.icon} text-xl`}></i>
                  <h3 className="font-semibold text-black dark:text-white text-lg">
                    {group.name}
                  </h3>
                </div>

                <div className="flex mt-2 gap-2">
                  <button
                    className="flex text-black dark:text-white items-center justify-center p-2 w-8 h-8 rounded-lg bg-slate-200 dark:bg-dark-700 hover:bg-slate-300 dark:hover:bg-dark-700"
                    onClick={() => openEditGroupForm(group)}
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    className="flex items-center justify-center p-2 w-8 h-8 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    onClick={() => deleteGroup(group.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.sites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center gap-2 bg-white dark:bg-dark-700 dark:hover:bg-dark-800 px-3 py-2 rounded-lg cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-3 text-primary-500"
                      onClick={() => openEditSiteForm(site, group.id)}
                    >
                      <i className={`fas fa-${site.icon}`}></i>
                      <span className="text-black dark:text-white">
                        {site.name}
                      </span>
                    </div>
                    <div className="flex">
                      <button
                        className="flex items-center justify-center w-5 h-5 text-red-500 text-md"
                        onClick={() => deleteSite(site.id, group.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="flex items-center justify-center w-11 h-11 gap-2 text-sm bg-white dark:bg-dark-700 rounded-lg text-primary-500"
                  onClick={() => openAddSiteForm(group.id)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
