import { getSiteSettings } from "@/lib/settings";

export default async function Contacts() {
  const settings = await getSiteSettings();

  return (
    <section id="contacts">
      <div className="container-custom">
        <div className="card p-8">
          <h2 className="text-4xl font-bold mb-8">Контакты</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div><h3 className="text-accent text-xl mb-3">Телефон</h3><p className="text-secondaryText">{settings.phone1}</p></div>
            <div><h3 className="text-accent text-xl mb-3">WhatsApp</h3><p className="text-secondaryText">{settings.whatsapp}</p></div>
            <div><h3 className="text-accent text-xl mb-3">Email</h3><p className="text-secondaryText">{settings.email}</p></div>
            <div><h3 className="text-accent text-xl mb-3">Адрес</h3><p className="text-secondaryText">{settings.address}</p></div>
            <div><h3 className="text-accent text-xl mb-3">Режим работы</h3><p className="text-secondaryText">{settings.workTime}</p></div>
            <div><h3 className="text-accent text-xl mb-3">Соцсети</h3><p className="text-secondaryText">{settings.instagram} • {settings.facebook}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
