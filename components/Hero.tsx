import { getSiteSettings } from "@/lib/settings";

export default async function Hero() {
  const settings = await getSiteSettings();

  return (
    <section id="home">
      <div className="container-custom">
        <div className="max-w-4xl">
          <p className="text-accent font-semibold mb-4">{settings.name}</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {settings.heroTitle}
          </h1>
          <p className="text-xl text-secondaryText mb-10">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#lead" className="btn-primary">Подобрать запчасть</a>
            <a href="#categories" className="btn-secondary">Смотреть категории</a>
          </div>
        </div>
      </div>
    </section>
  );
}
