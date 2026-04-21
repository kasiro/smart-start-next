"use client";

import { useEffect, useRef } from "react";

export default function ContextMenu({ x, y, onClose, children }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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

  // Position correction to stay in viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        menuRef.current.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > viewportHeight) {
        menuRef.current.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-dark-700 rounded-lg shadow-xl border border-slate-200 dark:border-dark-600 py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}

export const ContextMenuItem = ({ onClick, children, danger }) => {
  return (
    <button
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-600"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};