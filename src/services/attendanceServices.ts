import { Attendance, CreateAttendanceDTO, UpdateAttendanceDTO } from "@/types/attendance";

const API_URL = "/api/attendance";

// جلب جميع سجلات الحضور
export async function getAttendance(): Promise<Attendance[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("فشل في جلب سجلات الحضور");
  return res.json();
}

// إنشاء سجل حضور جديد
export async function createAttendance(data: CreateAttendanceDTO): Promise<Attendance> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "فشل في إنشاء سجل الحضور");
  }

  return res.json();
}

// تحديث سجل الحضور (وقت الدخول والانصراف)
export async function updateAttendance(id: number, data: UpdateAttendanceDTO): Promise<Attendance> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "فشل في تحديث سجل الحضور");
  }

  return res.json();
}

// حذف سجل حضور
export async function deleteAttendance(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("فشل في حذف سجل الحضور");
}
