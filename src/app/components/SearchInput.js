"use client";

import { useState, useEffect, useRef } from "react";

export default function SearchInput({
  searchHistory,
  onSearch,
  onAddToHistory,
  onRemoveFromHistory,
  placeholder = "Поиск в Google",
}) {
  const [inputValue, setInputValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    if (inputValue) {
      setFilteredHistory(
        searchHistory.filter((item) =>
          item.toLowerCase().includes(inputValue.toLowerCase()),
        ),
      );
    } else {
      setFilteredHistory(searchHistory);
    }
  }, [inputValue, searchHistory]);

  useEffect(() => {
    const handleFocus = () => {
      // Проверяем, является ли устройство мобильным
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const dockBar = document.querySelector(".dock-bar");

      // На мобильных устройствах не скрываем dock-панель
      if (dockBar && !isMobile) {
        dockBar.classList.add("dock-bar-hidden");
      }
    };

    const handleBlur = () => {
      const dockBar = document.querySelector(".dock-bar");
      if (dockBar) {
        dockBar.classList.remove("dock-bar-hidden");
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);

      return () => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onAddToHistory(inputValue);
      onSearch(inputValue);
      setShowHistory(false);
      setInputValue("");
    }
  };

  const selectFromHistory = (item) => {
    onSearch(item);
    setShowHistory(false);
    setInputValue("");
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteText = e.clipboardData.getData("text/plain");
    const { selectionStart, selectionEnd } = inputRef.current;
    const newValue =
      inputValue.substring(0, selectionStart) +
      pasteText +
      inputValue.substring(selectionEnd);
    setInputValue(newValue);
    setTimeout(() => {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        selectionStart + pasteText.length;
    }, 0);
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => {
            setShowHistory(true);
            setFocused(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowHistory(false), 100);
            setFocused(false);
          }}
          placeholder={placeholder}
          className="flex-1 bg_blur_5 py-3 px-4 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
        />
        <button
          onClick={() => {
            onAddToHistory(inputValue);
            onSearch(inputValue);
            setShowHistory(false);
            setInputValue("");
          }}
          className={`px-4 rounded-r-lg bg-primary-500 text-white outline-none ${focused ? "ring-2 ring-primary-500" : ""}`}
        >
          <i className="fas fa-search" />
        </button>
      </div>

      {showHistory && filteredHistory.length > 0 && (
        <div className="absolute z-10 w-full mt-[6px] bg_blur_5 rounded-lg shadow-lg border border-gray-200 dark:border-dark-600">
          <div className="py-1">
            <div
              className="px-4 py-1 cursor-pointer flex items-center justify-end"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (window.confirm("Очистить всю историю поиска?")) {
                  onRemoveFromHistory("all");
                }
              }}
            >
              <span className="truncate text-sm text-black dark:text-white">
                Очистить всю историю
              </span>
            </div>
            {filteredHistory.map((item, i) => (
              <div
                key={i}
                className="px-4 py-2 cursor-pointer flex items-center justify-between"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectFromHistory(item)}
              >
                <div className="">
                  <i className="far fa-clock text-gray-400 dark:text-gray-300 mr-2" />
                  <span className="truncate text-black dark:text-white">
                    {item}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromHistory(item);
                  }}
                >
                  <i className="fas fa-times mr-2 text-black dark:text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
