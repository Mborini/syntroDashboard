// src/services/purchaseInvoiceServices.ts

import { CreatePurchaseInvoiceDTO, UpdatePurchaseInvoiceDTO } from "@/types/purchaseInvoice";


const API = "/api/purchaseinvoices";

// جلب كل الفواتير
export const getPurchaseInvoices = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch purchase invoices");
  return res.json();
};

// إنشاء فاتورة جديدة
export const createPurchaseInvoice = async (data: CreatePurchaseInvoiceDTO) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create purchase invoice");
  return res.json();
};

// تحديث فاتورة
export const updatePurchaseInvoice = async (
  id: number,
  data: UpdatePurchaseInvoiceDTO,
) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update purchase invoice");
  return res.json();
};

// حذف فاتورة
export const deletePurchaseInvoice = async (id: number) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete purchase invoice");
  return res.json();
};
