# Orders service

### Описание основных команд:

`yarn migrate:run` - применяем миграции <br />
`yarn start:dev` - запуск приложения в дев режиме.

### Генерация миграции после изменения entities

В консоли из корня проекта выполнить команды:  
`yarn migrate:generate src/database/migrations/<MigrationName>`  
Где `<MigrationName>` - имя миграции. Например, "CreateIndex".  
При необходимости отредактировать код миграции.

### Проверка устаревших пакетов и обновление
`yarn ncu` - проверка устаревших пакетов в package.json
`yarn ncu -u` - обновление версий пакетов в файле package.json
`yarn install` - обновление версий пакетов на основании файла package.json