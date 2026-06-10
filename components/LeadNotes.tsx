"use client";

import { useEffect, useState } from "react";
import type { LeadNote } from "@/types/lead-note";

type LeadNotesProps = { leadId: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function LeadNotes({ leadId }: LeadNotesProps) {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadNotes() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/lead-notes?leadId=${leadId}`);
      if (!response.ok) throw new Error("Не удалось загрузить историю обращений.");
      const data = (await response.json()) as LeadNote[];
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) {
      setError("Заметка не может быть пустой.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/lead-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, note: note.trim() }),
      });
      if (!response.ok) throw new Error("Не удалось сохранить заметку.");
      const savedNote = (await response.json()) as LeadNote;
      setNotes((current) => [savedNote, ...current]);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => { void loadNotes(); }, [leadId]);

  return (
    <section className="pt-6 pb-16">
      <div className="container-custom">
        <div className="card p-6">
          <h2 className="text-3xl font-bold mb-6">История обращений</h2>
          <form onSubmit={handleSubmit} className="mb-8">
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className="input-dark min-h-[120px] mb-4" placeholder="Например: позвонил клиенту, ждёт цену на передние стойки..." />
            <button type="submit" disabled={isSaving} className="btn-primary">{isSaving ? "Сохраняем..." : "Добавить заметку"}</button>
          </form>
          {error && <p className="text-danger mb-4">{error}</p>}
          {isLoading ? (
            <p className="text-secondaryText">Загружаем историю...</p>
          ) : notes.length === 0 ? (
            <p className="text-secondaryText">Пока нет заметок по этому клиенту.</p>
          ) : (
            <div className="space-y-4">
              {notes.map((item) => (
                <article key={item.id} className="bg-secondary border border-borderColor rounded-2xl p-5">
                  <p className="text-secondaryText text-sm mb-2">{formatDate(item.createdAt)}</p>
                  <p className="leading-relaxed whitespace-pre-wrap">{item.note}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
