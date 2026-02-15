"use client";
import { useClickOutside } from "../../lib/hooks";

export default function GroupModal({
  groupForm,
  setGroupForm,
  editingGroup,
  saveGroup,
  setShowGroupModal,
  setShowIconManager,
  customIcons,
  getIcon,
}) {
  const modalRef = useClickOutside(() => setShowGroupModal(false));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
      <div
        ref={modalRef}
        className="settings-panel w-full max-w-lg lg:max-w-2xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          {editingGroup ? "Редактировать группу" : "Добавить группу"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-black dark:text-white font-medium">
              Название группы
            </label>
            <input
              type="text"
              value={groupForm.name}
              onChange={(e) =>
                setGroupForm({ ...groupForm, name: e.target.value })
              }
              className="w-full text-black dark:text-white p-3 rounded-xl bg-slate-100 dark:bg-dark-600 border border-transparent focus:border-primary-500 outline-none"
              placeholder="Мои сайты"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-black dark:text-white font-medium">
                Иконка группы
              </label>
              <button
                className="text-sm p-2 bg-slate-100 dark:bg-dark-800 rounded-lg text-dark-700 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors"
                onClick={() => {
                  setShowGroupModal(false);
                  setShowIconManager(true);
                }}
              >
                Управление иконками
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-60 overflow-y-auto p-3 bg-slate-50 dark:bg-dark-800 rounded-xl">
              {customIcons.map((icon) => (
                <button
                  key={icon}
                  className={`p-3 rounded-xl flex flex-col items-center transition-all duration-200 ${
                    groupForm.icon === icon
                      ? "bg-primary-500 text-white scale-105 shadow-lg"
                      : "bg-slate-100 dark:bg-dark-700 hover:bg-slate-200 dark:hover:bg-dark-600"
                  }`}
                  onClick={() => setGroupForm({ ...groupForm, icon })}
                  title={icon}
                >
                  <div className="text-lg mb-1">{getIcon(icon)}</div>
                  <span className="text-xs mt-1 truncate w-full">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-dark-700 hover:bg-slate-300 dark:hover:bg-dark-600 text-black dark:text-white transition-colors"
              onClick={() => setShowGroupModal(false)}
            >
              Отмена
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              onClick={saveGroup}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
