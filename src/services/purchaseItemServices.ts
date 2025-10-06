import { CreatePurchaseItemDTO, UpdatePurchaseItemDTO } from "@/types/purchaseItem";

const BASE_URL = "/api/purchase-items";

export async function getPurchaseItems() {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch purchase items");
  return res.json();
}

export async function createPurchaseItem(data: CreatePurchaseItemDTO) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create purchase item");
  return res.json();
}

export async function updatePurchaseItem(id: number, data: UpdatePurchaseItemDTO) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update purchase item");
  return res.json();
}
export async function deletePurchaseItem(id: number) {
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
