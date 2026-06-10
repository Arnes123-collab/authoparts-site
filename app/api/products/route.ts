import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  mapProductFromDb,
  type ProductAvailability,
  type ProductDbRow,
  type ProductFormData,
} from "@/types/product";

const allowedAvailability: ProductAvailability[] = [
  "in_stock",
  "preorder",
  "sold",
  "hidden",
];

function toNonNegativeNumber(value: number | undefined) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue) || numberValue < 0) {
    return null;
  }
  return numberValue;
}

function toNonNegativeInteger(value: number | undefined) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue) || numberValue < 0) {
    return null;
  }
  return Math.floor(numberValue);
}

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ProductDbRow[]>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось загрузить товары." },
      { status: 500 }
    );
  }

  return NextResponse.json(data.map(mapProductFromDb));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ProductFormData;

  if (!body.name?.trim()) {
    return NextResponse.json(
      { message: "Название товара обязательно." },
      { status: 400 }
    );
  }

  if (!allowedAvailability.includes(body.availability)) {
    return NextResponse.json(
      { message: "Некорректный статус наличия." },
      { status: 400 }
    );
  }

  const costPrice = toNonNegativeNumber(body.costPrice);
  const salePrice = toNonNegativeNumber(body.salePrice);
  const quantity = toNonNegativeInteger(body.quantity);

  if (costPrice === null || salePrice === null || quantity === null) {
    return NextResponse.json(
      { message: "Цена и количество должны быть не меньше нуля." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: body.name.trim(),
      article: body.article?.trim() || null,
      brand: body.brand?.trim() || null,
      category: body.category?.trim() || null,
      car_brand: body.carBrand?.trim() || null,
      car_model: body.carModel?.trim() || null,
      year_range: body.yearRange?.trim() || null,
      cost_price: costPrice,
      sale_price: salePrice,
      quantity,
      availability: body.availability,
      photo_url: body.photoUrl?.trim() || null,
      comment: body.comment?.trim() || null,
    })
    .select("*")
    .single<ProductDbRow>();

  if (error) {
    return NextResponse.json(
      { message: "Не удалось сохранить товар." },
      { status: 500 }
    );
  }

  return NextResponse.json(mapProductFromDb(data), { status: 201 });
}
