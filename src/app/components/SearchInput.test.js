import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  const mockOnSearch = jest.fn();
  const mockOnAddToHistory = jest.fn();
  const mockOnRemoveFromHistory = jest.fn();
  const mockShowConfirmModal = jest.fn();

  const defaultProps = {
    searchHistory: [],
    onSearch: mockOnSearch,
    onAddToHistory: mockOnAddToHistory,
    onRemoveFromHistory: mockOnRemoveFromHistory,
    placeholder: "Поиск в Google",
    showConfirmModal: mockShowConfirmModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится без ошибок", () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByPlaceholderText("Поиск в Google")).toBeInTheDocument();
  });

  it("отображает placeholder", () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByPlaceholderText("Поиск в Google")).toBeInTheDocument();
  });

  it("вызывает onSearch при нажатии Enter", () => {
    render(<SearchInput {...defaultProps} />);
    const input = screen.getByPlaceholderText("Поиск в Google");
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockOnSearch).toHaveBeenCalledWith("test query");
  });
});