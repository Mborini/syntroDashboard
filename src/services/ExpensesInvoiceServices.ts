// src/services/expensesInvoiceServices.ts

import { CreateExpensesInvoiceDTO, UpdateExpensesInvoiceDTO } from "@/types/ExpensesInvoice";


const API = "/api/expensesinvoices";

// جلب كل الفواتير
export const getExpensesInvoices = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch expenses invoices");
  return res.json();
};

// إنشاء فاتورة جديدة
export const createExpensesInvoice = async (data: CreateExpensesInvoiceDTO) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create expenses invoice");
  return res.json();
};

// تحديث فاتورة
export const updateExpensesInvoice = async (
  id: number,
  data: UpdateExpensesInvoiceDTO,
) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update expenses invoice");
  return res.json();
};

// حذف فاتورة
export const deleteExpensesInvoice = async (id: number) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete expenses invoice");
  return res.json();
};
