import { CreateSalesItemDTO, UpdateSalesItemDTO } from "@/types/salesItem";

const BASE_URL = "/api/sales-items";

export async function getSalesItems() {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch sales items");
  return res.json();
}

export async function createSalesItem(data: CreateSalesItemDTO) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create sales item");
  return res.json();
}

export async function updateSalesItem(id: number, data: UpdateSalesItemDTO) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update sales item");
  return res.json();
}

export async function deleteSalesItem(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await res.json(); // قراءة JSON حتى لو كان خطأ

  if (!res.ok) {
    // رمي البيانات لتلتقط في الـ catch على الـ frontend
    throw new Error(data.error || "فشل حذف الصنف");
  }

  return data;
}
