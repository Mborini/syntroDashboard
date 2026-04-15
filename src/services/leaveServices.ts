import { Leave } from "@/types/leave";

const API_BASE = "/api/HR/leaves"; // مسار API

// جلب جميع الإجازات
export async function getLeaves(): Promise<Leave[]> {
  const res = await fetch(`${API_BASE}`, { cache: "no-store" });
  if (!res.ok) throw new Error("فشل في جلب الإجازات");
  return res.json();
}

export async function createLeave(data: Omit<Leave, "id" | "employee_name" | "created_at">) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "فشل في إضافة الإجازة");
  }

  return res.json();
}

//put
export async function updateLeave(id: number, data: Omit<Leave, "id" | "employee_name" | "created_at">) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee_id: data.employee_id, date: data.date, reason: data.reason }),
  });
    if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "فشل في تحديث الإجازة");
  }
    return res.json();
}
// حذف إجازة حسب id
export async function deleteLeave(id: number) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "فشل في حذف الإجازة");
  }

  return res.json();
}
