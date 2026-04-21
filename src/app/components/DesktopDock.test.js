import { render, screen } from "@testing-library/react";
import DesktopDock from "./DesktopDock";

describe("DesktopDock", () => {
  const defaultProps = {
    activeTab: "all",
    setActiveTab: jest.fn(),
    siteGroups: [
      { id: "group1", name: "Work", icon: "briefcase" },
      { id: "group2", name: "Social", icon: "users" },
    ],
    tabLayout: "dock",
    draggingSite: null,
    dragOverGroupId: null,
    dragOverSiteId: null,
    handleSiteDragStart: jest.fn(),
    handleSiteDragOver: jest.fn(),
    handleSiteDrop: jest.fn(),
    handleSiteDragEnd: jest.fn(),
    handleGroupDragStart: jest.fn(),
    handleGroupDragOver: jest.fn(),
    handleGroupDrop: jest.fn(),
    handleDragEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерится без ошибок", () => {
    const { container } = render(<DesktopDock {...defaultProps} />);
    expect(container.querySelector(".desktop-dock-bar")).toBeInTheDocument();
  });

  it("отображает dock контейнер", () => {
    const { container } = render(<DesktopDock {...defaultProps} />);
    expect(container.querySelector(".desktop-dock-container")).toBeInTheDocument();
  });

  it("имеет вкладку Все с активным состоянием", () => {
    const { container } = render(<DesktopDock {...defaultProps} />);
    const allTab = container.querySelector("#tab-all");
    expect(allTab).toBeInTheDocument();
    expect(allTab).toHaveClass("desktop-dock-tab-active");
  });

  it("имеет группу group1", () => {
    const { container } = render(<DesktopDock {...defaultProps} />);
    const groupTab = container.querySelector("#tab-group1");
    expect(groupTab).toBeInTheDocument();
  });
});