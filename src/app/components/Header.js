"use client";

export default function Header({ currentTime, currentDate, onSettingsClick }) {
  return (
    <header className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 py-5 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
          <i className="fas fa-rocket text-white dark:text-white"></i>
        </div>
        <h1 className="text-2xl font-bold text-primary-500 dark:text-white">
          SmartStart
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="panel rounded-xl px-6 py-3 no-select">
          <div className="flex items-center gap-5">
            <div className="text-2xl font-semibold tracking-tight text-black dark:text-white">
              {currentTime}
            </div>
            <div className="text-lg font-medium text-black dark:text-white">
              {currentDate}
            </div>
          </div>
        </div>

        <button
          className="text-black dark:text-white flex items-center justify-center py-3 px-4 rounded-xl panel dark:hover:bg-dark-700"
          onClick={onSettingsClick}
        >
          <i className="fas fa-cog text-xl"></i>
        </button>
      </div>
    </header>
  );
}
