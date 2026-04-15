// services/withdrawalServices.ts
import { Withdrawal, CreateWithdrawalDTO, UpdateWithdrawalDTO } from "@/types/withdrawal";
import { error } from "console";

// جلب كل المسحوبات
export async function getWithdrawals(): Promise<Withdrawal[]> {
  const res = await fetch("/api/HR/withdrawals");
  if (!res.ok) throw new Error("فشل في جلب المسحوبات");
  return res.json();
}
export async function createWithdrawal(data: CreateWithdrawalDTO): Promise<Withdrawal> {
  const res = await fetch("/api/HR/withdrawals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // قراءة الرسالة من الـAPI حتى لو كانت غير JSON
    let msg = "فشل في إضافة قيمة السحب";
    try {
      const errData = await res.json();
      msg = errData?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}
export async function updateWithdrawal(id: number, data: UpdateWithdrawalDTO): Promise<Withdrawal> {
  const res = await fetch(`/api/HR/withdrawals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let msg = "فشل في تعديل قيمة السحب";
    try {
      const errData = await res.json();
      msg = errData?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

// حذف مسحوبة
export async function deleteWithdrawal(id: number): Promise<void> {
  const res = await fetch(`/api/HR/withdrawals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("فشل في حذف قيمة السحب");
}
