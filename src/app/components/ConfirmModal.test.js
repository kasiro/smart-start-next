import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "./ConfirmModal";

describe("ConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    message: "Вы уверены?",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится когда isOpen=true", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText("Вы уверены?")).toBeInTheDocument();
  });

  it("имеет кнопку подтверждения", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText("Да, уверен")).toBeInTheDocument();
  });

  it("имеет кнопку отмены", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText("Отмена")).toBeInTheDocument();
  });

  it("вызывает onConfirm при подтверждении", () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Да, уверен"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});