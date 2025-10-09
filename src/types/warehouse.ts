export type WarehouseItem = {
  item_id: number;
  sales_item_id: number;
  item_name: string; // الاسم من جدول المبيعات
    quantity: string;
  weight: number;
  note?: string;
  production_date: string;
};


export type WarehouseFilterDTO = {
  name: string;
  weight: string;
  quantity: string;
};
