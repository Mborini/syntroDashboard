export interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export interface CreateSupplierDTO {
  name: string;
  phone: string;
  address: string;
}

export interface UpdateSupplierDTO {
  name: string;
  phone: string;
  address: string;
}

export interface SupplierDrawerProps {
  opened: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  onSubmit: (data: CreateSupplierDTO | UpdateSupplierDTO) => void;
}
