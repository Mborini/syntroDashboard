// services/withdrawalServices.ts
import { Withdrawal, CreateWithdrawalDTO, UpdateWithdrawalDTO } from "@/types/withdrawal";

// جلب كل المسحوبات
export async function getWithdrawals(): Promise<Withdrawal[]> {
  const res = await fetch("/api/withdrawals");
  if (!res.ok) throw new Error("فشل في جلب المسحوبات");
  return res.json();
}

// إضافة مسحوبة جديدة
export async function createWithdrawal(data: CreateWithdrawalDTO): Promise<Withdrawal> {
  const res = await fetch("/api/withdrawals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل في إضافة المسحوبة");
  return res.json();
}

// تعديل مسحوبة موجودة
export async function updateWithdrawal(id: number, data: UpdateWithdrawalDTO): Promise<Withdrawal> {
  const res = await fetch(`/api/withdrawals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل في تعديل المسحوبة");
  return res.json();
}

// حذف مسحوبة
export async function deleteWithdrawal(id: number): Promise<void> {
  const res = await fetch(`/api/withdrawals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("فشل في حذف المسحوبة");
}
