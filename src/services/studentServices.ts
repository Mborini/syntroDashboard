import { CreateStudentDTO, UpdateStudentDTO } from "@/types/student";

const API = "/api/students";

export const getStudents = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const createStudent = async (data: CreateStudentDTO) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

export const updateStudent = async (id: number, data: UpdateStudentDTO) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

export const patchStudentStatus = async (id: number, is_active: boolean) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

export const deleteStudent = async (id: number) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete student");
  return res.json();
};

// services/classService.ts
export async function getClasses() {
  const res = await fetch("/api/classes");
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json(); // [{id:1,name:"الصف الأول"}, ...]
}

export async function getSections(classId: number) {
  const res = await fetch(`/api/sections/${classId}`);
  if (!res.ok) throw new Error("Failed to fetch sections");
  return res.json(); // [{id:3,name:"أ"}, ...]
}
