"use client";

import { useState, useEffect, useRef } from "react";
import { getIcon } from "../../lib/utils";

export default function DesktopDock({
  activeTab,
  setActiveTab,
  siteGroups,
  tabLayout,
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tooltipTab, setTooltipTab] = useState(null);
  const tooltipTimeoutRef = useRef(null);
  const moreMenuRef = useRef(null);

  const tabs = [
    { id: "all", name: "Все", icon: "bookmark" },
    ...siteGroups.map((group) => ({
      id: group.id,
      name: group.name,
      icon: group.icon,
    })),
  ];

  const maxVisibleTabs = 8; // Больше вкладок для десктопа
  const visibleTabs =
    tabs.length <= maxVisibleTabs ? tabs : tabs.slice(0, maxVisibleTabs - 1);
  const hiddenTabs =
    tabs.length <= maxVisibleTabs ? [] : tabs.slice(maxVisibleTabs - 1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Функция для отображения тултипа с задержкой
  const showTooltipWithDelay = (tabId) => {
    // Очищаем предыдущий таймер
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Устанавливаем таймер для отображения тултипа через 2.5 секунды
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipTab(tabId);
    }, 200);
  };

  // Функция для скрытия тултипа
  const hideTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltipTab(null);
  };

  const activeHiddenTab = hiddenTabs.find((tab) => tab.id === activeTab);

  const scrollTabIntoView = (tabId) => {
    const tabElement = document.getElementById(`tab-${tabId}`);
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

  return (
    <div
      className="desktop-dock-bar"
      onMouseEnter={() => {
        setIsHovered(true);
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
        setHoveredTab(null); // Сбрасываем hoveredTab при уходе мыши
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
            id={`tab-${tab.id}`}
            className={`desktop-dock-tab ${
              isHovered && (hoveredTab === tab.id || hoveredTab === null)
                ? "scale-110 macos-dock-tab-default"
                : ""
            } ${
              isHovered && hoveredTab === tab.id
                ? "scale-125 macos-dock-tab-hovered"
                : ""
            } ${
              activeTab === tab.id
                ? "desktop-dock-tab-active desktop-dock-tab-selected"
                : "desktop-dock-tab-inactive"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              scrollTabIntoView(tab.id);
            }}
            onMouseEnter={() => {
              setHoveredTab(tab.id);
              showTooltipWithDelay(tab.id);
            }}
            onMouseLeave={() => {
              hideTooltip();
            }}
          >
            <div className="desktop-dock-tab-icon">{getIcon(tab.icon)}</div>
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
              } ${
                hiddenTabs.some((tab) => tab.id === activeTab)
                  ? "desktop-dock-tab-active desktop-dock-tab-selected"
                  : "desktop-dock-tab-inactive"
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
                {hiddenTabs.some((tab) => tab.id === activeTab) ? (
                  <>
                    {getIcon(activeHiddenTab?.icon)}
                    {activeTab === activeHiddenTab?.id && (
                      <div className="desktop-dock-tab-title">
                        <span className="desktop-dock-tab-title-text">
                          {activeHiddenTab?.name}
                        </span>
                      </div>
                    )}
                    {tooltipTab === "more" && activeHiddenTab && (
                      <div className="desktop-dock-tab-tooltip">
                        <span className="desktop-dock-tab-tooltip-text">
                          {activeHiddenTab?.name}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <i className="fas fa-ellipsis-h"></i>
                    {tooltipTab === "more" && (
                      <div className="desktop-dock-tab-tooltip">
                        <span className="desktop-dock-tab-tooltip-text">
                          Дополнительные вкладки
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </button>

            {showMoreMenu && (
              <div className="desktop-dock-more-menu">
                {hiddenTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className="desktop-dock-more-item"
                    onClick={() => {
                      setActiveTab(tab.id);
                      scrollTabIntoView(tab.id);
                      setShowMoreMenu(false);
                    }}
                  >
                    {getIcon(tab.icon)}
                    <span className="text-black dark:text-white">
                      {tab.name}
                    </span>
                    {activeTab === tab.id && (
                      <i className="fas fa-check ml-auto text-primary-500"></i>
                    )}
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
