import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export default async function Header() {
  const settings = await getSiteSettings();
  const whatsappUrl = `https://wa.me/${normalizePhone(settings.whatsapp)}`;

  return (
    <header className="border-b border-borderColor sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container-custom h-20 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <h1 className="text-2xl font-bold text-accent">{settings.logoText}</h1>
          <p className="text-sm text-secondaryText">{settings.logoSubtitle}</p>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-secondaryText">
          <a href="/#home" className="hover:text-accent">Главная</a>
          <a href="/#brands" className="hover:text-accent">Марки</a>
          <a href="/#categories" className="hover:text-accent">Категории</a>
          <a href="/#lead" className="hover:text-accent">Подбор запчасти</a>
          <a href="/#contacts" className="hover:text-accent">Контакты</a>
          <Link href="/admin" className="hover:text-accent">CRM</Link>
        </nav>

        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
          WhatsApp
        </a>
      </div>
    </header>
  );
}
