import { topDirections } from "@/data/showcase";

export default function TopDirections() {
  return (
    <section className="pt-0">
      <div className="container-custom">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-accent font-semibold mb-2">
                Специализация
              </p>
              <h2 className="text-3xl font-bold">
                Топ-направления магазина
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
              {topDirections.map((item) => (
                <div key={item.label} className="bg-secondary border border-borderColor rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-accent">{item.value}</p>
                  <p className="text-secondaryText mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
