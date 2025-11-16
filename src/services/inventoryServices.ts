import {
  InventoryItem,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
} from "@/types/inventory";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const res = await fetch("/api/inventory", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل جلب بيانات المستودع");
  return res.json();
}


// إذا أردت إضافة/تعديل أصناف يدويًا في المستقبل
export async function createInventoryItem(
  data: CreateInventoryItemDTO
): Promise<void> {
  await fetch("/api/inventory", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateInventoryItem(
  id: number,
  data: UpdateInventoryItemDTO
): Promise<void> {
  await fetch(`/api/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteInventoryItem(id: number): Promise<void> {
  await fetch(`/api/inventory/${id}`, {
    method: "DELETE",
  });
}
export async function withdrawFromInventory(data: {
  item_id: number;
  quantity: number;
  notes?: string;
}) {
  const res = await fetch("/api/inventory/withdrawals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("فشل السحب من المستودع");
  return await res.json();
}

