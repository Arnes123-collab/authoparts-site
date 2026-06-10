# Fitness Coach Pro - Stage 10

## Этап 10: библиотека шаблонов

Добавлен модуль готовых шаблонов для фитнес-тренера.

## Что добавлено

- `/admin/templates` - библиотека шаблонов
- `/api/templates` - GET/POST шаблонов
- `/api/templates/[id]` - DELETE/PATCH шаблона
- `src/types/template.ts` - типы шаблонов
- `src/components/AdminTemplatesManager.tsx` - интерфейс управления шаблонами
- ссылка “Шаблоны” в админ-панель

## Таблица Supabase

```sql
CREATE TABLE IF NOT EXISTS program_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  template_type text NOT NULL DEFAULT 'training',
  category text NOT NULL DEFAULT 'fat_loss',
  description text,
  duration_weeks integer,
  training_days_per_week integer,
  goal text,
  level text,
  content text NOT NULL,
  nutrition_notes text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
```

## Категории

- `fat_loss` - похудение
- `muscle_gain` - набор массы
- `recomposition` - рекомпозиция
- `home_workout` - домашние тренировки
- `beginner` - начинающий
- `advanced` - продвинутый
- `health_40_plus` - после 40

## Типы шаблонов

- `training` - тренировки
- `nutrition` - питание
- `combined` - тренировки + питание

## Проверка

1. Выполнить SQL в Supabase.
2. Запустить проект:

```bash
npm install
npm run dev
```

3. Открыть `/admin/login`.
4. Войти по `ADMIN_PASSWORD`.
5. Открыть `/admin/templates`.
6. Нажать быстрый старт-шаблон.
7. Сохранить шаблон.
8. Проверить, что он появился в списке.
9. Нажать “Скопировать”.
10. Проверить включение/выключение и удаление.

## Контроль качества

```bash
npm run typecheck
```
