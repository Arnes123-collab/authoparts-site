create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  car_brand text,
  car_model text,
  year text,
  vin text,
  part_request text,
  comment text,
  status text not null default 'new',
  deal_stage text not null default 'new_request',
  estimated_amount numeric default 0,
  next_contact_date date,
  priority text not null default 'medium',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table leads add column if not exists updated_at timestamp default now();
alter table leads add column if not exists deal_stage text not null default 'new_request';
alter table leads add column if not exists estimated_amount numeric default 0;
alter table leads add column if not exists next_contact_date date;
alter table leads add column if not exists priority text not null default 'medium';

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  note text not null,
  created_at timestamp default now()
);

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_deal_stage_idx on leads(deal_stage);
create index if not exists leads_priority_idx on leads(priority);
create index if not exists leads_next_contact_date_idx on leads(next_contact_date);
create index if not exists leads_phone_idx on leads(phone);
create index if not exists leads_vin_idx on leads(vin);
create index if not exists leads_created_at_idx on leads(created_at);
create index if not exists lead_notes_lead_id_idx on lead_notes(lead_id);


create table if not exists lead_offers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  requested_part text not null,
  offered_part text not null,
  supplier text,
  cost_price numeric default 0,
  sale_price numeric default 0,
  margin numeric generated always as (sale_price - cost_price) stored,
  status text not null default 'draft',
  comment text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create index if not exists lead_offers_lead_id_idx on lead_offers(lead_id);
create index if not exists lead_offers_status_idx on lead_offers(status);
create index if not exists lead_offers_created_at_idx on lead_offers(created_at);


create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null,
  processed_leads integer not null default 0,
  sent_offers integer not null default 0,
  client_replies integer not null default 0,
  rejections integer not null default 0,
  sales_count integer not null default 0,
  sales_amount numeric not null default 0,
  comment text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create index if not exists daily_reports_report_date_idx on daily_reports(report_date);
create index if not exists daily_reports_created_at_idx on daily_reports(created_at);


create table if not exists site_settings (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  name text,
  slogan text,
  logo_text text,
  logo_subtitle text,
  phone1 text,
  phone2 text,
  whatsapp text,
  email text,
  address text,
  work_time text,
  instagram text,
  facebook text,
  telegram text,
  hero_title text,
  hero_subtitle text,
  about_text text,
  footer_text text,
  requisites text,
  commercial_signature text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

insert into site_settings (
  id,
  name,
  slogan,
  logo_text,
  logo_subtitle,
  phone1,
  phone2,
  whatsapp,
  email,
  address,
  work_time,
  instagram,
  facebook,
  telegram,
  hero_title,
  hero_subtitle,
  about_text,
  footer_text,
  requisites,
  commercial_signature
)
values (
  '00000000-0000-0000-0000-000000000001',
  'JDM PARTS',
  'Запчасти для Toyota, Lexus, Hyundai и Kia',
  'JDM PARTS',
  'Toyota • Lexus • Hyundai • Kia',
  '+7 777 123 45 67',
  '+7 701 123 45 67',
  '+7 777 123 45 67',
  'info@jdmparts.kz',
  'г. Алматы, ул. Абая 100',
  'Пн-Сб 09:00-18:00',
  '@jdmparts.kz',
  'JDM Parts Kazakhstan',
  '@jdmparts',
  'Автозапчасти для Toyota, Lexus, Hyundai и Kia',
  'Оставьте заявку - мы подберём нужную деталь по марке, модели или VIN-коду.',
  'JDM PARTS помогает быстро подобрать японские и корейские автозапчасти под ваш автомобиль.',
  'Подбор автозапчастей по VIN и параметрам автомобиля.',
  'ИП / ТОО: JDM PARTS
БИН/ИИН: 000000000000
Банк: Kaspi Bank
IBAN: KZ000000000000000000',
  'С уважением, JDM PARTS'
)
on conflict (id) do nothing;


create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  article text,
  brand text,
  category text,
  car_brand text,
  car_model text,
  year_range text,
  cost_price numeric default 0,
  sale_price numeric default 0,
  margin numeric generated always as (sale_price - cost_price) stored,
  quantity integer not null default 1,
  availability text not null default 'in_stock',
  photo_url text,
  comment text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create index if not exists products_name_idx on products(name);
create index if not exists products_article_idx on products(article);
create index if not exists products_brand_idx on products(brand);
create index if not exists products_car_brand_idx on products(car_brand);
create index if not exists products_availability_idx on products(availability);
create index if not exists products_created_at_idx on products(created_at);
