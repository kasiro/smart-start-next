"use client";

import { useState, useEffect, useRef } from "react";
import { getIcon } from "../../lib/utils";

export default function DesktopDock({
  activeTab,
  setActiveTab,
  siteGroups,
  dockItems,
  setDockItems,
  draggingItem,
  setDraggingItem,
  onContextMenu,
  setDockPopupGroup,
  onSiteClick,
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [tooltipTab, setTooltipTab] = useState(null);
  const [dragOverItemId, setDragOverItemId] = useState(null);
  const tooltipTimeoutRef = useRef(null);
  const moreMenuRef = useRef(null);
  const dockRef = useRef(null);

  // Build tabs - "All" + dock items (both sites and groups)
  const allTab = { id: "all", name: "Все", icon: "bookmark", type: "all" };
  
  const tabs = dockItems.length > 0 
    ? [allTab, ...dockItems]
    : [allTab];

  const maxVisibleTabs = 8;
  const visibleTabs = tabs.length <= maxVisibleTabs ? tabs : tabs.slice(0, maxVisibleTabs - 1);
  const hiddenTabs = tabs.length <= maxVisibleTabs ? [] : tabs.slice(maxVisibleTabs - 1);

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
        left: tabElement.offsetLeft - container.offsetWidth / 2 + tabElement.offsetWidth / 2,
        behavior: "smooth",
      };
      container.scrollTo(scrollOptions);
    }
  };

  const handleTabClick = (tab) => {
    if (tab.type === "site") {
      onSiteClick(tab.url);
    } else if (tab.type === "group") {
      const group = siteGroups.find(g => g.id === tab.groupId);
      if (dockPopupGroup?.id === group?.id) {
        setDockPopupGroup(null);
      } else {
        setDockPopupGroup(group);
      }
    } else {
      setActiveTab(tab.id);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, itemId) => {
    e.preventDefault();
    if (draggingItem && draggingItem.id !== itemId) {
      setDragOverItemId(itemId);
    }
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggingItem || draggingItem.id === targetItem.id) return;

    const items = [...dockItems];
    const dragIndex = items.findIndex(i => i.id === draggingItem.id);
    const dropIndex = items.findIndex(i => i.id === targetItem.id);

    if (dragIndex !== -1 && dropIndex !== -1) {
      const [removed] = items.splice(dragIndex, 1);
      items.splice(dropIndex, 0, removed);
      setDockItems(items);
    }

    setDraggingItem(null);
    setDragOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragOverItemId(null);
  };

  const handleRightClick = (e, tab) => {
    e.preventDefault();
    onContextMenu(e, tab);
  };

  return (
    <div
      ref={dockRef}
      className="desktop-dock-bar"
      onMouseEnter={() => setIsHovered(true)}
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
              tab.id === "all" && activeTab === "all"
                ? "desktop-dock-tab-active desktop-dock-tab-selected"
                : "desktop-dock-tab-inactive"
            } ${
              dragOverItemId === tab.id ? "border-2 border-primary-500" : ""
            } ${
              draggingItem?.id === tab.id ? "opacity-50" : ""
            }`}
            draggable={tab.id !== "all" && tab.type !== "all"}
            onDragStart={(e) => tab.id !== "all" && tab.type !== "all" && handleDragStart(e, tab)}
            onDragOver={(e) => tab.id !== "all" && tab.type !== "all" && handleDragOver(e, tab)}
            onDrop={(e) => tab.id !== "all" && tab.type !== "all" && handleDrop(e, tab)}
            onDragEnd={handleDragEnd}
            onClick={() => handleTabClick(tab)}
            onContextMenu={(e) => handleRightClick(e, tab)}
            onMouseEnter={() => {
              setHoveredTab(tab.id);
              showTooltipWithDelay(tab.id);
            }}
            onMouseLeave={hideTooltip}
          >
            <div className="desktop-dock-tab-icon relative">
              {getIcon(tab.icon)}
              {tab.type === "group" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                  <i className="fas fa-folder text-[5px] text-white"></i>
                </div>
              )}
              {tab.type === "site" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                  <i className="fas fa-globe text-[5px] text-white"></i>
                </div>
              )}
            </div>
            {tooltipTab === tab.id && (
              <div className="desktop-dock-tab-tooltip">
                <span className="desktop-dock-tab-tooltip-text">
                  {tab.name}
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
              onMouseLeave={hideTooltip}
            >
              <div className="desktop-dock-tab-icon">
                <i className="fas fa-ellipsis-h"></i>
              </div>
              {tooltipTab === "more" && (
                <div className="desktop-dock-tab-tooltip">
                  <span className="desktop-dock-tab-tooltip-text">Дополнительные</span>
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
                    <span className="text-black dark:text-white">{tab.name}</span>
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