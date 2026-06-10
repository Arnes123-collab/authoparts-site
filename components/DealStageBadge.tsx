import type { DealStage } from "@/types/lead";
import { dealStageLabels } from "@/components/DealLabels";

const classMap: Record<DealStage, string> = {
  new_request: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  contacted: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  price_requested: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  offer_sent: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  ordered: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  completed: "bg-green-500/15 text-green-300 border-green-500/30",
  lost: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function DealStageBadge({ stage }: { stage: DealStage }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classMap[stage]}`}>
      {dealStageLabels[stage]}
    </span>
  );
}
