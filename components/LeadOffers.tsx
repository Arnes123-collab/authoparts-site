"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  LeadOffer,
  LeadOfferFormData,
  LeadOfferStatus,
} from "@/types/lead-offer";
import { offerStatusLabels } from "@/components/OfferLabels";

type LeadOffersProps = {
  leadId: string;
  defaultRequestedPart: string;
};

const statuses: LeadOfferStatus[] = [
  "draft",
  "offered",
  "accepted",
  "rejected",
  "purchased",
  "sold",
];

const initialForm = (leadId: string, requestedPart: string): LeadOfferFormData => ({
  leadId,
  requestedPart,
  offeredPart: "",
  supplier: "",
  costPrice: 0,
  salePrice: 0,
  status: "draft",
  comment: "",
});

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function LeadOffers({
  leadId,
  defaultRequestedPart,
}: LeadOffersProps) {
  const [offers, setOffers] = useState<LeadOffer[]>([]);
  const [form, setForm] = useState<LeadOfferFormData>(
    initialForm(leadId, defaultRequestedPart)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const margin = useMemo(() => {
    return Number(form.salePrice || 0) - Number(form.costPrice || 0);
  }, [form.salePrice, form.costPrice]);

  const totalMargin = offers.reduce((sum, item) => sum + item.margin, 0);
  const totalSales = offers.reduce((sum, item) => sum + item.salePrice, 0);

  function updateForm<K extends keyof LeadOfferFormData>(
    key: K,
    value: LeadOfferFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function loadOffers() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/lead-offers?leadId=${leadId}`);

      if (!response.ok) {
        throw new Error("Не удалось загрузить предложения.");
      }

      const data = (await response.json()) as LeadOffer[];
      setOffers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.requestedPart.trim() || !form.offeredPart.trim()) {
      setError("Укажите, что клиент просил и что вы предложили.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/lead-offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as LeadOffer | { message?: string };

      if (!response.ok) {
        throw new Error("message" in data ? data.message : "Ошибка сохранения.");
      }

      setOffers((current) => [data as LeadOffer, ...current]);
      setForm(initialForm(leadId, defaultRequestedPart));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    void loadOffers();
  }, [leadId]);

  return (
    <section className="pt-6 pb-8">
      <div className="container-custom">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">
            <div>
              <p className="text-accent font-semibold mb-2">
                Мини-база товаров
              </p>
              <h2 className="text-3xl font-bold">
                Что просил клиент и что предложили
              </h2>
              <p className="text-secondaryText mt-2">
                Это не склад и не большой каталог. Это учёт предложений и маржи по конкретному клиенту.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-full lg:min-w-[360px]">
              <div className="bg-secondary border border-borderColor rounded-2xl p-4">
                <p className="text-secondaryText text-sm">Сумма предложений</p>
                <p className="text-2xl font-bold mt-1">{money(totalSales)} тг</p>
              </div>

              <div className="bg-secondary border border-borderColor rounded-2xl p-4">
                <p className="text-secondaryText text-sm">Маржа</p>
                <p className="text-2xl font-bold mt-1">{money(totalMargin)} тг</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5 mb-8">
            <input
              className="input-dark"
              placeholder="Что клиент просил"
              value={form.requestedPart}
              onChange={(event) => updateForm("requestedPart", event.target.value)}
              required
            />

            <input
              className="input-dark"
              placeholder="Что предложили"
              value={form.offeredPart}
              onChange={(event) => updateForm("offeredPart", event.target.value)}
              required
            />

            <input
              className="input-dark"
              placeholder="Поставщик / источник"
              value={form.supplier}
              onChange={(event) => updateForm("supplier", event.target.value)}
            />

            <select
              className="input-dark"
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value as LeadOfferStatus)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {offerStatusLabels[status]}
                </option>
              ))}
            </select>

            <input
              className="input-dark"
              type="number"
              min="0"
              placeholder="Закупочная цена"
              value={form.costPrice}
              onChange={(event) => updateForm("costPrice", Number(event.target.value))}
            />

            <input
              className="input-dark"
              type="number"
              min="0"
              placeholder="Цена клиенту"
              value={form.salePrice}
              onChange={(event) => updateForm("salePrice", Number(event.target.value))}
            />

            <div className="bg-secondary border border-borderColor rounded-2xl p-4 md:col-span-2">
              <p className="text-secondaryText text-sm">Расчётная маржа</p>
              <p className={margin >= 0 ? "text-3xl font-bold text-success" : "text-3xl font-bold text-danger"}>
                {money(margin)} тг
              </p>
            </div>

            <textarea
              className="input-dark md:col-span-2 min-h-[100px]"
              placeholder="Комментарий: качество, срок доставки, аналог / оригинал..."
              value={form.comment}
              onChange={(event) => updateForm("comment", event.target.value)}
            />

            {error && (
              <div className="rounded-xl bg-danger p-4 text-white md:col-span-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={isSaving} className="btn-primary md:col-span-2">
              {isSaving ? "Сохраняем..." : "Добавить предложение"}
            </button>
          </form>

          {isLoading ? (
            <p className="text-secondaryText">Загружаем предложения...</p>
          ) : offers.length === 0 ? (
            <p className="text-secondaryText">
              По этому клиенту пока нет предложений.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-borderColor text-left text-secondaryText">
                    <th className="py-4 pr-4">Дата</th>
                    <th className="py-4 pr-4">Просил</th>
                    <th className="py-4 pr-4">Предложили</th>
                    <th className="py-4 pr-4">Поставщик</th>
                    <th className="py-4 pr-4">Закуп</th>
                    <th className="py-4 pr-4">Продажа</th>
                    <th className="py-4 pr-4">Маржа</th>
                    <th className="py-4 pr-4">Статус</th>
                  </tr>
                </thead>

                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-b border-borderColor/70">
                      <td className="py-4 pr-4 text-secondaryText">{formatDate(offer.createdAt)}</td>
                      <td className="py-4 pr-4">{offer.requestedPart}</td>
                      <td className="py-4 pr-4">{offer.offeredPart}</td>
                      <td className="py-4 pr-4 text-secondaryText">{offer.supplier || "Не указан"}</td>
                      <td className="py-4 pr-4 text-secondaryText">{money(offer.costPrice)} тг</td>
                      <td className="py-4 pr-4 text-secondaryText">{money(offer.salePrice)} тг</td>
                      <td className={offer.margin >= 0 ? "py-4 pr-4 text-success font-bold" : "py-4 pr-4 text-danger font-bold"}>
                        {money(offer.margin)} тг
                      </td>
                      <td className="py-4 pr-4 text-secondaryText">{offerStatusLabels[offer.status]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
