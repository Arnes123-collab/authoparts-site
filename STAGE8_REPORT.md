# Fitness Coach Pro - Stage 8 Report

## Что добавлено

Этап 8 добавляет два ключевых коммерческих модуля для фитнес-тренера:

1. Планы питания
2. Отчёты клиентов

## Новые страницы

- `/admin/nutrition` - создание и просмотр планов питания
- `/admin/reports` - отчёты клиентов
- `/report` - публичная форма отчёта для клиента

## Новые API

- `GET /api/nutrition-plans`
- `POST /api/nutrition-plans`
- `DELETE /api/nutrition-plans/[id]`
- `GET /api/progress-reports`
- `POST /api/progress-reports`
- `DELETE /api/progress-reports/[id]`

## Новые таблицы Supabase

SQL находится в файле:

`supabase/008_stage8_nutrition_reports.sql`

Создаются таблицы:

- `nutrition_plans`
- `progress_reports`

## Питание

План питания хранит:

- клиента
- название плана
- цель питания
- калории
- белки
- жиры
- углеводы
- воду
- количество приёмов пищи
- режим питания
- предпочтения
- ограничения
- рекомендации тренера

Есть кнопка копирования текста питания для WhatsApp.

## Отчёты

Отчёт клиента хранит:

- выполнение тренировки
- вес тела
- сон
- энергию
- боль 1-10
- воду
- калории
- БЖУ
- комментарий

## Проверка

1. Выполнить SQL `008_stage8_nutrition_reports.sql` в Supabase.
2. Запустить проект: `npm run dev`.
3. Открыть `/admin/login` и войти.
4. Открыть `/admin/nutrition` и создать план питания.
5. Открыть `/admin/reports` и добавить отчёт.
6. Открыть `/report` и отправить отчёт как клиент.
7. Проверить таблицы `nutrition_plans` и `progress_reports` в Supabase.
8. Выполнить `npm run typecheck`.
