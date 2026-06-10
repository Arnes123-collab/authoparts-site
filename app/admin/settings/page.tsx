import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import SettingsClient from "@/components/SettingsClient";
import BackupExports from "@/components/BackupExports";
import { getSiteSettings } from "@/lib/settings";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-accent font-semibold mb-2">
              Управление сайтом
            </p>

            <h1 className="text-4xl font-bold">
              Настройки магазина
            </h1>

            <p className="text-secondaryText mt-2">
              Здесь сын сможет менять контакты, логотип, тексты сайта и скачивать резервные копии без редактирования кода.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="btn-secondary">
              Назад в CRM
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="space-y-8">
          <SettingsClient initialSettings={settings} />
          <BackupExports />
        </div>
      </div>
    </main>
  );
}
