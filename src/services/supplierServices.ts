// src/services/supplierServices.ts
import { CreateSupplierDTO, UpdateSupplierDTO, Supplier } from "@/types/supplier";

const API_URL = "/api/suppliers";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * جلب جميع الموردين
 */
export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(API_URL);
  return handleResponse<Supplier[]>(res);
}

/**
 * إنشاء مورد جديد
 */
export async function createSupplier(data: CreateSupplierDTO): Promise<Supplier> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Supplier>(res);
}

/**
 * تعديل مورد موجود حسب الـ slug id
 */
export async function updateSupplier(id: string | number, data: UpdateSupplierDTO): Promise<Supplier> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Supplier>(res);
}

/**
 * حذف مورد حسب الـ slug id
 */
export async function deleteSupplier(id: string | number): Promise<boolean> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await handleResponse(res);
  return true;
}
