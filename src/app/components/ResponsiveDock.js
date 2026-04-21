"use client";

import { useState, useEffect } from "react";
import MobileDock from "./MobileDock";
import DesktopDock from "./DesktopDock";

export default function ResponsiveDock({
  activeTab,
  setActiveTab,
  siteGroups,
  tabLayout,
  dockItems,
  setDockItems,
  draggingItem,
  onContextMenu,
  dockPopupGroup,
  setDockPopupGroup,
  onSiteClick,
  isMobile,
}) {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDeviceType = () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        setDeviceType(isMobile ? 'mobile' : 'desktop');
      };

      checkDeviceType();
      window.addEventListener('resize', checkDeviceType);

      return () => {
        window.removeEventListener('resize', checkDeviceType);
      };
    }
  }, []);

  if (deviceType === 'mobile') {
    return (
      <MobileDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        siteGroups={siteGroups}
        tabLayout={tabLayout}
      />
    );
  } else if (deviceType === 'desktop') {
    return (
      <DesktopDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        siteGroups={siteGroups}
        dockItems={dockItems}
        setDockItems={setDockItems}
        draggingItem={draggingItem}
        onContextMenu={onContextMenu}
        dockPopupGroup={dockPopupGroup}
        setDockPopupGroup={setDockPopupGroup}
        onSiteClick={onSiteClick}
      />
    );
  } else {
    return null;
  }
}