# Fitness Coach Pro v1.0 - Stage 12 Final

Финальная версия шаблона веб-сайта и веб-приложения для фитнес-тренеров, тренеров по похудению, онлайн-коучей и тренеров 40+.

## Что входит в финальную сборку

1. Публичный сайт тренера
2. Форма заявки клиента
3. Supabase и база клиентов
4. Защищённая админ-панель
5. Клиенты и статусы
6. CMS упражнений с фото, видео, категориями, подкатегориями, тегами и заменами
7. Конструктор тренировочных программ
8. PDF / печатная версия плана
9. WhatsApp-текст тренировок
10. Оплаты и тарифы
11. Питание клиента
12. Отчёты клиента
13. Замеры тела
14. Аналитика прогресса
15. Шаблоны тренировок и питания
16. Брендирование тренера
17. Финальная тёмная спортивная тема

## Финальная цветовая система

- основной фон: `#070707`
- тёмно-серый фон: `#111111`
- карточки: `#151515`
- усиленные блоки: `#1F1F1F`
- основной текст: `#F8F8F8`
- вторичный текст: `#B7B7B7`
- красный акцент: `#D62828`
- золотой акцент: `#D6A84F`
- границы: `#343434`

## Основные страницы

Публичные:

- `/` - сайт тренера
- `/report` - форма отчёта клиента

Админ-панель:

- `/admin/login` - вход
- `/admin` - панель управления
- `/admin/clients` - клиенты
- `/admin/exercises` - CMS упражнений
- `/admin/plans` - тренировочные планы
- `/admin/payments` - оплаты
- `/admin/nutrition` - питание
- `/admin/reports` - отчёты
- `/admin/measurements` - замеры тела
- `/admin/analytics` - аналитика
- `/admin/templates` - шаблоны
- `/admin/settings` - брендирование тренера

## Переменные окружения

Создайте `.env.local` по образцу `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=change-this-password
```

Важно: `SUPABASE_SERVICE_ROLE_KEY` нельзя вставлять в клиентские компоненты и нельзя публиковать в открытый GitHub.

## SQL-файлы Supabase

Выполните в Supabase SQL Editor по порядку:

```text
supabase/001_create_clients.sql
supabase/002_stage3_admin_clients.sql
supabase/003_stage4_exercises.sql
supabase/007_stage7_payments.sql
supabase/008_stage8_nutrition_reports.sql
supabase/010_stage9_body_measurements.sql
supabase/011_stage11_exercise_cms.sql
supabase/012_stage12_branding.sql
```

Для фото упражнений создайте Storage bucket:

```text
exercise-images
```

Для MVP bucket можно сделать public.

## Установка

```bash
npm install
```

## Проверка качества

```bash
npm run typecheck
npm run build
```

В этой сборке `npm run build` выполняет полноценную production-сборку Next.js.

## Запуск локально

```bash
npm run dev
```

Открыть:

```text
http://localhost:3000
http://localhost:3000/admin/login
```

## Проверка Stage 12

1. Запустить проект.
2. Войти в `/admin/login` через `ADMIN_PASSWORD`.
3. Открыть `/admin/settings`.
4. Изменить имя тренера, бренд, контакты, оффер и цвета.
5. Сохранить.
6. Проверить таблицу `coach_settings` в Supabase.
7. Открыть `/admin` и убедиться, что раздел “Брендирование” доступен.
8. Проверить публичный сайт на телефоне.

## Итог

`Fitness Coach Pro v1.0 - Stage 12 Final` - готовый MVP-шаблон для продажи фитнес-тренерам и онлайн-коучам. Дальше можно делать упаковку продукта, демо-версию, инструкцию для покупателя и коммерческое предложение.
