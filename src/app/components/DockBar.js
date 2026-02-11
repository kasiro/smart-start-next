"use client";

import { useState, useEffect, useRef } from "react";
import { getIcon } from "../../lib/utils";

export default function DockBar({
  activeTab,
  setActiveTab,
  siteGroups,
  tabLayout,
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const moreMenuRef = useRef(null);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const tabs = [
    { id: "all", name: "Все", icon: "bookmark" },
    ...siteGroups.map((group) => ({
      id: group.id,
      name: group.name,
      icon: group.icon,
    })),
  ];

  const maxVisibleTabs = 4;
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
      className="dock-bar"
      style={{
        // Используем position: fixed для всех устройств, чтобы dock bar всегда оставался на месте
        position: "fixed",
        bottom: "0",
        // Убираем margin-bottom, чтобы избежать проблем с безопасной зоной
        marginBottom: "0",
      }}
    >
      <div className="dock-container">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`dock-tab ${
              activeTab === tab.id ? "dock-tab-active" : "dock-tab-inactive"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              scrollTabIntoView(tab.id);
            }}
            title={tab.name}
          >
            {getIcon(tab.icon)}
            {activeTab === tab.id && (
              <span className="dock-tab-text text-black dark:text-white">
                {tab.name}
              </span>
            )}
          </button>
        ))}

        {hiddenTabs.length > 0 && (
          <div className="relative" ref={moreMenuRef}>
            <button
              className={`dock-tab ${
                hiddenTabs.some((tab) => tab.id === activeTab)
                  ? "dock-tab-active"
                  : "dock-tab-inactive"
              }`}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="Дополнительные вкладки"
            >
              {hiddenTabs.some((tab) => tab.id === activeTab) ? (
                <>
                  {getIcon(activeHiddenTab?.icon)}
                  <span className="dock-tab-text text-black dark:text-white">
                    {activeHiddenTab?.name}
                  </span>
                </>
              ) : (
                <i className="fas fa-bars"></i>
              )}
            </button>

            {showMoreMenu && (
              <div className="dock-more-menu">
                {hiddenTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className="dock-more-item"
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
