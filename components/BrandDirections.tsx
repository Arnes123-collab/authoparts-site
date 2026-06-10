import { supportedCarBrands } from "@/data/showcase";

export default function BrandDirections() {
  return (
    <section id="brands">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-12">
          <div>
            <p className="text-accent font-semibold mb-3">
              Каталог направлений
            </p>
            <h2 className="text-4xl font-bold">
              С какими автомобилями работаем
            </h2>
          </div>

          <p className="text-secondaryText max-w-xl">
            Мы не перегружаем сайт тысячами карточек. Показываем основные направления, а точный подбор делаем по VIN, модели и запросу клиента.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportedCarBrands.map((brand) => (
            <article key={brand.name} className="card p-6 hover:border-accent transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-2xl font-bold text-accent">
                  {brand.name}
                </h3>
                <span className="rounded-full border border-borderColor bg-secondary px-3 py-1 text-xs text-secondaryText">
                  {brand.share}
                </span>
              </div>

              <p className="text-secondaryText leading-relaxed">
                {brand.description}
              </p>

              <a href="#lead" className="inline-block mt-5 text-accent font-semibold hover:underline">
                Подобрать запчасть →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
