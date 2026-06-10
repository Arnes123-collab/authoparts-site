import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fitness Coach Pro - сайт и система тренера",
  description:
    "Профессиональный сайт и веб-система для фитнес-тренеров, онлайн-коучей и тренеров 40+.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
