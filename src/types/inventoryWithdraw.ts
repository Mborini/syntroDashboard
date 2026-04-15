export type InventoryWithdraw = {
  id: number;
  item_id: number;
  item_name: string;
  item_weight: number;
  quantity: number;
  notes: string | null;
  created_at: string;
};
