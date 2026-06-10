# Fitness Coach Pro - Stage 4 Report

## Цель этапа

Добавить базу упражнений с фото для тренера.

## Что сделано

- Создан тип `Exercise`.
- Создан API `/api/exercises`:
  - `GET` - получить список упражнений.
  - `POST` - добавить упражнение.
- Добавлена серверная загрузка фото в Supabase Storage bucket `exercise-images`.
- Добавлена страница `/admin/exercises`.
- Добавлена форма упражнения:
  - название;
  - группа мышц;
  - техника;
  - частые ошибки;
  - противопоказания;
  - уровень сложности;
  - видео-ссылка;
  - фото.
- Добавлен список упражнений карточками.
- Добавлена ссылка на упражнения в `/admin`.
- Добавлен SQL-файл `supabase/003_stage4_exercises.sql`.
- Добавлена инструкция по Storage bucket в `supabase/004_stage4_storage_notes.sql`.

## Проверка

1. Выполнить SQL `supabase/003_stage4_exercises.sql` в Supabase SQL Editor.
2. Создать Storage bucket `exercise-images` и включить Public bucket.
3. Заполнить `.env.local`.
4. Запустить `npm run dev`.
5. Войти в `/admin/login`.
6. Открыть `/admin/exercises`.
7. Добавить упражнение без фото.
8. Добавить упражнение с фото.
9. Проверить таблицу `exercises` и bucket `exercise-images` в Supabase.
10. Выполнить `npm run build`.

## Ограничения MVP

- Bucket `exercise-images` публичный для простоты MVP.
- Полная система ролей и RLS будет усилена перед коммерческим запуском.
