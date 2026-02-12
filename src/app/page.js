"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";
import ResponsiveDock from "./components/ResponsiveDock";
import Settings from "./components/Settings";
import WallpaperTab from "./components/WallpaperTab";
import MainContent from "./components/MainContent";
import WallpaperOverlay from "./components/WallpaperOverlay";
import IconManager from "./components/IconManager";
import GroupModal from "./components/GroupModal";
import SiteModal from "./components/SiteModal";
import FullscreenWallpaper from "./components/FullscreenWallpaper";
import {
  compressImage,
  checkStorageLimit,
  generateId,
  initializeLocalStorage,
  updateCSSVariables,
  updatePresetName,
  applyThemePreset,
  removeThemePreset,
} from "../lib/utils";
import {
  DEFAULT_ICONS,
  DEFAULT_WALLPAPERS,
  SEARCH_ENGINES,
  COLOR_PRESETS,
} from "../lib/constants";

export default function Home() {
  // Основные состояния
  const [activeTab, setActiveTab] = useState("all");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallpaperTab, setShowWallpaperTab] = useState(false);
  const [fullscreenWallpaper, setFullscreenWallpaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [tabLayout, setTabLayout] = useState("tabs");
  const [panelBlur, setPanelBlur] = useState(10);

  // Модальные окна
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showIconManager, setShowIconManager] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);

  // Редактирование
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newCustomIcon, setNewCustomIcon] = useState("");
  const [editingPresetId, setEditingPresetId] = useState(null);

  // Данные
  const [primaryColor, setPrimaryColor] = useState({
    hue: 250,
    saturation: 79,
    lightness: 59,
  });

  const [wallpaper, setWallpaper] = useState({
    type: "none",
    value: "",
    opacity: 0.1,
  });

  const [wallpapers, setWallpapers] = useState(DEFAULT_WALLPAPERS);
  const [customWallpapers, setCustomWallpapers] = useState([]);
  const [siteGroups, setSiteGroups] = useState([]);
  const [customIcons, setCustomIcons] = useState(DEFAULT_ICONS);
  const [hiddenCategories, setHiddenCategories] = useState([]);

  // Поисковые системы
  const [searchEngines, setSearchEngines] = useState(SEARCH_ENGINES);
  const [currentSearchEngine, setCurrentSearchEngine] = useState(
    SEARCH_ENGINES[0],
  );
  const [newSearchEngineName, setNewSearchEngineName] = useState("");
  const [newSearchEngineUrl, setNewSearchEngineUrl] = useState("");

  // Тематические пресеты
  const [themePresets, setThemePresets] = useState([]);
  const [newPresetName, setNewPresetName] = useState("");

  // Цветовые пресеты
  const [colorPresets, setColorPresets] = useState(COLOR_PRESETS);

  // Drag & Drop
  const [draggingSite, setDraggingSite] = useState(null);
  const [dragOverGroupId, setDragOverGroupId] = useState(null);
  const [dragOverSiteId, setDragOverSiteId] = useState(null);
  const [draggingGroupId, setDraggingGroupId] = useState(null);

  // Формы
  const [groupForm, setGroupForm] = useState({
    name: "",
    icon: "globe",
  });

  const [siteForm, setSiteForm] = useState({
    name: "",
    url: "",
    icon: "globe",
  });

  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [importExportStatus, setImportExportStatus] = useState(null);

  // Инициализация
  useEffect(() => {
    initializeLocalStorage({
      setDarkMode,
      setPrimaryColor,
      setWallpaper,
      setSiteGroups,
      setCustomIcons,
      setTabLayout,
      setSearchHistory,
      setPanelBlur,
      setSearchEngines,
      setCurrentSearchEngine,
      setWallpapers,
      setCustomWallpapers,
      setHiddenCategories,
      setThemePresets,
      setColorPresets,
    });
  }, []);

  // Обновление времени
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setCurrentDate(
        now.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        }),
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Обновление темы
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Обновление CSS переменных цвета
  useEffect(() => {
    updateCSSVariables(primaryColor);
    localStorage.setItem("primaryColor", JSON.stringify(primaryColor));
  }, [primaryColor]);

  // Обновление размытия
  useEffect(() => {
    localStorage.setItem("panelBlur", panelBlur.toString());
    document.documentElement.style.setProperty(
      "--panel-blur",
      `${panelBlur}px`,
    );
  }, [panelBlur]);

  // Сохранение данных
  useEffect(() => {
    localStorage.setItem("siteGroups", JSON.stringify(siteGroups));
    localStorage.setItem("customIcons", JSON.stringify(customIcons));
    localStorage.setItem("tabLayout", JSON.stringify(tabLayout));
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    localStorage.setItem("searchEngines", JSON.stringify(searchEngines));
    localStorage.setItem(
      "currentSearchEngine",
      JSON.stringify(currentSearchEngine),
    );
    localStorage.setItem("wallpapers", JSON.stringify(wallpapers));
    localStorage.setItem("customWallpapers", JSON.stringify(customWallpapers));
    localStorage.setItem("hiddenCategories", JSON.stringify(hiddenCategories));
    localStorage.setItem("themePresets", JSON.stringify(themePresets));
    localStorage.setItem("colorPresets", JSON.stringify(colorPresets));
    localStorage.setItem("wallpaper", JSON.stringify(wallpaper));
  }, [
    siteGroups,
    customIcons,
    tabLayout,
    searchHistory,
    searchEngines,
    currentSearchEngine,
    wallpapers,
    customWallpapers,
    hiddenCategories,
    themePresets,
    colorPresets,
    wallpaper,
  ]);

  // Функции для работы с цветом
  const updatePrimaryColor = (hue, saturation, lightness) => {
    setPrimaryColor({
      hue: parseInt(hue),
      saturation: parseInt(saturation),
      lightness: parseInt(lightness),
    });
  };

  // Функции для работы с обоями
  const updateWallpaper = (type, value) => {
    setWallpaper({
      type,
      value,
      opacity: wallpaper.opacity,
    });
  };

  const updateWallpaperOpacity = (opacity) => {
    setWallpaper({
      ...wallpaper,
      opacity: parseFloat(opacity),
    });
  };

  const addWallpaper = async (fileOrUrl) => {
    if (fileOrUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        const compressedBase64 = await compressImage(base64);

        const newWallpaper = {
          name: `Пользовательские обои ${customWallpapers.length + 1}`,
          type: "image",
          value: compressedBase64,
          isBase64: true,
          size: compressedBase64.length,
          compressed: true,
        };

        if (!checkStorageLimit(newWallpaper.size)) {
          setImportExportStatus(
            "Недостаточно места в хранилище. Удалите некоторые обои или уменьшите их качество.",
          );
          setTimeout(() => setImportExportStatus(null), 5000);
          return;
        }

        setCustomWallpapers([...customWallpapers, newWallpaper]);
        updateWallpaper("image", compressedBase64);
      };
      reader.readAsDataURL(fileOrUrl);
    } else if (typeof fileOrUrl === "string") {
      if (fileOrUrl.trim() === "") return;

      if (fileOrUrl.startsWith("data:image")) {
        const newWallpaper = {
          name: `Пользовательские обои ${customWallpapers.length + 1}`,
          type: "image",
          value: fileOrUrl,
          isBase64: true,
          size: fileOrUrl.length,
        };

        if (!checkStorageLimit(newWallpaper.size)) {
          setImportExportStatus(
            "Недостаточно места в хранилище. Удалите некоторые обои.",
          );
          setTimeout(() => setImportExportStatus(null), 5000);
          return;
        }

        setCustomWallpapers([...customWallpapers, newWallpaper]);
        updateWallpaper("image", fileOrUrl);
      } else {
        const newWallpaper = {
          name: `Пользовательские обои ${customWallpapers.length + 1}`,
          type: "image",
          value: fileOrUrl.trim(),
          isBase64: false,
          size: 0,
        };
        setCustomWallpapers([...customWallpapers, newWallpaper]);
        updateWallpaper("image", fileOrUrl.trim());
      }
    }
  };

  const removeWallpaper = (index) => {
    const newWallpapers = [...wallpapers];
    newWallpapers.splice(index, 1);
    setWallpapers(newWallpapers);

    if (
      wallpaper.type === "image" &&
      wallpaper.value === wallpapers[index].value
    ) {
      updateWallpaper("none", "");
    }
  };

  const removeCustomWallpaper = (index) => {
    const newWallpapers = [...customWallpapers];
    newWallpapers.splice(index, 1);
    setCustomWallpapers(newWallpapers);

    if (
      wallpaper.type === "image" &&
      wallpaper.value === customWallpapers[index].value
    ) {
      updateWallpaper("none", "");
    }
  };

  // Функции для работы с группами и сайтами
  const openAddGroupForm = () => {
    setGroupForm({
      name: "",
      icon: "globe",
    });
    setEditingGroup(null);
    setShowGroupModal(true);
  };

  const openEditGroupForm = (group) => {
    setGroupForm({
      name: group.name,
      icon: group.icon,
    });
    setEditingGroup(group);
    setShowGroupModal(true);
  };

  const saveGroup = () => {
    if (!groupForm.name.trim()) return;

    if (editingGroup) {
      setSiteGroups(
        siteGroups.map((g) =>
          g.id === editingGroup.id ? { ...g, ...groupForm } : g,
        ),
      );
    } else {
      const newGroup = {
        id: generateId(),
        ...groupForm,
        sites: [],
      };
      setSiteGroups([...siteGroups, newGroup]);
    }

    setShowGroupModal(false);
  };

  const deleteGroup = (groupId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту группу?")) {
      setSiteGroups(siteGroups.filter((g) => g.id !== groupId));
      if (activeTab === groupId) setActiveTab("all");
    }
  };

  const openAddSiteForm = (groupId) => {
    setSiteForm({
      name: "",
      url: "",
      icon: "globe",
    });
    setEditingSite(null);
    setSelectedGroup(groupId);
    setShowSiteModal(true);
  };

  const openEditSiteForm = (site, groupId) => {
    setSiteForm({
      name: site.name,
      url: site.url,
      icon: site.icon,
    });
    setEditingSite(site);
    setSelectedGroup(groupId);
    setShowSiteModal(true);
  };

  const saveSite = () => {
    if (!siteForm.name.trim() || !siteForm.url.trim()) return;

    const groupIndex = siteGroups.findIndex((g) => g.id === selectedGroup);
    if (groupIndex === -1) return;

    const updatedGroups = [...siteGroups];

    if (editingSite) {
      updatedGroups[groupIndex].sites = updatedGroups[groupIndex].sites.map(
        (s) => (s.id === editingSite.id ? { ...s, ...siteForm } : s),
      );
    } else {
      const newSite = {
        id: generateId(),
        ...siteForm,
      };
      updatedGroups[groupIndex].sites = [
        ...updatedGroups[groupIndex].sites,
        newSite,
      ];
    }

    setSiteGroups(updatedGroups);
    setShowSiteModal(false);
  };

  const deleteSite = (siteId, groupId) => {
    if (confirm("Вы уверены, что хотите удалить этот сайт?")) {
      setSiteGroups(
        siteGroups.map((g) =>
          g.id === groupId
            ? { ...g, sites: g.sites.filter((s) => s.id !== siteId) }
            : g,
        ),
      );
    }
  };

  const handleSiteClick = (url) => {
    window.open(url, "_blank");
  };

  // Функции для иконок
  const getIcon = (iconName) => {
    if (iconName.startsWith("fab fa-")) {
      return <i className={`fab ${iconName.substring(4)}`}></i>;
    }
    return <i className={`fas fa-${iconName}`}></i>;
  };

  const addCustomIcon = () => {
    if (!newCustomIcon.trim()) return;

    if (![...DEFAULT_ICONS, ...customIcons].includes(newCustomIcon.trim())) {
      setCustomIcons([...customIcons, newCustomIcon.trim()]);
      setNewCustomIcon("");
    } else {
      alert("Эта иконка уже существует");
    }
  };

  const removeCustomIcon = (icon) => {
    const updatedCustomIcons = customIcons.filter((i) => i !== icon);
    setCustomIcons(updatedCustomIcons);
  };

  // Функции для поиска
  const handleSearch = (query) => {
    if (query.trim() === "") return;

    const encodedQuery = encodeURIComponent(query.trim());
    const searchUrl = currentSearchEngine.url.replace("%s", encodedQuery);

    window.open(searchUrl, "_blank");
    setSearchQuery("");
  };

  const handleAddToHistory = (query) => {
    if (!query.trim()) return;
    const updatedHistory = [
      query.trim(),
      ...searchHistory.filter(
        (item) => item.toLowerCase() !== query.trim().toLowerCase(),
      ),
    ].slice(0, 20);
    setSearchHistory(updatedHistory);
  };

  const handleRemoveFromHistory = (query) => {
    if (query === "all") {
      setSearchHistory([]);
    } else {
      setSearchHistory([
        ...searchHistory.filter(
          (item) => item.toLowerCase() !== query.trim().toLowerCase(),
        ),
      ]);
    }
  };

  // Функции для Drag & Drop
  const handleSiteDragStart = (e, site, groupId) => {
    setDraggingSite({ ...site, sourceGroupId: groupId });
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ site, sourceGroupId: groupId }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSiteDragOver = (e, groupId, siteId = null) => {
    e.preventDefault();
    setDragOverGroupId(groupId);
    setDragOverSiteId(siteId);

    const group = siteGroups.find((g) => g.id === groupId);
    if (group && group.sites.length === 0) {
      setDragOverSiteId("empty-group-drop");
    }
  };

  const handleSiteDragEnd = () => {
    setDraggingSite(null);
    setDragOverGroupId(null);
    setDragOverSiteId(null);
  };

  const handleSiteDrop = (e, targetGroupId, targetSiteId = null) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("text/plain");
    let siteData;

    try {
      siteData = JSON.parse(data);
    } catch (e) {
      if (!draggingSite) return;
      siteData = draggingSite;
    }

    const { sourceGroupId, site } = siteData;

    if (targetSiteId === "empty-group-drop") {
      targetSiteId = null;
    }

    if (sourceGroupId === targetGroupId) {
      const updatedGroups = [...siteGroups];
      const groupIndex = updatedGroups.findIndex((g) => g.id === targetGroupId);
      const sites = [...updatedGroups[groupIndex].sites];

      const fromIndex = sites.findIndex((s) => s.id === site.id);
      let toIndex = sites.length;

      if (targetSiteId) {
        toIndex = sites.findIndex((s) => s.id === targetSiteId);
      }

      if (fromIndex !== toIndex && fromIndex !== -1) {
        const [movedSite] = sites.splice(fromIndex, 1);

        if (toIndex > fromIndex) {
          toIndex--;
        }

        sites.splice(toIndex, 0, movedSite);

        updatedGroups[groupIndex].sites = sites;
        setSiteGroups(updatedGroups);
      }
    } else {
      const updatedGroups = [...siteGroups];

      const sourceGroupIndex = updatedGroups.findIndex(
        (g) => g.id === sourceGroupId,
      );
      updatedGroups[sourceGroupIndex].sites = updatedGroups[
        sourceGroupIndex
      ].sites.filter((s) => s.id !== site.id);

      const targetGroupIndex = updatedGroups.findIndex(
        (g) => g.id === targetGroupId,
      );
      let targetIndex = updatedGroups[targetGroupIndex].sites.length;

      if (targetSiteId) {
        targetIndex = updatedGroups[targetGroupIndex].sites.findIndex(
          (s) => s.id === targetSiteId,
        );
      }

      updatedGroups[targetGroupIndex].sites.splice(targetIndex, 0, site);
      setSiteGroups(updatedGroups);
    }

    setDraggingSite(null);
    setDragOverGroupId(null);
    setDragOverSiteId(null);
  };

  const handleDragStart = (e, groupId) => {
    setDraggingGroupId(groupId);
    e.dataTransfer.setData("text/plain", groupId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, groupId) => {
    e.preventDefault();
    if (draggingGroupId !== groupId) {
      setDragOverGroupId(groupId);
    }
  };

  const handleDragEnd = () => {
    setDraggingGroupId(null);
    setDragOverGroupId(null);
  };

  const handleDrop = (e, targetGroupId) => {
    e.preventDefault();
    if (draggingGroupId && draggingGroupId !== targetGroupId) {
      const groups = [...siteGroups];
      const dragIndex = groups.findIndex((g) => g.id === draggingGroupId);
      const dropIndex = groups.findIndex((g) => g.id === targetGroupId);

      const [movedGroup] = groups.splice(dragIndex, 1);
      groups.splice(dropIndex, 0, movedGroup);

      setSiteGroups(groups);
    }
    setDragOverGroupId(null);
  };

  // Функции для поисковых систем
  const addSearchEngine = () => {
    if (!newSearchEngineName.trim() || !newSearchEngineUrl.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    if (!newSearchEngineUrl.includes("%s")) {
      alert("URL должен содержать %s для подстановки запроса");
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

  const removeSearchEngine = (index) => {
    if (searchEngines.length <= 1) {
      alert("Должна остаться хотя бы одна поисковая система");
      return;
    }

    const newEngines = [...searchEngines];
    newEngines.splice(index, 1);
    setSearchEngines(newEngines);

    if (currentSearchEngine.name === searchEngines[index].name) {
      setCurrentSearchEngine(newEngines[0]);
    }
  };

  // Функции для категорий
  const toggleCategoryVisibility = (groupId) => {
    if (hiddenCategories.includes(groupId)) {
      setHiddenCategories(hiddenCategories.filter((id) => id !== groupId));
    } else {
      setHiddenCategories([...hiddenCategories, groupId]);
    }
  };

  // Очистка старых данных
  const cleanupOldData = () => {
    try {
      if (customWallpapers.length > 10) {
        setCustomWallpapers(customWallpapers.slice(-10));
      }

      if (themePresets.length > 5) {
        setThemePresets(themePresets.slice(-5));
      }

      if (searchHistory.length > 20) {
        setSearchHistory(searchHistory.slice(-20));
      }
    } catch (error) {
      console.error("Ошибка очистки данных:", error);
    }
  };

  // Основной рендер
  return (
    <>
      <WallpaperOverlay wallpaper={wallpaper} darkMode={darkMode} />

      <div
        className="max-w-6xl mx-auto p-5"
        style={{
          minHeight: "100vh",
        }}
      >
        {showWallpaperTab ? (
          <WallpaperTab
            onClose={() => setShowWallpaperTab(false)}
            wallpaper={wallpaper}
            setWallpaper={setWallpaper}
            wallpapers={wallpapers}
            customWallpapers={customWallpapers}
            addWallpaper={addWallpaper}
            updateWallpaper={updateWallpaper}
            removeWallpaper={removeWallpaper}
            removeCustomWallpaper={removeCustomWallpaper}
            setFullscreenWallpaper={setFullscreenWallpaper}
            setShowUrlModal={setShowUrlModal}
            wallpaperUrl={wallpaperUrl}
            setWallpaperUrl={setWallpaperUrl}
          />
        ) : showSettings ? (
          <Settings
            onClose={() => setShowSettings(false)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            wallpaper={wallpaper}
            setWallpaper={setWallpaper}
            siteGroups={siteGroups}
            setSiteGroups={setSiteGroups}
            customIcons={customIcons}
            setCustomIcons={setCustomIcons}
            tabLayout={tabLayout}
            setTabLayout={setTabLayout}
            setShowWallpaperTab={setShowWallpaperTab}
            panelBlur={panelBlur}
            setPanelBlur={setPanelBlur}
            searchEngines={searchEngines}
            setSearchEngines={setSearchEngines}
            currentSearchEngine={currentSearchEngine}
            setCurrentSearchEngine={setCurrentSearchEngine}
            colorPresets={colorPresets}
            setColorPresets={setColorPresets}
            updatePrimaryColor={updatePrimaryColor}
            updateWallpaperOpacity={updateWallpaperOpacity}
            generateId={generateId}
            addSearchEngine={addSearchEngine}
            removeSearchEngine={removeSearchEngine}
            openAddGroupForm={openAddGroupForm}
            openEditGroupForm={openEditGroupForm}
            deleteGroup={deleteGroup}
            setShowIconManager={setShowIconManager}
            openEditSiteForm={openEditSiteForm}
            deleteSite={deleteSite}
            openAddSiteForm={openAddSiteForm}
            themePresets={themePresets}
            setThemePresets={setThemePresets}
            newPresetName={newPresetName}
            setNewPresetName={setNewPresetName}
            updatePresetName={updatePresetName}
            editingPresetId={editingPresetId}
            setEditingPresetId={setEditingPresetId}
            applyThemePreset={applyThemePreset}
            removeThemePreset={removeThemePreset}
            wallpapers={wallpapers}
            setWallpapers={setWallpapers}
            customWallpapers={customWallpapers}
            setCustomWallpapers={setCustomWallpapers}
            setWallpaper={setWallpaper}
            setPrimaryColor={setPrimaryColor}
          />
        ) : (
          <>
            <Header
              currentTime={currentTime}
              currentDate={currentDate}
              onSettingsClick={() => setShowSettings(true)}
            />

            <div className="mb-6">
              <div className="flex items-center rounded-lg shadow-lg search-container">
                <SearchInput
                  onSearch={handleSearch}
                  searchHistory={searchHistory}
                  onAddToHistory={handleAddToHistory}
                  onRemoveFromHistory={handleRemoveFromHistory}
                  placeholder={`Поиск в ${currentSearchEngine.name}`}
                />
              </div>
            </div>

            <div className="flex flex-col min-h-[100%]">
              <MainContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                siteGroups={siteGroups}
                setSiteGroups={setSiteGroups}
                tabLayout={tabLayout}
                customIcons={customIcons}
                openAddSiteForm={openAddSiteForm}
                openEditSiteForm={openEditSiteForm}
                deleteSite={deleteSite}
                handleSiteClick={handleSiteClick}
                draggingSite={draggingSite}
                dragOverGroupId={dragOverGroupId}
                dragOverSiteId={dragOverSiteId}
                handleSiteDragStart={handleSiteDragStart}
                handleSiteDragOver={handleSiteDragOver}
                handleSiteDragEnd={handleSiteDragEnd}
                handleSiteDrop={handleSiteDrop}
                hiddenCategories={hiddenCategories}
                toggleCategoryVisibility={toggleCategoryVisibility}
                openAddGroupForm={openAddGroupForm}
              />

              {tabLayout === "dock" && siteGroups.length > 0 && (
                <ResponsiveDock
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  siteGroups={siteGroups}
                  tabLayout={tabLayout}
                />
              )}
            </div>
          </>
        )}

        {fullscreenWallpaper && (
          <FullscreenWallpaper
            wallpaper={wallpaper}
            fullscreenWallpaper={fullscreenWallpaper}
            setFullscreenWallpaper={setFullscreenWallpaper}
            updateWallpaper={updateWallpaper}
            removeWallpaper={removeWallpaper}
            removeCustomWallpaper={removeCustomWallpaper}
            wallpapers={wallpapers}
            customWallpapers={customWallpapers}
          />
        )}

        {showGroupModal && (
          <GroupModal
            groupForm={groupForm}
            setGroupForm={setGroupForm}
            editingGroup={editingGroup}
            saveGroup={saveGroup}
            setShowGroupModal={setShowGroupModal}
            setShowIconManager={setShowIconManager}
            customIcons={customIcons}
            getIcon={getIcon}
          />
        )}

        {showSiteModal && (
          <SiteModal
            siteForm={siteForm}
            setSiteForm={setSiteForm}
            editingSite={editingSite}
            saveSite={saveSite}
            setShowSiteModal={setShowSiteModal}
            setShowIconManager={setShowIconManager}
            customIcons={customIcons}
            getIcon={getIcon}
          />
        )}

        {showIconManager && (
          <IconManager
            newCustomIcon={newCustomIcon}
            setNewCustomIcon={setNewCustomIcon}
            addCustomIcon={addCustomIcon}
            customIcons={customIcons}
            removeCustomIcon={removeCustomIcon}
            setShowIconManager={setShowIconManager}
            getIcon={getIcon}
          />
        )}

        {showUrlModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="settings-panel w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Добавить обои по URL
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1">URL изображения</label>
                  <input
                    type="text"
                    value={wallpaperUrl}
                    onChange={(e) => setWallpaperUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-dark-700 hover:bg-slate-300 dark:hover:bg-dark-700"
                    onClick={() => {
                      setShowUrlModal(false);
                      setWallpaperUrl("");
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
                    onClick={() => {
                      if (wallpaperUrl.trim() !== "") {
                        addWallpaper(wallpaperUrl.trim());
                        setShowUrlModal(false);
                        setWallpaperUrl("");
                      }
                    }}
                    disabled={!wallpaperUrl.trim()}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
