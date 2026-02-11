"use client";

export default function WallpaperTab({
  onClose,
  wallpaper,
  setWallpaper,
  wallpapers,
  customWallpapers,
  addWallpaper,
  updateWallpaper,
  removeWallpaper,
  removeCustomWallpaper,
  setFullscreenWallpaper,
  setShowUrlModal,
  wallpaperUrl,
  setWallpaperUrl,
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto my-5 rounded-lg">
      <div className="min-h-screen bg_blur_5">
        <div className="sticky bg-white dark:bg-black-900 bg_blur_5 top-2 rounded-lg mt-2 m-4 z-10 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Галерея обоев
          </h1>
          <button className="p-2 text-black dark:text-white" onClick={onClose}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="mb-4 ml-2 flex gap-3 text-2xl font-bold text-black dark:text-white">
            <i className="fas fa-upload"></i>
            <h1>Загрузить</h1>
          </div>
          <div className="flex gap-3">
            <label
              htmlFor="wallpaperFileInput"
              className="flex-1 text-black dark:text-white flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-dark-800 hover:bg-white dark:hover:bg-dark-700 cursor-pointer"
            >
              <i className="fas fa-upload"></i>
              <span>с устройства</span>
              <input
                type="file"
                id="wallpaperFileInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    addWallpaper(file);
                    e.target.value = "";
                  }
                }}
              />
            </label>

            <button
              className="flex-1 text-black dark:text-white flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-300 dark:hover:bg-dark-700"
              onClick={() => setShowUrlModal(true)}
            >
              <i className="fas fa-link"></i>
              <span>по ссылке</span>
            </button>
            <button
              className="md:block text-black dark:text-white hidden flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-200 dark:bg-dark-800"
              onClick={() => updateWallpaper("none", "")}
            >
              <i className="fas fa-ban mr-2"></i>
              <span>Без обоев</span>
            </button>
          </div>
          <button
            className="flex-1 text-black dark:text-white md:hidden w-full mt-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-dark-800"
            onClick={() => updateWallpaper("none", "")}
          >
            <i className="fas fa-ban"></i>
            <span>Без обоев</span>
          </button>
        </div>

        <div className="wallpaper-gallery">
          {[...wallpapers, ...customWallpapers].map((wp, index) => (
            <div
              key={index}
              className="wallpaper-item rounded-xl relative group cursor-pointer"
              onClick={() => {
                // Проверяем, является ли эта обоина уже активной
                if (
                  wallpaper.type === wp.type &&
                  wallpaper.value === wp.value
                ) {
                  // Если обоина уже активна, просто закрываем галерею
                  onClose();
                } else {
                  // Если обоина неактивна, устанавливаем её и закрываем галерею
                  setFullscreenWallpaper(wp);
                  onClose();
                }
              }}
            >
              {wp.type === "image" ? (
                <img
                  src={wp.value}
                  alt={wp.name}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-dark-800">
                  <i className="fas fa-image text-3xl text-slate-400 dark:text-slate-600"></i>
                </div>
              )}

              {wallpaper.type === wp.type && wallpaper.value === wp.value && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-md">
                  Активно
                </div>
              )}

              <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-md justify-center items-center px-[6px] py-[2px]">
                {wp.isBase64 ? (
                  <i className="fas fa-upload text-white text-xs"></i>
                ) : (
                  <i className="fas fa-link text-white text-xs"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
