"use client";

import { useState } from "react";
import type { LeadFormData } from "@/types/lead";

const initialForm: LeadFormData = {
  name: "",
  phone: "",
  carBrand: "",
  carModel: "",
  year: "",
  vin: "",
  partRequest: "",
  comment: "",
};

export default function LeadForm() {
  const [form, setForm] = useState<LeadFormData>(initialForm);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setIsSending(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Не удалось отправить заявку.");

      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки заявки.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section id="lead">
      <div className="container-custom">
        <div className="card p-8 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-3">Подбор запчасти</h2>
          <p className="text-secondaryText mb-8">Заполните форму - заявка сохранится в CRM.</p>

          {success && <div className="mb-6 p-4 rounded-xl bg-success text-white">Заявка успешно отправлена.</div>}
          {error && <div className="mb-6 p-4 rounded-xl bg-danger text-white">{error}</div>}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <input className="input-dark" name="name" placeholder="Ваше имя" value={form.name} onChange={handleChange} required />
            <input className="input-dark" name="phone" placeholder="Телефон" value={form.phone} onChange={handleChange} required />
            <input className="input-dark" name="carBrand" placeholder="Марка автомобиля" value={form.carBrand} onChange={handleChange} />
            <input className="input-dark" name="carModel" placeholder="Модель автомобиля" value={form.carModel} onChange={handleChange} />
            <input className="input-dark" name="year" placeholder="Год выпуска" value={form.year} onChange={handleChange} />
            <input className="input-dark" name="vin" placeholder="VIN-код" value={form.vin} onChange={handleChange} />
            <input className="input-dark md:col-span-2" name="partRequest" placeholder="Какая запчасть нужна" value={form.partRequest} onChange={handleChange} required />
            <textarea className="input-dark md:col-span-2 min-h-[120px]" name="comment" placeholder="Комментарий" value={form.comment} onChange={handleChange} />
            <button type="submit" disabled={isSending} className="btn-primary md:col-span-2">
              {isSending ? "Отправляем..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
