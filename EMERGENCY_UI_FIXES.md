# Emergency UI fixes

Изменения сделаны поверх фронта с new API.

## Что исправлено

1. Исправлено отображение даты `Unknown data May 25`.
   - Backend может отдавать `dayOfWeek` числом `0..6` или строкой.
   - `getDateString()` теперь понимает оба формата.

2. Добавлен жёлтый emergency override banner на главной странице.
   - Если `emergencyMode=true` — красный фон и красный баннер.
   - Если `emergencyOverride=true` и `emergencyMode=false` — жёлтый фон и жёлтый баннер.

3. Исправлена логика кнопок в `Environment/System settings`.
   - `Enable emergency` скрывается, когда emergency уже активен.
   - `Clear emergency` скрывается, когда emergency не активен.
   - `Clear override` показывается только когда override активен.

4. Исправлено визуальное залипание кнопок после клика.
   - Кнопка blur-ится после нажатия.
   - CSS focus state больше не выглядит как активное состояние.

## Тронутые файлы

- `src/shared/lib/period.ts`
- `src/pages/DashboardPage/ui/DashboardPage.tsx`
- `src/pages/DashboardPage/ui/DashboardPage.module.sass`
- `src/features/CardSettings/ServerSettings/ServerSettings.tsx`
- `src/features/CardSettings/ServerSettings/ServerSettings.module.sass`
