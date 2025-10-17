// types/withdrawal.ts
export interface Withdrawal {
  id: number;
  employee_id: number;
  employee_name: string;
  amount: number;
  date: string;
  note?: string;
}

export interface CreateWithdrawalDTO {
  employee_id: number;
  amount: number;
  date: string;
  note?: string;
}

export interface UpdateWithdrawalDTO extends CreateWithdrawalDTO {}
