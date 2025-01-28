# online-store-microservice-grpc-kafka

## Интернет магазин

Проект состоит из нескольких микросервисов:

- _api-gateway_ - точка входа для взаимодействия с микросервисами. Отвечает за маршрутизацию запросов, группировку выходных данных и проверку ролей пользователей

- _accounts_ - сервис для работы с пользователями (создание, авторизация, управление правами)

- _catalog_ - сервис для работы с товарами (создание, установка цен, остатки, продажи, аналитика продаж)

- _orders_ - сервис для работы с корзиной пользователя и заказами.

В каталоге для каждого сервиса присутствует отдельный файл README.md, в котором описаны особенности по работе с каждым сервисом

Архитектура:
![Архитектура](/docs/arhitecture.png)

Технические каталоги:

- _docs_ - схема проекта, коллекция запросов postman

- _infrastructure_ - запуск сервисов, локальное хранилище volume docker

Для запуска приложения необходимо:

1. Создать файлы `.env` с переменных окружения в каталоге каждого сервиса и `infrastructure`. Сделать это можно скопировав файл `.env.example` и переименовав в `.env`.
2. Перейти в каталог `infrastructure`
3. Выполнить команду `docker compose up -d`

Провести нагрузочное тестирование можно через утилиту ghz
Пример команды запускаемой из каталога `infrastructure`:

```bash
rps_value=1000  # Устанавливаем нужное значение для rps
output_dir="./.deploy/ghz_result"

ghz --proto ../catalog/src/module/products/products.proto \
 --call products.v1.ProductsService.findProduct \
 --data '{"id": "5ad25fb4-8bbd-4639-b2fb-fb7396c42efd"}' \
 --concurrency 20 \
 --connections 5 \
 --rps "$rps_value" \
 --duration 1m \
 --insecure \
 --output="${output_dir}/pretty_rps_${rps_value}" \
127.0.0.1:3302
```
