# Fix build config

В прошлый архив случайно не попала папка `config/build`, из-за этого webpack не мог загрузить `buildWebpackConfig` и падал до запуска сборки.

В этом архиве восстановлена папка:

```text
config/build/
  buildDevServer.ts
  buildLoaders.ts
  buildPlugins.ts
  buildResolvers.ts
  buildWebpackConfig.ts
  loaders/
  types/
```

Логика emergency/navbar/loading не менялась.
