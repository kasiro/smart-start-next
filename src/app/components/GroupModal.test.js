import { render, screen, fireEvent } from "@testing-library/react";
import GroupModal from "./GroupModal";

describe("GroupModal", () => {
  const defaultProps = {
    groupForm: { name: "", icon: "globe" },
    setGroupForm: jest.fn(),
    editingGroup: null,
    saveGroup: jest.fn(),
    customIcons: ["globe", "star"],
    getIcon: (icon) => <i className={`fas fa-${icon}`}></i>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится", () => {
    render(<GroupModal {...defaultProps} />);
    expect(screen.getByText("Добавить группу")).toBeInTheDocument();
  });

  it("имеет поле ввода", () => {
    render(<GroupModal {...defaultProps} />);
    expect(screen.getByPlaceholderText("Мои сайты")).toBeInTheDocument();
  });

  it("кнопка сохранения активна", () => {
    render(<GroupModal {...defaultProps} groupForm={{ name: "Test Group", icon: "globe" }} />);
    expect(screen.getByText("Сохранить")).toBeEnabled();
  });
});