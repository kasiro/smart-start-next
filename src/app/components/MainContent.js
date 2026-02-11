"use client";

import { useState } from "react";
import { getIcon } from "../../lib/utils";

export default function MainContent({
  activeTab,
  setActiveTab,
  siteGroups,
  setSiteGroups,
  tabLayout,
  customIcons,
  openAddSiteForm,
  openEditSiteForm,
  deleteSite,
  handleSiteClick,
  draggingSite,
  dragOverGroupId,
  dragOverSiteId,
  handleSiteDragStart,
  handleSiteDragOver,
  handleSiteDragEnd,
  handleSiteDrop,
  hiddenCategories,
  toggleCategoryVisibility,
  openAddGroupForm,
}) {
  const filteredGroups = siteGroups.filter((group) => {
    if (activeTab === "all") return true;
    return group.id === activeTab;
  });

  const tabs = [
    { id: "all", name: "Все", icon: "bookmark" },
    ...siteGroups.map((group) => ({
      id: group.id,
      name: group.name,
      icon: group.icon,
    })),
  ];

  const scrollTabIntoView = (tabId) => {
    const tabElement = document.getElementById(`tab-${tabId}`);
    if (!tabElement) return;

    const container = tabElement.parentElement;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tabElement.getBoundingClientRect();

    const isFullyVisible =
      tabRect.left >= containerRect.left &&
      tabRect.right <= containerRect.right;

    if (!isFullyVisible) {
      const scrollOptions = {
        left:
          tabElement.offsetLeft -
          container.offsetWidth / 2 +
          tabElement.offsetWidth / 2,
        behavior: "smooth",
      };

      container.scrollTo(scrollOptions);
    }
  };

  return (
    <>
      {siteGroups.length > 0 && tabLayout === "tabs" && (
        <div className="flex flex-col gap-1 mb-6 p-[6px] rounded-xl panel overflow-x-auto scrollbar-width-none">
          <div className="flex gap-1 overflow-x-auto scrollbar-width-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`flex items-center gap-2 py-3 px-5 rounded-[0.44rem] whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary-500/20 text-primary-500"
                    : "text-black dark:text-white"
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollTabIntoView(tab.id);
                }}
              >
                {getIcon(tab.icon)}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {siteGroups.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg mb-4 text-black dark:text-white">
            У вас пока нет ни одной группы сайтов
          </p>
          <button
            className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600"
            onClick={openAddGroupForm}
          >
            <i className="fas fa-plus mr-2"></i>
            Создать первую группу
          </button>
        </div>
      ) : (
        <div className="space-y-6" style={{ contain: "layout style paint" }}>
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="animate-fadeIn"
              style={{ contain: "layout style paint" }}
            >
              <div className="mb-3 ml-2">
                <div
                  className="inline-flex items-center p-3 rounded-xl bg_blur_5 text-primary-500 cursor-pointer"
                  onClick={() =>
                    activeTab === "all" && toggleCategoryVisibility(group.id)
                  }
                >
                  {getIcon(group.icon)}
                  <h2 className="text-black dark:text-white text-xl pl-2 font-semibold">
                    {group.name}
                    {activeTab === "all" && (
                      <i
                        className={`fas fa-chevron-${hiddenCategories.includes(group.id) ? "right" : "down"} ml-2 text-sm`}
                      ></i>
                    )}
                  </h2>
                </div>
              </div>
              <div
                className={`category-content ${activeTab === "all" ? (hiddenCategories.includes(group.id) ? "max-h-0" : "max-h-screen") : ""}`}
                style={{ contain: "layout style paint" }}
              >
                <div
                  className={`fade-transition ${activeTab === "all" && hiddenCategories.includes(group.id) ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                  style={{ contain: "layout style paint" }}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                    {group.sites.map((site) => (
                      <a
                        key={site.id}
                        className={`site-item flex flex-col items-center gap-1 shadow-none p-3 rounded-2xl panel cursor-pointer ${
                          draggingSite?.id === site.id ? "opacity-50" : ""
                        } ${
                          dragOverGroupId === group.id &&
                          dragOverSiteId === site.id
                            ? "border-primary-500 border-2"
                            : ""
                        }`}
                        onClick={() => handleSiteClick(site.url)}
                        draggable
                        onDragStart={(e) =>
                          handleSiteDragStart(e, site, group.id)
                        }
                        onDragOver={(e) =>
                          handleSiteDragOver(e, group.id, site.id)
                        }
                        onDragEnd={handleSiteDragEnd}
                        onDrop={(e) => handleSiteDrop(e, group.id, site.id)}
                        style={{ contain: "layout style paint" }} // Добавляем contain для оптимизации производительности
                      >
                        <div
                          className={`w-10 h-10 rounded-xl text-primary-500 bg-accent bg-opacity-20 flex items-center justify-center`}
                        >
                          <span className="text-lg">{getIcon(site.icon)}</span>
                        </div>
                        <div className="text-xs font-medium text-center text-black dark:text-white">
                          {site.name}
                        </div>
                      </a>
                    ))}

                    {group.sites.length === 0 && (
                      <div
                        className={`col-span-full bg_blur_5 flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer ${
                          dragOverGroupId === group.id &&
                          dragOverSiteId === "empty-group-drop"
                            ? "border-2 border-dashed border-primary-500"
                            : ""
                        }`}
                        onDragOver={(e) =>
                          handleSiteDragOver(e, group.id, "empty-group-drop")
                        }
                        onDrop={(e) =>
                          handleSiteDrop(e, group.id, "empty-group-drop")
                        }
                        onClick={() => openAddSiteForm(group.id)}
                        style={{ contain: "layout style paint" }} // Добавляем contain для оптимизации производительности
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center mb-2">
                          <i className="fas fa-plus text-primary-500"></i>
                        </div>
                        <p className="font-medium text-sm text-black dark:text-white">
                          Перетащите сюда сайты
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          или нажмите, чтобы добавить
                        </p>
                      </div>
                    )}

                    {group.sites.length > 0 && (
                      <div
                        className="site-item text-black dark:text-white flex flex-col items-center gap-1 p-3 rounded-2xl shadow-none panel cursor-pointer hover:bg-primary-100 dark:hover:bg-dark-700"
                        onClick={() => openAddSiteForm(group.id)}
                        style={{ contain: "layout style paint" }} // Добавляем contain для оптимизации производительности
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                          <i className="fas fa-plus text-lg"></i>
                        </div>
                        <div className="text-xs font-medium">Добавить</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-16 text-center text-sm text-black dark:text-white">
        <p className="text-black dark:text-white">
          Настроено с помощью SmartStart (kasiro Labs) •{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
