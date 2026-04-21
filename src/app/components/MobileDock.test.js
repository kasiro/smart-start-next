import { render, screen } from "@testing-library/react";
import MobileDock from "./MobileDock";

describe("MobileDock", () => {
  const defaultProps = {
    activeTab: "all",
    setActiveTab: jest.fn(),
    siteGroups: [
      { id: "group1", name: "Work", icon: "briefcase" },
      { id: "group2", name: "Social", icon: "users" },
    ],
    tabLayout: "dock",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится без ошибок", () => {
    const { container } = render(<MobileDock {...defaultProps} />);
    expect(container.querySelector(".dock-bar")).toBeInTheDocument();
  });
});