import { useEffect } from "react";

// Компонент для установки начальных стилей до полной загрузки приложения
const InitialStyles = () => {
  useEffect(() => {
    // Чтение начальных данных из localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    const storedPrimaryColor = localStorage.getItem("primaryColor");

    let darkMode = false;
    let primaryColor = { hue: 250, saturation: 79, lightness: 59 };

    if (storedDarkMode) {
      darkMode = JSON.parse(storedDarkMode);
    }

    if (storedPrimaryColor) {
      primaryColor = JSON.parse(storedPrimaryColor);
    }

    // Установка начальных CSS-переменных
    const root = document.documentElement;
    root.style.setProperty("--primary-hue", primaryColor.hue);
    root.style.setProperty(
      "--primary-saturation",
      `${primaryColor.saturation}%`,
    );
    root.style.setProperty("--primary-lightness", `${primaryColor.lightness}%`);

    // Установка темы
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  return null;
};

export default InitialStyles;
