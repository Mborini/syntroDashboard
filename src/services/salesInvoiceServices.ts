import { SalesInvoice } from "@/types/salesInvoice";
import { CreateSalesInvoiceDTO } from "@/types/salesInvoice";

;

const API_URL = "/api/salesInvoice/Invoice"; // غيره حسب الـ route عندك
const availableItemsAPI = "/api/salesInvoice/available-items-warehouse";
// ✅ جلب كل الفواتير
export async function getSalesInvoices(): Promise<SalesInvoice[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("فشل جلب الفواتير");
  return res.json();
}
export async function getAvailableWarehouseItems(): Promise<SalesInvoice[]> {
  const res = await fetch(availableItemsAPI);
  if (!res.ok) throw new Error("فشل جلب الأصناف المتاحة");
  return res.json();
}

// ✅ إنشاء فاتورة جديدة
export async function createSalesInvoice(data: CreateSalesInvoiceDTO): Promise<SalesInvoice> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل إنشاء الفاتورة");
  return res.json();
}

// ✅ تعديل فاتورة موجودة
export async function updateSalesInvoice(id: number, data: UpdateSalesInvoiceDTO): Promise<SalesInvoice> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل تعديل الفاتورة");
  return res.json();
}

// ✅ حذف فاتورة
export async function deleteSalesInvoice(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("فشل حذف الفاتورة");
}
