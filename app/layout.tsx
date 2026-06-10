import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бутик Автозапчастей",
  description: "Подбор автозапчастей по VIN-коду и параметрам автомобиля.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
