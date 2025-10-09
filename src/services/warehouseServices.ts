import { WarehouseItem } from "@/types/warehouse";

const API = "/api/warehouse";

export async function getWarehouseItems(): Promise<WarehouseItem[]> {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to load warehouse items");
  return res.json();
}

export async function addWarehouseItem(item: Omit<WarehouseItem, "item_id">) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add warehouse item");
}

export async function updateWarehouseItem(
  id: number,
  item: Partial<WarehouseItem>,
) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to update warehouse item");
}

export async function deleteWarehouseItem(id: number) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete warehouse item");
}
