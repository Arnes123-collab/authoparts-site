import type { DealStage, LeadPriority } from "@/types/lead";

export const dealStageLabels: Record<DealStage, string> = {
  new_request: "Новая заявка",
  contacted: "Связались",
  price_requested: "Ждём цену",
  offer_sent: "Предложение отправлено",
  ordered: "Заказал",
  completed: "Завершено",
  lost: "Потеряно",
};

export const priorityLabels: Record<LeadPriority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};
