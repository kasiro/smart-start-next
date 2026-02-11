"use client";

export default function SiteModal({
  siteForm,
  setSiteForm,
  editingSite,
  saveSite,
  setShowSiteModal,
  setShowIconManager,
  customIcons,
  getIcon,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
      <div className="settings-panel w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          {editingSite ? "Редактировать сайт" : "Добавить сайт"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-black dark:text-white">
              Название сайта
            </label>
            <input
              type="text"
              value={siteForm.name}
              onChange={(e) =>
                setSiteForm({ ...siteForm, name: e.target.value })
              }
              className="w-full text-black dark:text-white p-3 rounded-xl bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
              placeholder="Google"
            />
          </div>

          <div>
            <label className="block mb-1 text-black dark:text-white">
              URL сайта
            </label>
            <input
              type="text"
              value={siteForm.url}
              onChange={(e) =>
                setSiteForm({ ...siteForm, url: e.target.value })
              }
              className="w-full text-black dark:text-white p-3 rounded-xl bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
              placeholder="https://google.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-black dark:text-white">Иконка сайта</label>
              <button
                className="text-sm p-2 bg-slate-100 dark:bg-dark-800 rounded-lg text-black dark:text-white font-medium"
                onClick={() => {
                  setShowSiteModal(false);
                  setShowIconManager(true);
                }}
              >
                Управление иконками
              </button>
            </div>
            <div className="grid grid-cols-3 max-w-2xl gap-2 max-h-40 overflow-y-auto p-2">
              {customIcons.map((icon) => (
                <button
                  key={icon}
                  className={`p-2 rounded-lg flex flex-col items-center text-primary-500 ${siteForm.icon === icon ? "bg-primary-500 text-white" : "bg-slate-100 dark:bg-dark-700"}`}
                  onClick={() => setSiteForm({ ...siteForm, icon })}
                  title={icon}
                >
                  {getIcon(icon)}
                  <span className="text-xs mt-1 truncate w-full text-black dark:text-white">
                    {icon}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-dark-700 hover:bg-slate-300 dark:hover:bg-dark-700 text-black dark:text-white"
              onClick={() => setShowSiteModal(false)}
            >
              Отмена
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
              onClick={saveSite}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
