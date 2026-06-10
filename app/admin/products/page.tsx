import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ProductsClient from "@/components/ProductsClient";
import { supabase } from "@/lib/supabase";
import { mapProductFromDb, type ProductDbRow } from "@/types/product";

export default async function ProductsPage() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ProductDbRow[]>();

  const products = data ? data.map(mapProductFromDb) : [];

  return (
    <main>
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-accent font-semibold mb-2">
              Каталог бутика
            </p>

            <h1 className="text-4xl font-bold">
              Быстрое добавление запчастей
            </h1>

            <p className="text-secondaryText mt-2">
              Продавец может добавлять товар прямо с телефона: название, артикул, цена, количество и фото-ссылка.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="btn-secondary">
              Назад в CRM
            </Link>

            <LogoutButton />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-danger p-4 text-white">
            Не удалось загрузить товары. Проверьте Supabase и SQL-таблицу products.
          </div>
        )}

        <ProductsClient initialProducts={products} />
      </div>
    </main>
  );
}
