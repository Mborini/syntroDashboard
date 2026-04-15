export type PurchaseItem = {
  id: number;
  name: string;
  weight: string;
  notes?: string | null | undefined;
};

export type CreatePurchaseItemDTO = {
  name: string;
  weight: string;
  notes?: string | null | undefined;
};

export type UpdatePurchaseItemDTO = {
  name: string;
  weight: string;
  notes?: string | null | undefined;
};

export type PurchaseItemDrawerProps = {
  opened: boolean;
  onClose: () => void;
  item: PurchaseItem | null;
  onSubmit: (data: CreatePurchaseItemDTO | UpdatePurchaseItemDTO) => void;
};
