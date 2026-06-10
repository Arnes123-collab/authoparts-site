export type ProductAvailability =
  | "in_stock"
  | "preorder"
  | "sold"
  | "hidden";

export interface Product {
  id: string;
  name: string;
  article: string;
  brand: string;
  category: string;
  carBrand: string;
  carModel: string;
  yearRange: string;
  costPrice: number;
  salePrice: number;
  margin: number;
  quantity: number;
  availability: ProductAvailability;
  photoUrl: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductDbRow {
  id: string;
  name: string;
  article: string | null;
  brand: string | null;
  category: string | null;
  car_brand: string | null;
  car_model: string | null;
  year_range: string | null;
  cost_price: number | string | null;
  sale_price: number | string | null;
  margin: number | string | null;
  quantity: number | string | null;
  availability: ProductAvailability;
  photo_url: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string | null;
}

export type ProductFormData = {
  name: string;
  article: string;
  brand: string;
  category: string;
  carBrand: string;
  carModel: string;
  yearRange: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  availability: ProductAvailability;
  photoUrl: string;
  comment: string;
};

export function mapProductFromDb(row: ProductDbRow): Product {
  const costPrice = Number(row.cost_price ?? 0);
  const salePrice = Number(row.sale_price ?? 0);

  return {
    id: row.id,
    name: row.name,
    article: row.article ?? "",
    brand: row.brand ?? "",
    category: row.category ?? "",
    carBrand: row.car_brand ?? "",
    carModel: row.car_model ?? "",
    yearRange: row.year_range ?? "",
    costPrice,
    salePrice,
    margin: Number(row.margin ?? salePrice - costPrice),
    quantity: Number(row.quantity ?? 0),
    availability: row.availability,
    photoUrl: row.photo_url ?? "",
    comment: row.comment ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
