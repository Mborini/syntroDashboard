export type SalesItem = {
  id: number;
  name: string;
  sale_price: string;
  cost_price: string;
  weight: string;
  notes?: string | null | undefined;
};

export type CreateSalesItemDTO = {
  name: string;
  sale_price: string;
  cost_price: string;
  weight: string;
  notes?: string | null | undefined;
};

export type UpdateSalesItemDTO = {
  name: string;
  sale_price: string;

  cost_price: string;
  weight: string;
  notes?: string | null | undefined;
};

export type SalesItemDrawerProps = {
  opened: boolean;
  onClose: () => void;
  item: SalesItem | null;
  onSubmit: (data: CreateSalesItemDTO | UpdateSalesItemDTO) => void;
};
