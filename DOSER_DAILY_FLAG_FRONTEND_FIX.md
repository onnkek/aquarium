# Doser daily flag frontend fix

Исправлена ошибка Immer при переключении daily flag помпы.

## Причина

Backend/mock на `POST /api/doser/{id}/state/reset` и `POST /api/doser/{id}/state/mark-run` может отвечать только `{ "status": "accepted" }`, без `id` и `lastRunYmd`.

Фронт ожидал `IDoserStateItem` и делал:

```ts
state.doserState[action.payload.id] = action.payload
```

Если `id` отсутствовал, получалось `state.doserState[undefined] = ...`, а Immer запрещает записывать в массив произвольные свойства.

## Что изменено

### `AquariumService`

После POST-команды фронт теперь делает дополнительный GET:

```ts
POST /api/doser/{id}/state/reset
GET  /api/doser/{id}/state
```

и

```ts
POST /api/doser/{id}/state/mark-run
GET  /api/doser/{id}/state
```

То есть thunk всегда получает нормальный объект:

```ts
{ id: number, lastRunYmd: string }
```

### `AquariumSlice`

Reducer теперь обновляет `doserState` безопасно через `findIndex`, а не пишет напрямую в индекс из payload.

```ts
const index = state.doserState.findIndex((stateItem) => stateItem.id === item.id)

if (index >= 0) {
  state.doserState[index] = item
} else {
  state.doserState.push(item)
}
```

## Проверка

Кнопка `Set daily flag` должна отправлять `mark-run`, после чего UI показывает `Yes`.

Кнопка `Reset daily flag` должна отправлять `reset`, после чего UI показывает `No`.
