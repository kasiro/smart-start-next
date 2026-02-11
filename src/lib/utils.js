export const compressImage = (
  base64,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.7,
) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };

    img.onerror = () => resolve(base64);
  });
};

export const checkStorageLimit = (additionalSize = 0) => {
  try {
    const currentSize = JSON.stringify(localStorage).length;
    const newSize = currentSize + additionalSize;
    const limit = 9.5 * 1024 * 1024; // 9.5 МБ

    return newSize < limit;
  } catch (e) {
    console.error("Ошибка проверки хранилища:", e);
    return false;
  }
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const getIcon = (iconName) => {
  if (iconName.startsWith("fab fa-")) {
    return <i className={`fab ${iconName.substring(4)}`}></i>;
  }
  return <i className={`fas fa-${iconName}`}></i>;
};

export const initializeLocalStorage = (setters) => {
  if (typeof window === "undefined") return;

  try {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode) setters.setDarkMode(JSON.parse(darkMode));

    const primaryColor = localStorage.getItem("primaryColor");
    if (primaryColor) setters.setPrimaryColor(JSON.parse(primaryColor));

    const wallpaper = localStorage.getItem("wallpaper");
    if (wallpaper) setters.setWallpaper(JSON.parse(wallpaper));

    const siteGroups = localStorage.getItem("siteGroups");
    if (siteGroups) setters.setSiteGroups(JSON.parse(siteGroups));

    const customIcons = localStorage.getItem("customIcons");
    if (customIcons) setters.setCustomIcons(JSON.parse(customIcons));

    const tabLayout = localStorage.getItem("tabLayout");
    if (tabLayout) setters.setTabLayout(JSON.parse(tabLayout));

    const searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) setters.setSearchHistory(JSON.parse(searchHistory));

    const panelBlur = localStorage.getItem("panelBlur");
    if (panelBlur) setters.setPanelBlur(parseInt(panelBlur));

    const wallpapers = localStorage.getItem("wallpapers");
    if (wallpapers) setters.setWallpapers(JSON.parse(wallpapers));

    const customWallpapers = localStorage.getItem("customWallpapers");
    if (customWallpapers)
      setters.setCustomWallpapers(JSON.parse(customWallpapers));

    const themePresets = localStorage.getItem("themePresets");
    if (themePresets) setters.setThemePresets(JSON.parse(themePresets));

    const searchEngines = localStorage.getItem("searchEngines");
    if (searchEngines) setters.setSearchEngines(JSON.parse(searchEngines));

    const currentSearchEngine = localStorage.getItem("currentSearchEngine");
    if (currentSearchEngine)
      setters.setCurrentSearchEngine(JSON.parse(currentSearchEngine));
  } catch (error) {
    console.error("Ошибка загрузки из localStorage:", error);
  }
};

export const updateCSSVariables = (primaryColor) => {
  const { hue, saturation, lightness } = primaryColor;

  document.documentElement.style.setProperty("--primary-hue", hue);
  document.documentElement.style.setProperty(
    "--primary-saturation",
    `${saturation}%`,
  );
  document.documentElement.style.setProperty(
    "--primary-lightness",
    `${lightness}%`,
  );

  // Устанавливаем акцентный цвет как основной цвет, но с немного увеличенной насыщенностью и яркостью
  // для лучшей видимости элементов интерфейса
  const accentSaturation = Math.min(saturation + 20, 100); // Увеличиваем насыщенность, но не больше 100%
  const accentLightness = Math.min(lightness + 10, 100); // Увеличиваем яркость, но не больше 100%

  document.documentElement.style.setProperty("--accent-hue", hue);
  document.documentElement.style.setProperty(
    "--accent-saturation",
    `${accentSaturation}%`,
  );
  document.documentElement.style.setProperty(
    "--accent-lightness",
    `${accentLightness}%`,
  );
};

export const updatePresetName = (presets, id, newName) => {
  return presets.map((preset) =>
    preset.id === id ? { ...preset, name: newName.trim() } : preset,
  );
};

export const applyThemePreset = (preset, setWallpaper, setPrimaryColor) => {
  setWallpaper(preset.wallpaper);
  setPrimaryColor(preset.primaryColor);
};

export const removeThemePreset = (presets, id) => {
  return presets.filter((p) => p.id !== id);
};
