import { categories } from "@/data/categories";

export default function Categories() {
  return (
    <section id="categories">
      <div className="container-custom">
        <h2 className="text-4xl font-bold mb-12">Категории товаров</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category} className="card p-6 hover:border-accent transition-all">
              <h3 className="text-lg font-semibold">{category}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
