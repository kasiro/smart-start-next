import { render, screen, fireEvent } from "@testing-library/react";
import AlertModal from "./AlertModal";

describe("AlertModal", () => {
  const defaultProps = {
    isOpen: true,
    message: "Ошибка",
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится когда isOpen=true", () => {
    render(<AlertModal {...defaultProps} />);
    expect(screen.getByText("Ошибка")).toBeInTheDocument();
  });

  it("имеет кнопку OK", () => {
    render(<AlertModal {...defaultProps} />);
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("вызывает onClose при нажатии OK", () => {
    render(<AlertModal {...defaultProps} />);
    fireEvent.click(screen.getByText("OK"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});