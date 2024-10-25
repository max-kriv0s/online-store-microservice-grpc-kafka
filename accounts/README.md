# Accounts service

### Описание основных команд:

yarn migrate:run - применяем миграции <br />
yarn seed:run - применяем seed <br />
yarn start:dev - запуск приложения в дев режиме.

### Генерация миграции после изменения entities

В консоли из корня проекта выполнить команды:  
`yarn migrate:generate src/database/migrations/<MigrationName>`  
Где `<MigrationName>` - имя миграции. Например, "CreateIndex".  
При необходимости отредактировать код миграции.

### Создание пустой seed

В консоли из корня проекта выполнить команды:  
`yarn seed:create src/database/seeds/<SeedName>`  
Где `<SeedName>` - имя seed. Например, "SeedCreateUsers".  