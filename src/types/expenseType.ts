export type ExpenseType = {
  id: number;
  name: string;
  created_at?: string;
};

export type CreateExpenseTypeDTO = {
  name: string;
};

export type UpdateExpenseTypeDTO = {
  name: string;
};

export type ExpenseTypeDrawerProps = {
  opened: boolean;
  onClose: () => void;
  expenseType: ExpenseType | null;
  onSubmit: (data: CreateExpenseTypeDTO | UpdateExpenseTypeDTO) => void;
};
