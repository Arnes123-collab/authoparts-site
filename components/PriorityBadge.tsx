import type { LeadPriority } from "@/types/lead";
import { priorityLabels } from "@/components/DealLabels";

const classMap: Record<LeadPriority, string> = {
  low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  high: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function PriorityBadge({ priority }: { priority: LeadPriority }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classMap[priority]}`}>
      {priorityLabels[priority]}
    </span>
  );
}
