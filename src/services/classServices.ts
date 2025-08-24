import { CreateClassDTO, UpdateClassDTO } from "@/types/class";

const API = "/api/classes";

export const getClasses = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
};

export const createClass = async (data: CreateClassDTO) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

export const updateClass = async (id: number, data: UpdateClassDTO) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

export const deleteClass = async (id: number) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete class");
  return res.json();
};
export const getAcademicYears = async () => {
  const res = await fetch("/api/academic-years");
  if (!res.ok) throw new Error("Failed to fetch academic years");
  return res.json();
};



