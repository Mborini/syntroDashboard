export interface Payroll {
  id: number;
  employee_id: number;
  employee_name: string;
  amount: number;
  month: string;
  notes?: string;
  created_at?: string;
}

export interface FormPayroll {
  employee_id: number;
  amount: number;
  month: string;
  notes?: string;
}

export interface PayrollDrawerProps {
  opened: boolean;
  onClose: () => void;
  payroll: Payroll | null;
  onSubmit: (data: Omit<Payroll, "id" | "employee_name" | "created_at">) => void;
}
