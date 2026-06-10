"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Ошибка входа");
      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl sport-card p-8 shadow-xl">
        <p className="text-sm font-black text-[var(--accent)]">Fitness Coach Pro</p>
        <h1 className="mt-2 text-3xl font-black">Вход в админ-панель</h1>
        <p className="mt-3 text-[var(--muted)]">Введите пароль тренера из переменной ADMIN_PASSWORD.</p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Пароль"
          className="mt-6 w-full rounded-xl border border-[var(--border)] p-4 outline-none focus:border-[var(--accent)]"
        />
        {error && <p className="mt-4 rounded-xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-[var(--accent)] px-6 py-4 font-black text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
        >
          {isLoading ? "Проверяем..." : "Войти"}
        </button>
      </form>
    </main>
  );
}
