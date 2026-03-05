---
id: parent
title: "[Epic] Drag-n-Drop Адаптация для Мобильных Устройств"
status: Done
priority: High
order: 0
created: 2026-03-05
updated: 2026-03-05
links:
  - url: ../.qwen/tmp/prd.md
    title: PRD Document
---

# Description

## Problem to solve
Drag-n-drop групп на главной странице неудобен на мобильных устройствах (≤ 768px) и вызывает случайные срабатывания. Необходимо отключить его на главной и добавить в настройках для мобильных устройств.

## Solution
1. Отключить drag-n-drop групп на главной странице для мобильных устройств
2. Добавить drag-n-drop для управления группами в настройках (только для мобильных)
3. Сохранить drag-n-drop на десктопных устройствах

## Implementation Details
- Использовать `window.matchMedia("(max-width: 768px)")` для определения мобильных устройств
- Модифицировать `page.js` для отключения drag-n-drop на мобильных
- Добавить drag-n-drop функциональность в `Settings.js` для мобильных устройств
- Сохранить консистентность с существующей реализацией drag-n-drop
