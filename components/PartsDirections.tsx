import { partsDirections } from "@/data/showcase";

export default function PartsDirections() {
  return (
    <section>
      <div className="container-custom">
        <div className="mb-12">
          <p className="text-accent font-semibold mb-3">
            Что поставляем
          </p>
          <h2 className="text-4xl font-bold">
            Основные группы автозапчастей
          </h2>
          <p className="text-secondaryText mt-4 max-w-3xl">
            Клиенту не нужно листать огромный каталог. Достаточно понять, что магазин занимается нужным направлением, и отправить заявку на подбор.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {partsDirections.map((item) => (
            <article key={item.title} className="card p-5">
              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-secondaryText text-sm leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
