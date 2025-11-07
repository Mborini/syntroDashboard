import { Payroll } from "@/types/payroll";

const BASE_URL = "/api/HR/payroll";

/* 🟢 عرض كل الدفعات */
export async function getPayrolls(): Promise<Payroll[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("فشل في جلب بيانات الرواتب");
  return res.json();
}

/* 🟡 إضافة دفعة جديدة */
export async function createPayroll(data: Omit<Payroll, "id" | "employee_name" | "created_at">) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل في إضافة الدفعة");
  return result;
}

/* 🔵 تعديل دفعة */
export async function updatePayroll(id: number, data: Omit<Payroll, "id" | "employee_name" | "created_at">) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل في تعديل الدفعة");
  return result;
}

/* 🔴 حذف دفعة */
export async function deletePayroll(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "فشل في حذف الدفعة");
  return result;
}
export async function getPayrollByEmployeeAndMonth(employeeId: number, month: string) {
  const res = await fetch(`/api/reports/employee/payroll/${employeeId}?month=${month}`);
  return res.json(); // { amount: number }
}

