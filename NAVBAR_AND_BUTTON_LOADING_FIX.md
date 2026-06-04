# Navbar and emergency button loading fix

## Что исправлено

1. Нижний navbar на мобильной версии больше не зависит от высоты контента страницы.
   - `Navbar` переведён в `position: fixed` при ширине до 900px.
   - `Page` и `DashboardPage` получили нижний отступ под fixed-navbar.
   - Скролл карточек остался внутри dashboard wrapper, navbar не выдавливается за экран.

2. Кнопки emergency control получили состояние запроса.
   - Во время запроса кнопка блокируется через `disabled`.
   - Внутри кнопки появляется маленький spinner.
   - Текст меняется на `Enabling...`, `Clearing...`.
   - Повторный клик во время запроса игнорируется.

## Затронутые файлы

- `src/widgets/Navbar/ui/Navbar.module.sass`
- `src/widgets/Page/ui/Page.module.sass`
- `src/pages/DashboardPage/ui/DashboardPage.module.sass`
- `src/features/CardSettings/ServerSettings/ServerSettings.tsx`
- `src/features/CardSettings/ServerSettings/ServerSettings.module.sass`

## Проверка

```bash
npm run build
```

Сборка проходит, остаются только старые webpack warnings по размеру bundle.
