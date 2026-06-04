# UI Experiment V1

Тестовый вариант полной визуальной переработки интерфейса под новый backend API.

## Что изменено

- Новый dashboard hero-блок с общим состоянием аквариума, RTC, heartbeat и температурой.
- Новые glassmorphism-карточки с более читаемой иерархией.
- Новый левый navbar на desktop и floating bottom navbar на mobile.
- Новый layout главной страницы: Environment → Automation → Doser.
- Emergency/override состояния интегрированы в общий визуальный стиль.
- Base URL по умолчанию оставлен `http://localhost:3111` для mock backend.

## Что не менялось принципиально

- Redux/API слой остался прежним.
- Настройки и business logic не переписывались.
- Это именно UI/UX-прототип для оценки внешнего вида.

## Проверка

```bash
npm install
npm run build
npm start
```
