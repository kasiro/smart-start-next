import { render, screen, fireEvent } from "@testing-library/react";
import ThemePresets from "./ThemePresets";

describe("ThemePresets", () => {
  const mockSetThemePresets = jest.fn();
  const mockSetNewPresetName = jest.fn();
  const mockSetEditingPresetId = jest.fn();
  const mockApplyThemePreset = jest.fn();
  const mockRemoveThemePreset = jest.fn();
  const mockUpdatePresetName = jest.fn();
  const mockSetWallpaper = jest.fn();
  const mockSetPrimaryColor = jest.fn();

  const defaultProps = {
    themePresets: [],
    setThemePresets: mockSetThemePresets,
    newPresetName: "",
    setNewPresetName: mockSetNewPresetName,
    generateId: () => Math.random().toString(36).substr(2, 9),
    editingPresetId: null,
    setEditingPresetId: mockSetEditingPresetId,
    applyThemePreset: mockApplyThemePreset,
    removeThemePreset: mockRemoveThemePreset,
    updatePresetName: mockUpdatePresetName,
    primaryColor: { hue: 220, saturation: 83, lightness: 61 },
    wallpaper: { type: "none", value: "" },
    setWallpaper: mockSetWallpaper,
    setPrimaryColor: mockSetPrimaryColor,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится без ошибок", () => {
    render(<ThemePresets {...defaultProps} />);
    expect(screen.getByText("Пресеты тем")).toBeInTheDocument();
  });

  it("отображает заголовок Создать новый пресет", () => {
    render(<ThemePresets {...defaultProps} />);
    expect(screen.getByText("Создать новый пресет")).toBeInTheDocument();
  });

  it("показывает кнопку создания", () => {
    render(<ThemePresets {...defaultProps} />);
    expect(screen.getByText("Создать")).toBeInTheDocument();
  });

  it("неактивна кнопка при пустом названии", () => {
    render(<ThemePresets {...defaultProps} />);
    const button = screen.getByText("Создать");
    expect(button).toBeDisabled();
  });
});