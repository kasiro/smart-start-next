"use client";

import { useState, useEffect, useRef } from "react";
import { getIcon } from "../../lib/utils";

export default function DesktopDock({
  activeTab,
  setActiveTab,
  siteGroups,
  tabLayout,
  dockSites,
  setDockSites,
  draggingSite,
  dragOverGroupId,
  handleSiteDragStart,
  handleSiteDragOver,
  handleSiteDrop,
  handleSiteDragEnd,
  handleGroupDragStart,
  handleGroupDragOver,
  handleGroupDrop,
  handleDragEnd,
  isMobile,
  onContextMenu,
  setDockPopupGroup,
  onSiteClick,
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [tooltipTab, setTooltipTab] = useState(null);
  const tooltipTimeoutRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Build tabs from dockSites (desktop only, show sites directly)
  const allSitesTab = { id: "all", name: "Все", icon: "bookmark", type: "all" };
  
  const tabs = dockSites.length > 0 
    ? [allSitesTab, ...dockSites.map(site => ({ ...site, type: "site" }))]
    : [allSitesTab];

  // Проверяем, есть ли хоть что-то в доке
  const hasDockContent = tabs.length > 1;

  // If no dock sites, show groups (for initial setup)
  const displayTabs = hasDockContent 
    ? tabs 
    : [
        { id: "all", name: "Все", icon: "bookmark" },
        ...siteGroups.map((group) => ({
          id: group.id,
          name: group.name,
          icon: group.icon,
        })),
      ];

  const maxVisibleTabs = 8;
  const visibleTabs =
    displayTabs.length <= maxVisibleTabs
      ? displayTabs
      : displayTabs.slice(0, maxVisibleTabs - 1);
  const hiddenTabs =
    displayTabs.length <= maxVisibleTabs ? [] : displayTabs.slice(maxVisibleTabs - 1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showTooltipWithDelay = (tabId) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipTab(tabId);
    }, 200);
  };

  const hideTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltipTab(null);
  };

  const scrollTabIntoView = (tabId) => {
    const tabElement = document.getElementById(`dock-tab-${tabId}`);
    if (!tabElement) return;

    const container = tabElement.parentElement;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tabElement.getBoundingClientRect();

    const isFullyVisible =
      tabRect.left >= containerRect.left &&
      tabRect.right <= containerRect.right;

    if (!isFullyVisible) {
      const scrollOptions = {
        left:
          tabElement.offsetLeft -
          container.offsetWidth / 2 +
          tabElement.offsetWidth / 2,
        behavior: "smooth",
      };

      container.scrollTo(scrollOptions);
    }
  };

  const handleTabClick = (tab) => {
    if (tab.type === "site") {
      // Open site directly
      onSiteClick(tab.url);
    } else if (tab.type === "all" || !hasDockContent) {
      // Switch to group
      setActiveTab(tab.id);
      scrollTabIntoView(tab.id);
    } else {
      // Open group popup
      setDockPopupGroup(tab);
    }
  };

  const handleRightClick = (e, tab) => {
    e.preventDefault();
    if (tab.type === "site" || !hasDockContent) {
      onContextMenu(e, tab, false);
    }
  };

  return (
    <div
      className="desktop-dock-bar"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredTab(null);
      }}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        transition: "all 0.3s ease",
      }}
    >
      <div className="desktop-dock-container">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            id={`dock-tab-${tab.id}`}
            className={`desktop-dock-tab ${
              isHovered && (hoveredTab === tab.id || hoveredTab === null)
                ? "scale-110 macos-dock-tab-default"
                : ""
            } ${
              isHovered && hoveredTab === tab.id
                ? "scale-125 macos-dock-tab-hovered"
                : ""
            } ${
              tab.type === "site" && tab.isActive
                ? "desktop-dock-tab-active desktop-dock-tab-selected"
                : tab.type === "all" || activeTab === tab.id
                ? "desktop-dock-tab-active desktop-dock-tab-selected"
                : "desktop-dock-tab-inactive"
            } ${
              dragOverGroupId === tab.id ? "border-2 border-primary-500" : ""
            }`}
            onClick={() => handleTabClick(tab)}
            onContextMenu={(e) => handleRightClick(e, tab)}
            onMouseEnter={() => {
              setHoveredTab(tab.id);
              showTooltipWithDelay(tab.id);
            }}
            onMouseLeave={() => {
              hideTooltip();
            }}
          >
            <div className="desktop-dock-tab-icon">
              {tab.type === "site" ? (
                <span className="text-lg">{getIcon(tab.icon)}</span>
              ) : (
                getIcon(tab.icon)
              )}
            </div>
            {tooltipTab === tab.id && (
              <div className="desktop-dock-tab-tooltip">
                <span className="desktop-dock-tab-tooltip-text">
                  {tab.type === "site" ? tab.name : tab.name}
                </span>
              </div>
            )}
          </button>
        ))}

        {hiddenTabs.length > 0 && (
          <div className="relative" ref={moreMenuRef}>
            <button
              className={`desktop-dock-tab ${
                isHovered && (hoveredTab === "more" || hoveredTab === null)
                  ? "scale-110 macos-dock-tab-default"
                  : ""
              } ${
                isHovered && hoveredTab === "more"
                  ? "scale-125 macos-dock-tab-hovered"
                  : ""
              }`}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              onMouseEnter={() => {
                setHoveredTab("more");
                showTooltipWithDelay("more");
              }}
              onMouseLeave={() => {
                hideTooltip();
              }}
            >
              <div className="desktop-dock-tab-icon">
                <i className="fas fa-ellipsis-h"></i>
              </div>
              {tooltipTab === "more" && (
                <div className="desktop-dock-tab-tooltip">
                  <span className="desktop-dock-tab-tooltip-text">
                    Дополнительные
                  </span>
                </div>
              )}
            </button>

            {showMoreMenu && (
              <div className="desktop-dock-more-menu">
                {hiddenTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className="desktop-dock-more-item"
                    onClick={() => {
                      handleTabClick(tab);
                      setShowMoreMenu(false);
                    }}
                    onContextMenu={(e) => handleRightClick(e, tab)}
                  >
                    {getIcon(tab.icon)}
                    <span className="text-black dark:text-white">
                      {tab.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}