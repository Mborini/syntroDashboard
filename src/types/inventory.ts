export type InventoryItem = {
  item_id: number;
  name: string;
  weight: number;
  quantity: number;
  notes?: string;
};

export type InventoryFilterDTO = {
  name: string;
  weight: string;
};

export type CreateInventoryItemDTO = {
  name: string;
  weight: number;
  quantity: number;
  notes?: string;
};

export type UpdateInventoryItemDTO = CreateInventoryItemDTO;
