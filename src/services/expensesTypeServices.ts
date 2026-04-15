import {
  CreateExpenseTypeDTO,
  UpdateExpenseTypeDTO,
  ExpenseType,
} from "@/types/expenseType";

const API_URL = "/api/expense-types";

export async function getExpenseTypes(): Promise<ExpenseType[]> {
  const res = await fetch(API_URL, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch expense types");
  }

  return res.json();
}

export async function createExpenseType(data: CreateExpenseTypeDTO) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create expense type");
  }

  return res.json();
}

export async function updateExpenseType(id: number, data: UpdateExpenseTypeDTO) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update expense type");
  }

  return res.json();
}

export async function deleteExpenseType(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete expense type");
  }

  return res.json();
}
