export default function BackupExports() {
  return (
    <div className="card p-6">
      <h2 className="text-3xl font-bold mb-3">Резервные копии CRM</h2>

      <p className="text-secondaryText mb-6">
        Раз в неделю скачивайте эти файлы на компьютер. Это простая ручная защита от потери клиентской базы.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <a href="/api/export/clients" className="btn-secondary text-center">
          Скачать клиентов CSV
        </a>

        <a href="/api/export/offers" className="btn-secondary text-center">
          Скачать предложения CSV
        </a>

        <a href="/api/export/reports" className="btn-secondary text-center">
          Скачать отчёты CSV
        </a>
      </div>
    </div>
  );
}
