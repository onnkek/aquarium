# Миграция фронта на new-arch API

## Что изменено

Фронт больше не работает по модели `GET /config` + `POST /config`.
Теперь Redux хранит конфиг так же, как backend new-arch:

```ts
config: {
  system,
  doser,
  relays: {
    co2,
    o2,
    filter,
    light,
  },
  temp,
  argb,
}

doserState: [
  { id: 0, lastRunYmd: "" },
  ...
]
```

То есть `hasRunToday` больше не является частью `doser` config.
Он вычисляется только для UI-карточки через `lastRunYmd === today`.

## Почему так

Backend split-config хранит настройки отдельно:

- `/api/system`
- `/api/doser`
- `/api/relays`
- `/api/temp`
- `/api/argb`

А состояние последнего автодозирования отдельно:

- `/api/doser/state`

Поэтому фронт теперь не должен собирать и отправлять огромный `config` целиком.
Каждая настройка обновляет только свой ресурс.

## Какие файлы изменены

### `src/redux/aquariumTypes.ts`

Новый файл с нормализованными интерфейсами:

- `IAquariumConfig`
- `ISystem`
- `IDoserConfig`
- `IDoserStateItem`
- `IRelaysConfig`
- `IRelay`
- `ITemp`
- `IARGB`
- `ICurrentInfo`

### `src/services/AquariumService.ts`

Полностью переведён на `/api/...`:

- `GET /api/system`
- `GET /api/doser`
- `GET /api/doser/state`
- `GET /api/relays`
- `GET /api/temp`
- `GET /api/argb`
- `PATCH /api/system`
- `PATCH /api/doser/{id}`
- `PATCH /api/relays/{id}`
- `PATCH /api/temp`
- `PATCH /api/argb`
- `POST /api/doser/{id}/state/reset`
- `POST /api/doser/{id}/state/mark-run`

### `src/redux/AquariumSlice.ts`

Redux state нормализован под backend.
Thunk-и больше не отправляют `POST /config`.
Каждый thunk вызывает точечный endpoint.

### `src/entities/card/lib/mapper.ts`

Mapper собирает UI view-model для карточек.
Это не persistent config.
Например pump card получает `hasRunToday`, но это вычисленное поле:

```ts
hasRunToday = doserState[index].lastRunYmd === today
```

### `src/pages/DashboardPage/ui/DashboardPage.tsx`

Разметка не менялась.
Добавлен только selector `doserState` и он передаётся в mapper.

## Base URL

По умолчанию:

```ts
http://192.168.1.111
```

Можно переопределить в браузере:

```js
localStorage.setItem("aquariumApiBase", "http://localhost:3111")
```

Для возврата на ESP:

```js
localStorage.setItem("aquariumApiBase", "http://192.168.1.111")
```

## Проверка

Сборка проверена:

```bash
npm install
npm run build
```

Сборка проходит. Остались только старые webpack warnings по размеру bundle.
