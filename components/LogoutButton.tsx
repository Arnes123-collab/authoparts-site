"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  async function handleLogout() {
    setIsSending(true);

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSending}
      className="btn-secondary"
    >
      {isSending ? "Выходим..." : "Выйти"}
    </button>
  );
}
