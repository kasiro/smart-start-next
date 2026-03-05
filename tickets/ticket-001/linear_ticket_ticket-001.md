---
id: ticket-001
title: "Отключить drag-n-drop групп на главной странице для мобильных устройств"
status: Done
priority: High
order: 10
created: 2026-03-05
updated: 2026-03-05
links:
  - url: ../parent/linear_ticket_parent.md
    title: Parent Ticket
---

# Description

## Problem to solve
На мобильных устройствах (≤ 768px) drag-n-drop групп на главной странице вызывает случайные срабатывания и конфликтует с нативными жестами прокрутки.

## Solution
Добавить проверку на мобильное устройство и отключить drag-n-drop групп только для мобильных устройств, сохранив его для десктопов.

## Implementation Details
- Файл: `/src/app/page.js`
- Добавить состояние `const [isMobile, setIsMobile] = useState(false)`
- Добавить useEffect для отслеживания изменения размера экрана:
  ```javascript
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  ```
- Модифицировать `handleDragStart` (для групп) для проверки на мобильное устройство:
  ```javascript
  const handleDragStart = (e, groupId) => {
    if (isMobile) return; // Отключаем на мобильных
    setDraggingGroupId(groupId);
    e.dataTransfer.setData("text/plain", groupId);
    e.dataTransfer.effectAllowed = "move";
  };
  ```
- В MainContent.js добавить проверку `!isMobile` перед установкой draggable для групп
- Сохранить drag-n-drop для сайтов на всех устройствах (это НЕ относится к этому тикету)

## Acceptance Criteria
- [ ] На устройствах ≤ 768px drag-n-drop групп НЕ работает
- [ ] На устройствах > 768px drag-n-drop групп работает
- [ ] Drag-n-drop сайтов работает на всех устройствах
- [ ] Нет ошибок в консоли
