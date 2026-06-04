# Emergency UI migration

## Что добавлено

Фронт теперь читает safety-состояние из нового backend API и показывает аварийный режим на главной странице.

## API

Добавлены методы в `src/services/AquariumService.ts`:

- `getSafety()` -> `GET /api/safety`
- `enterEmergencyMode()` -> `POST /api/safety/emergency-mode`
- `clearEmergencyMode()` -> `POST /api/safety/emergency-mode/clear`
- `clearEmergencyOverride()` -> `POST /api/safety/emergency-override/clear`

`/api/current` уже содержит `safety`, поэтому dashboard обновляется без отдельного polling endpoint-а.

## Redux

В `src/redux/AquariumSlice.ts` добавлены thunk-и:

- `getSafety`
- `enterEmergencyMode`
- `clearEmergencyMode`
- `clearEmergencyOverride`

State `aquarium.safety` обновляется из `/api/current` и из ручных safety-команд.

## Dashboard

В `src/pages/DashboardPage/ui/DashboardPage.tsx` добавлена проверка:

```ts
const safety = useAppSelector(state => state.aquarium.safety)
```

Если `safety.emergencyMode === true`, главная страница получает красноватый фон и предупреждающий баннер.

CSS добавлен в `DashboardPage.module.sass`.

## System / Server settings

В `src/features/CardSettings/ServerSettings/ServerSettings.tsx` добавлен блок `Emergency Control`.

Он показывает:

- Emergency mode: ACTIVE/OFF
- Override: ON/OFF
- RTC status: VALID/INVALID
- Restore snapshot: Available/Empty
- Active reasons

Кнопки:

- `Enable emergency` — вручную включает emergency mode
- `Clear emergency` — вручную выходит из emergency mode, backend восстанавливает snapshot режимов
- `Clear override` — снимает ручной override, после этого backend снова может автоматически включить emergency mode, если причина ещё активна

Верстка карточек и основная сетка не переписывались. Изменения точечные: Redux/API слой + один блок в системных настройках + emergency background.
