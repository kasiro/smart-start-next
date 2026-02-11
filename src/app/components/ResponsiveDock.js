"use client";

import { useState, useEffect } from "react";
import MobileDock from "./MobileDock";
import DesktopDock from "./DesktopDock";

export default function ResponsiveDock({ activeTab, setActiveTab, siteGroups, tabLayout }) {
  const [deviceType, setDeviceType] = useState(null); // null на сервере

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

  // Показываем соответствующий компонент в зависимости от типа устройства
  if (deviceType === 'mobile') {
    return <MobileDock activeTab={activeTab} setActiveTab={setActiveTab} siteGroups={siteGroups} tabLayout={tabLayout} />;
  } else if (deviceType === 'desktop') {
    return <DesktopDock activeTab={activeTab} setActiveTab={setActiveTab} siteGroups={siteGroups} tabLayout={tabLayout} />;
  } else {
    // На сервере или до определения типа устройства не отображаем ничего
    return null;
  }
}
