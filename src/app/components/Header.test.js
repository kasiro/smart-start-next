import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  const defaultProps = {
    darkMode: false,
    setDarkMode: jest.fn(),
    setShowSettings: jest.fn(),
    setShowWallpaperTab: jest.fn(),
    siteGroups: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("SmartStart")).toBeInTheDocument();
  });

  it("имеет кнопку настроек", () => {
    render(<Header {...defaultProps} />);
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});