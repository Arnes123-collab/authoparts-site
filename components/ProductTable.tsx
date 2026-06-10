"use client";

import { useMemo, useState } from "react";
import type { Product, ProductAvailability } from "@/types/product";
import ProductAvailabilityBadge from "@/components/ProductAvailabilityBadge";
import {
  carBrands,
  productAvailabilityLabels,
} from "@/components/ProductLabels";

type ProductTableProps = {
  products: Product[];
};

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function carName(product: Product) {
  return [product.carBrand, product.carModel, product.yearRange]
    .filter(Boolean)
    .join(" ") || "Не указано";
}

export default function ProductTable({ products }: ProductTableProps) {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<ProductAvailability | "all">("all");
  const [carBrand, setCarBrand] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !value ||
        [
          product.name,
          product.article,
          product.brand,
          product.category,
          product.carBrand,
          product.carModel,
          product.yearRange,
          product.comment,
        ]
          .join(" ")
          .toLowerCase()
          .includes(value);

      const matchesAvailability =
        availability === "all" || product.availability === availability;

      const matchesCarBrand =
        carBrand === "all" || product.carBrand === carBrand;

      return matchesQuery && matchesAvailability && matchesCarBrand;
    });
  }, [products, query, availability, carBrand]);

  const totalStock = filteredProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalPotential = filteredProducts.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
  const totalMargin = filteredProducts.reduce(
    (sum, item) => sum + item.margin * item.quantity,
    0
  );

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Каталог запчастей</h2>
            <p className="text-secondaryText mt-2">
              Поиск по названию, артикулу, бренду, автомобилю и комментарию.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 min-w-full lg:min-w-[520px]">
            <div className="bg-secondary border border-borderColor rounded-2xl p-4">
              <p className="text-secondaryText text-sm">Позиций</p>
              <p className="text-2xl font-bold">{filteredProducts.length}</p>
            </div>
            <div className="bg-secondary border border-borderColor rounded-2xl p-4">
              <p className="text-secondaryText text-sm">Штук</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
            <div className="bg-secondary border border-borderColor rounded-2xl p-4">
              <p className="text-secondaryText text-sm">Маржа</p>
              <p className="text-2xl font-bold">{money(totalMargin)} тг</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <input
            className="input-dark"
            placeholder="Поиск: артикул, Toyota, фильтр..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            className="input-dark"
            value={availability}
            onChange={(event) => setAvailability(event.target.value as ProductAvailability | "all")}
          >
            <option value="all">Все статусы</option>
            {(Object.keys(productAvailabilityLabels) as ProductAvailability[]).map((key) => (
              <option key={key} value={key}>{productAvailabilityLabels[key]}</option>
            ))}
          </select>

          <select
            className="input-dark"
            value={carBrand}
            onChange={(event) => setCarBrand(event.target.value)}
          >
            <option value="all">Все марки авто</option>
            {carBrands.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 text-secondaryText text-sm">
        Потенциал продаж по фильтру: {money(totalPotential)} тг
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-borderColor text-left text-secondaryText">
              <th className="py-4 pr-4">Фото</th>
              <th className="py-4 pr-4">Название</th>
              <th className="py-4 pr-4">Артикул</th>
              <th className="py-4 pr-4">Бренд</th>
              <th className="py-4 pr-4">Авто</th>
              <th className="py-4 pr-4">Продажа</th>
              <th className="py-4 pr-4">Маржа</th>
              <th className="py-4 pr-4">Кол-во</th>
              <th className="py-4 pr-4">Статус</th>
              <th className="py-4 pr-4">Комментарий</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-borderColor/70 align-top">
                <td className="py-4 pr-4">
                  {product.photoUrl ? (
                    <a href={product.photoUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                      Фото
                    </a>
                  ) : (
                    <span className="text-secondaryText">Нет</span>
                  )}
                </td>
                <td className="py-4 pr-4 font-semibold">{product.name}</td>
                <td className="py-4 pr-4 text-secondaryText">{product.article || "Не указан"}</td>
                <td className="py-4 pr-4 text-secondaryText">{product.brand || "Не указан"}</td>
                <td className="py-4 pr-4 text-secondaryText">{carName(product)}</td>
                <td className="py-4 pr-4 text-secondaryText">{money(product.salePrice)} тг</td>
                <td className={product.margin >= 0 ? "py-4 pr-4 text-success font-bold" : "py-4 pr-4 text-danger font-bold"}>
                  {money(product.margin)} тг
                </td>
                <td className="py-4 pr-4 text-secondaryText">{product.quantity}</td>
                <td className="py-4 pr-4"><ProductAvailabilityBadge availability={product.availability} /></td>
                <td className="py-4 pr-4 text-secondaryText max-w-sm whitespace-pre-wrap">
                  {product.comment || ""}
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-secondaryText">
                  Товары не найдены.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
