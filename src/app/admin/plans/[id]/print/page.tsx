import { TrainingPlanPrintView } from "@/components/TrainingPlanPrintView";

export const dynamic = "force-dynamic";
export default function PrintTrainingPlanPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--text)] print:bg-white print:px-0 print:py-0">
      <TrainingPlanPrintView planId={id} />
    </main>
  );
}
