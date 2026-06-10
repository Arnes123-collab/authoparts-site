"use client";

import { useMemo, useState } from "react";
import type {
  Product,
  ProductAvailability,
  ProductFormData,
} from "@/types/product";
import {
  carBrands,
  productAvailabilityLabels,
  productCategories,
} from "@/components/ProductLabels";

type ProductFormProps = {
  onCreated: (product: Product) => void;
};

const initialForm: ProductFormData = {
  name: "",
  article: "",
  brand: "",
  category: "",
  carBrand: "Toyota",
  carModel: "",
  yearRange: "",
  costPrice: 0,
  salePrice: 0,
  quantity: 1,
  availability: "in_stock",
  photoUrl: "",
  comment: "",
};

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export default function ProductForm({ onCreated }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const margin = useMemo(() => {
    return Number(form.salePrice || 0) - Number(form.costPrice || 0);
  }, [form.salePrice, form.costPrice]);

  function updateField<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as Product | { message?: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "Ошибка сохранения.");
      }

      onCreated(data as Product);
      setForm(initialForm);
      setSuccess("Товар добавлен в каталог.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения товара.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-3xl font-bold mb-2">Быстро добавить запчасть</h2>

      <p className="text-secondaryText mb-6">
        Для продавца в бутике: обязательны только название, цена продажи и количество. Остальное можно заполнить позже.
      </p>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
        <input
          className="input-dark md:col-span-2"
          placeholder="Название запчасти *"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
        />

        <input
          className="input-dark"
          placeholder="Артикул"
          value={form.article}
          onChange={(event) => updateField("article", event.target.value)}
        />

        <input
          className="input-dark"
          placeholder="Бренд / производитель"
          value={form.brand}
          onChange={(event) => updateField("brand", event.target.value)}
        />

        <select
          className="input-dark"
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
        >
          <option value="">Категория</option>
          {productCategories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          className="input-dark"
          value={form.carBrand}
          onChange={(event) => updateField("carBrand", event.target.value)}
        >
          {carBrands.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <input
          className="input-dark"
          placeholder="Модель авто: Camry, Prado, Tucson..."
          value={form.carModel}
          onChange={(event) => updateField("carModel", event.target.value)}
        />

        <input
          className="input-dark"
          placeholder="Годы: 2012-2018"
          value={form.yearRange}
          onChange={(event) => updateField("yearRange", event.target.value)}
        />

        <input
          className="input-dark"
          type="number"
          min="0"
          placeholder="Цена закупа"
          value={form.costPrice}
          onChange={(event) => updateField("costPrice", Number(event.target.value))}
        />

        <input
          className="input-dark"
          type="number"
          min="0"
          placeholder="Цена продажи *"
          value={form.salePrice}
          onChange={(event) => updateField("salePrice", Number(event.target.value))}
        />

        <input
          className="input-dark"
          type="number"
          min="0"
          placeholder="Количество *"
          value={form.quantity}
          onChange={(event) => updateField("quantity", Number(event.target.value))}
        />

        <select
          className="input-dark"
          value={form.availability}
          onChange={(event) => updateField("availability", event.target.value as ProductAvailability)}
        >
          {(Object.keys(productAvailabilityLabels) as ProductAvailability[]).map((key) => (
            <option key={key} value={key}>{productAvailabilityLabels[key]}</option>
          ))}
        </select>

        <input
          className="input-dark md:col-span-2"
          placeholder="Ссылка на фото"
          value={form.photoUrl}
          onChange={(event) => updateField("photoUrl", event.target.value)}
        />

        <div className="bg-secondary border border-borderColor rounded-2xl p-4 md:col-span-2">
          <p className="text-secondaryText text-sm">Расчётная маржа</p>
          <p className={margin >= 0 ? "text-3xl font-bold text-success" : "text-3xl font-bold text-danger"}>
            {money(margin)} тг
          </p>
        </div>

        <textarea
          className="input-dark md:col-span-2 min-h-[100px]"
          placeholder="Комментарий: состояние, оригинал/аналог, полка, срок поставки..."
          value={form.comment}
          onChange={(event) => updateField("comment", event.target.value)}
        />

        {error && <div className="rounded-xl bg-danger p-4 text-white md:col-span-2">{error}</div>}
        {success && <div className="rounded-xl bg-success p-4 text-white md:col-span-2">{success}</div>}

        <button type="submit" disabled={isSaving} className="btn-primary md:col-span-2">
          {isSaving ? "Сохраняем..." : "Добавить товар"}
        </button>
      </form>
    </div>
  );
}
