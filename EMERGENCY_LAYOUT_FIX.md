# Emergency UI layout fix

Что исправлено:

1. Баннеры `Emergency mode active` и `Emergency override active` перенесены внутрь основного `.content/.wrapper`, поэтому теперь они совпадают по ширине с основной рабочей областью и аварийной/override-заливкой.
2. На мобильной версии `.content` больше не занимает `100vh` сверх нижнего navbar. Теперь контент живёт в доступной высоте `main`, а нижняя навигация не выдавливается за экран.
3. Override-баннер остался жёлтым, emergency-баннер — красным.
4. Кнопки emergency-control в системных настройках больше не получают фокусное “залипание” после клика: добавлен `onMouseDown preventDefault`, `blur()` и сброшены focus/focus-visible стили.
5. Base URL сервиса по умолчанию изменён на `http://localhost:3111`, чтобы фронт сразу работал с mock API без ручного `localStorage`.

Проверка:

```bash
npm install
npm run build
```

Сборка проходит. Остались только старые webpack warnings по размеру bundle.
