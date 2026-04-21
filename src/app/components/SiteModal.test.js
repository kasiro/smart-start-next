import { render, screen, fireEvent } from "@testing-library/react";
import SiteModal from "./SiteModal";

describe("SiteModal", () => {
  const mockSetSiteForm = jest.fn();
  const mockSaveSite = jest.fn();
  const mockSetShowSiteModal = jest.fn();
  const mockSetShowIconManager = jest.fn();
  const mockOnIconSelect = jest.fn();
  const mockGetIcon = (icon) => <i className={`fas fa-${icon}`}></i>;

  const defaultProps = {
    siteForm: { name: "", url: "", icon: "globe" },
    setSiteForm: mockSetSiteForm,
    editingSite: null,
    saveSite: mockSaveSite,
    setShowSiteModal: mockSetShowSiteModal,
    setShowIconManager: mockSetShowIconManager,
    customIcons: ["globe", "star", "heart"],
    getIcon: mockGetIcon,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится", () => {
    render(<SiteModal {...defaultProps} />);
    expect(screen.getByText("Добавить сайт")).toBeInTheDocument();
  });

  it("имеет поле ввода названия", () => {
    render(<SiteModal {...defaultProps} />);
    expect(screen.getByPlaceholderText("Google")).toBeInTheDocument();
  });

  it("имеет поле ввода URL", () => {
    render(<SiteModal {...defaultProps} />);
    expect(screen.getByPlaceholderText("https://google.com")).toBeInTheDocument();
  });

  it("кнопка сохранения активна при заполненных данных", () => {
    render(<SiteModal {...defaultProps} siteForm={{ name: "Test", url: "https://test.com", icon: "globe" }} />);
    expect(screen.getByText("Сохранить")).toBeEnabled();
  });
});