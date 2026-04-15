export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export interface CreateCustomerDTO {
  name: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerDTO {
  name: string;
  phone: string;
  address: string;
}

export interface CustomerDrawerProps {
  opened: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSubmit: (data: CreateCustomerDTO | UpdateCustomerDTO) => void;
}
