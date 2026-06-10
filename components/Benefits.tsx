import { benefits } from "@/data/benefits";

export default function Benefits() {
  return (
    <section>
      <div className="container-custom">
        <h2 className="text-4xl font-bold mb-12">Наши преимущества</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="text-xl font-bold mb-4 text-accent">{item.title}</h3>
              <p className="text-secondaryText">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
