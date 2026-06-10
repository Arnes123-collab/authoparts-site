import type { ProductAvailability } from "@/types/product";

export const productAvailabilityLabels: Record<ProductAvailability, string> = {
  in_stock: "В наличии",
  preorder: "Под заказ",
  sold: "Продано",
  hidden: "Скрыто",
};

export const productCategories = [
  "Двигатель",
  "Ходовая часть",
  "Тормозная система",
  "Электрика",
  "Фильтры",
  "Масла и жидкости",
  "Кузовные детали",
  "Оптика",
  "Аксессуары",
  "Другое",
];

export const carBrands = [
  "Toyota",
  "Lexus",
  "Hyundai",
  "Kia",
  "Honda",
  "Nissan",
  "Mazda",
  "Subaru",
  "Mitsubishi",
  "Другое",
];
