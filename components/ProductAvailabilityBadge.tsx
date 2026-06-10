import type { ProductAvailability } from "@/types/product";
import { productAvailabilityLabels } from "@/components/ProductLabels";

const classMap: Record<ProductAvailability, string> = {
  in_stock: "bg-green-500/15 text-green-300 border-green-500/30",
  preorder: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  sold: "bg-red-500/15 text-red-300 border-red-500/30",
  hidden: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export default function ProductAvailabilityBadge({
  availability,
}: {
  availability: ProductAvailability;
}) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classMap[availability]}`}>
      {productAvailabilityLabels[availability]}
    </span>
  );
}
