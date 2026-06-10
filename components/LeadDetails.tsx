import type { Lead } from "@/types/lead";
import LeadStatusSelect from "@/components/LeadStatusSelect";
import DealInfoPanel from "@/components/DealInfoPanel";

type LeadDetailsProps = { lead: Lead };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-secondaryText mb-2">{label}</p>
      <p className="text-lg font-semibold break-words">{value.trim() ? value : "Не указано"}</p>
    </div>
  );
}

export default function LeadDetails({ lead }: LeadDetailsProps) {
  const cleanPhone = normalizePhone(lead.phone);
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "#";

  return (
    <section className="pt-8 pb-8">
      <div className="container-custom">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <p className="text-accent font-semibold mb-2">Карточка клиента</p>
            <h1 className="text-4xl font-bold">{lead.name}</h1>
            <p className="text-secondaryText mt-2">Заявка создана: {formatDate(lead.createdAt)}</p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary text-center">Написать в WhatsApp</a>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">
            <Field label="Телефон" value={lead.phone} />
            <Field label="Марка автомобиля" value={lead.carBrand} />
            <Field label="Модель автомобиля" value={lead.carModel} />
            <Field label="Год выпуска" value={lead.year} />
            <Field label="VIN-код" value={lead.vin} />
            <Field label="Нужная запчасть" value={lead.partRequest} />

            <div className="card p-5 md:col-span-2">
              <p className="text-sm text-secondaryText mb-2">Комментарий клиента</p>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{lead.comment.trim() ? lead.comment : "Комментарий не указан"}</p>
            </div>

            <div className="card p-5 md:col-span-2">
              <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
            </div>
          </div>

          <DealInfoPanel lead={lead} />
        </div>
      </div>
    </section>
  );
}
