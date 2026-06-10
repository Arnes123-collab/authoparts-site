"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormProps = {
  nextPath: string;
};

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Не удалось войти.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm text-secondaryText mb-2">
          Пароль администратора
        </label>

        <input
          type="password"
          className="input-dark"
          placeholder="Введите пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoFocus
        />
      </div>

      {error && (
        <div className="rounded-xl bg-danger p-4 text-white">
          {error}
        </div>
      )}

      <button type="submit" disabled={isSending} className="btn-primary w-full">
        {isSending ? "Проверяем..." : "Войти"}
      </button>
    </form>
  );
}
