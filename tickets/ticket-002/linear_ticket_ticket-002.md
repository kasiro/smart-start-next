---
id: ticket-002
title: "Добавить drag-n-drop для групп в настройках для мобильных устройств"
status: Done
priority: High
order: 20
created: 2026-03-05
updated: 2026-03-05
links:
  - url: ../parent/linear_ticket_parent.md
    title: Parent Ticket
---

# Description

## Problem to solve
Пользователи мобильных устройств теряют возможность управлять порядком групп после отключения drag-n-drop на главной странице.

## Solution
Добавить drag-n-drop для управления группами в настройках, доступный только для мобильных устройств (≤ 768px).

## Implementation Details
- Файл: `/src/app/components/Settings.js`
- Добавить состояние для drag-n-drop (draggingGroupId, dragOverGroupId)
- Реализовать функции: handleGroupDragStart, handleGroupDragOver, handleGroupDragEnd, handleGroupDrop
- Добавить проверку на мобильное устройство перед активацией drag-n-drop
- Добавить визуальную обратную связь при перетаскивании
- Сохранить порядок групп в localStorage
- Протестировать на мобильных устройствах
