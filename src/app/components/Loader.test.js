import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

describe("Loader", () => {
  it("рендерится без ошибок", () => {
    render(<Loader />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});