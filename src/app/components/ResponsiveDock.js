"use client";

import { useState, useEffect } from "react";
import MobileDock from "./MobileDock";
import DesktopDock from "./DesktopDock";

export default function ResponsiveDock({
  activeTab,
  setActiveTab,
  siteGroups,
  tabLayout,
  dockSites,
  setDockSites,
  draggingSite,
  dragOverGroupId,
  dragOverSiteId,
  handleSiteDragStart,
  handleSiteDragOver,
  handleSiteDrop,
  handleSiteDragEnd,
  handleGroupDragStart,
  handleGroupDragOver,
  handleGroupDrop,
  handleDragEnd,
  onContextMenu,
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
        tabLayout={tabLayout}
        dockSites={dockSites}
        setDockSites={setDockSites}
        draggingSite={draggingSite}
        dragOverGroupId={dragOverGroupId}
        dragOverSiteId={dragOverSiteId}
        handleSiteDragStart={handleSiteDragStart}
        handleSiteDragOver={handleSiteDragOver}
        handleSiteDrop={handleSiteDrop}
        handleSiteDragEnd={handleSiteDragEnd}
        handleGroupDragStart={handleGroupDragStart}
        handleGroupDragOver={handleGroupDragOver}
        handleGroupDrop={handleGroupDrop}
        handleDragEnd={handleDragEnd}
        isMobile={isMobile}
        onContextMenu={onContextMenu}
        setDockPopupGroup={setDockPopupGroup}
        onSiteClick={onSiteClick}
      />
    );
  } else {
    return null;
  }
}