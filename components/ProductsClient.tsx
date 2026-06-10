"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";

type ProductsClientProps = {
  initialProducts: Product[];
};

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  function handleCreated(product: Product) {
    setProducts((current) => [product, ...current]);
  }

  return (
    <div className="space-y-8">
      <ProductForm onCreated={handleCreated} />
      <ProductTable products={products} />
    </div>
  );
}
