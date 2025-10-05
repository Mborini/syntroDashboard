export interface Employee {
  id: number;
  name: string;
  phone: string;
  address: string;
  start_date: string;
  end_date: string;
  salary: number;
  is_active: boolean;
}

export interface FormEmployee {
  name: string;
  phone: string;
  address: string;
  start_date: string;
  end_date: string;
  salary: number;
  is_active: boolean;
}

export interface CreateEmployeeDTO {
  name: string;
  phone: string;
  address: string;
  start_date: string;
  end_date: string;
  salary: number;
  is_active: boolean;
}

export interface UpdateEmployeeDTO extends CreateEmployeeDTO {}

export interface EmployeeDrawerProps {
  opened: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSubmit: (data: CreateEmployeeDTO | UpdateEmployeeDTO) => void;
}
