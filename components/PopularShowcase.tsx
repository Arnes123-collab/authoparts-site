import { popularShowcaseProducts } from "@/data/showcase";
import { getSiteSettings } from "@/lib/settings";

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export default async function PopularShowcase() {
  const settings = await getSiteSettings();

  return (
    <section>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-12">
          <div>
            <p className="text-accent font-semibold mb-3">
              Витрина
            </p>
            <h2 className="text-4xl font-bold">
              Популярные позиции
            </h2>
          </div>

          <p className="text-secondaryText max-w-xl">
            Это не полный складской каталог. Это визуальная витрина ходовых позиций, чтобы клиент сразу понял специализацию магазина.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularShowcaseProducts.map((product) => {
            const text = `Здравствуйте! Интересует ${product.name}, артикул ${product.article}. Подскажите наличие и цену.`;
            const whatsappUrl = `https://wa.me/${normalizePhone(settings.whatsapp)}?text=${encodeURIComponent(text)}`;

            return (
              <article key={product.article} className="card overflow-hidden">
                <div
                  className="h-44 bg-secondary bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                />

                <div className="p-5">
                  <p className="text-accent text-sm font-semibold mb-2">
                    {product.car}
                  </p>

                  <h3 className="text-xl font-bold mb-3">
                    {product.name}
                  </h3>

                  <div className="space-y-2 text-sm text-secondaryText mb-5">
                    <p>Артикул: {product.article}</p>
                    <p>Бренд: {product.brand}</p>
                  </div>

                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary w-full text-center">
                    Спросить в WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-borderColor bg-secondary p-6 text-center">
          <h3 className="text-2xl font-bold mb-3">
            Не нашли нужную деталь?
          </h3>

          <p className="text-secondaryText mb-5">
            Отправьте VIN, марку, модель и фото детали - подберём подходящий вариант.
          </p>

          <a href="#lead" className="btn-secondary">
            Оставить заявку на подбор
          </a>
        </div>
      </div>
    </section>
  );
}
