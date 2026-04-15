export interface Leave {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  reason: string;
  created_at: string;
}

export interface LeaveDrawerProps {
  opened: boolean;
  onClose: () => void;
  leave?: Leave | null;
  onSubmit: (data: Omit<Leave, "id" | "employee_name" | "created_at">) => void;
}

export interface FormLeave {
  employee_id: number;
  date: string;
  reason: string;
}
