import type { LeadStatus } from "@/types/lead";

const statusMap: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "Новая", className: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  in_progress: { label: "В работе", className: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" },
  ordered: { label: "Заказано", className: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  completed: { label: "Выполнено", className: "bg-green-500/15 text-green-300 border-green-500/30" },
  cancelled: { label: "Отказ", className: "bg-red-500/15 text-red-300 border-red-500/30" },
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const item = statusMap[status];
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${item.className}`}>{item.label}</span>;
}
