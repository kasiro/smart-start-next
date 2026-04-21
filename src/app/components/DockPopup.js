"use client";

import { useEffect, useRef } from "react";
import { getIcon } from "../../lib/utils";

export default function DockPopup({ group, siteGroups, onClose, onSiteClick, triggerRef }) {
  const popupRef = useRef(null);
  const currentGroup = siteGroups.find((g) => g.id === group?.id);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!group) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-40 bg-white dark:bg-dark-700 rounded-[20px] shadow-2xl border border-slate-200 dark:border-dark-600 p-3"
      style={{
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "90vw",
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary-500">{getIcon(group.icon)}</span>
        <h3 className="font-semibold text-black dark:text-white">{group.name}</h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {currentGroup?.sites.map((site) => (
          <button
            key={site.id}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors"
            onClick={() => {
              onSiteClick(site.url);
              onClose();
            }}
          >
            <div className="w-10 h-10 rounded-xl text-primary-500 bg-accent bg-opacity-20 flex items-center justify-center">
              <span className="text-lg">{getIcon(site.icon)}</span>
            </div>
            <span className="text-xs text-center text-black dark:text-white truncate max-w-full">
              {site.name}
            </span>
          </button>
        ))}
      </div>

      {(!currentGroup?.sites || currentGroup.sites.length === 0) && (
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
          Нет сайтов в этой группе
        </p>
      )}
    </div>
  );
}