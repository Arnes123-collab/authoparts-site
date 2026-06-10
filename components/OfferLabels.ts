import type { LeadOfferStatus } from "@/types/lead-offer";

export const offerStatusLabels: Record<LeadOfferStatus, string> = {
  draft: "Черновик",
  offered: "Предложено",
  accepted: "Клиент согласен",
  rejected: "Отказ",
  purchased: "Закуплено",
  sold: "Продано",
};
