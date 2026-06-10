# Fitness Coach Pro - Этап 5

## Что добавлено

Этап 5 добавляет конструктор тренировочных программ.

### Новые разделы

- `/admin/plans` - список тренировочных планов
- `/admin/plans/new` - создание нового плана
- `/admin/plans/[id]` - редактор плана

### Новые API Route Handlers

- `GET /api/training-plans` - список планов
- `POST /api/training-plans` - создать план
- `GET /api/training-plans/[id]` - получить план с клиентом и упражнениями
- `POST /api/training-plans/[id]/items` - добавить упражнение в план
- `DELETE /api/training-plan-items/[itemId]` - удалить упражнение из плана

### Новые таблицы Supabase

```sql
CREATE TABLE IF NOT EXISTS training_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  goal text,
  start_date date,
  end_date date,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_id uuid REFERENCES training_plans(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  training_day text NOT NULL,
  exercise_order integer DEFAULT 1,
  sets integer,
  reps text,
  weight numeric,
  percent numeric,
  rest_time text,
  tempo text,
  comment text,
  created_at timestamp with time zone DEFAULT now()
);
```

### Что умеет редактор плана

- выбрать клиента
- создать план с целью и датами
- добавить упражнение из базы exercises
- указать день недели
- указать порядок упражнения
- указать подходы, повторения, вес, процент, отдых, темп и комментарий
- видеть фото упражнения в плане
- видеть технику упражнения из базы
- группировать упражнения по дням
- удалить упражнение из плана
- сформировать готовый текст для WhatsApp
- скопировать текст плана

## Проверка

1. Создать таблицы `training_plans` и `training_plan_items` в Supabase.
2. Запустить проект:

```bash
npm install
npm run dev
```

3. Открыть `/admin/login`.
4. Войти по ADMIN_PASSWORD.
5. Проверить, что есть клиенты и упражнения.
6. Открыть `/admin/plans`.
7. Создать новый план.
8. Добавить упражнения.
9. Проверить фото упражнений и WhatsApp-текст.
10. Выполнить проверку TypeScript:

```bash
npm run build
```

В этом проекте `npm run build` специально настроен как `tsc --noEmit`, чтобы не зависать на production build в слабой или ограниченной среде.
Для реальной сборки Next.js используйте:

```bash
npm run next:build
```
