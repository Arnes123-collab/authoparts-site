"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lead } from "@/types/lead";
import type { LeadOffer } from "@/types/lead-offer";
import { offerStatusLabels } from "@/components/OfferLabels";

type CommercialOfferPanelProps = {
  lead: Lead;
  offers: LeadOffer[];
  signature?: string;
};

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

function buildCommercialOfferText(lead: Lead, offers: LeadOffer[], signature = "С уважением, JDM PARTS") {
  const activeOffers = offers.filter((offer) => offer.status !== "rejected");

  const lines = [
    `Здравствуйте, ${lead.name}!`,
    "",
    "Подготовили предложение по вашему запросу:",
    `Автомобиль: ${[lead.carBrand, lead.carModel, lead.year].filter(Boolean).join(" ") || "не указан"}`,
    lead.vin ? `VIN: ${lead.vin}` : "",
    `Запрос: ${lead.partRequest || "не указан"}`,
    "",
    "Варианты:",
  ].filter(Boolean);

  if (activeOffers.length === 0) {
    lines.push("Пока варианты не добавлены.");
  } else {
    activeOffers.forEach((offer, index) => {
      lines.push(
        "",
        `${index + 1}. ${offer.offeredPart}`,
        `Цена: ${money(offer.salePrice)} тг`,
        `Статус: ${offerStatusLabels[offer.status]}`,
        offer.comment ? `Комментарий: ${offer.comment}` : ""
      );
    });
  }

  lines.push(
    "",
    "Если подходит - напишите, пожалуйста, какой вариант оформить.",
    signature
  );

  return lines.filter(Boolean).join("\n");
}

export default function CommercialOfferPanel({
  lead,
  offers,
  signature,
}: CommercialOfferPanelProps) {
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    return buildCommercialOfferText(lead, offers, signature);
  }, [lead, offers]);

  const whatsappPhone = normalizePhone(lead.phone);
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`
    : "#";

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <section className="pt-6 pb-8">
      <div className="container-custom">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
            <div>
              <p className="text-accent font-semibold mb-2">
                Коммерческое предложение
              </p>

              <h2 className="text-3xl font-bold">
                Быстро отправить клиенту
              </h2>

              <p className="text-secondaryText mt-2">
                CRM автоматически собирает текст из карточки клиента и предложенных товаров.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={copyText} className="btn-primary">
                {copied ? "Скопировано" : "Скопировать текст"}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Открыть WhatsApp
              </a>

              <Link href={`/admin/leads/${lead.id}/print`} className="btn-secondary">
                Печать / PDF
              </Link>
            </div>
          </div>

          <pre className="bg-secondary border border-borderColor rounded-2xl p-5 whitespace-pre-wrap leading-relaxed text-sm md:text-base overflow-x-auto">
            {text}
          </pre>
        </div>
      </div>
    </section>
  );
}
