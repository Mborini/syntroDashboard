import { CreateParentDTO, UpdateParentDTO } from "@/types/parent";
import { error } from "console";

const API = "/api/parents";

export const getParents = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch parents");
  return res.json();
};

export const createParent = async (data: CreateParentDTO) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error);
  return result;
};

export const updateParent = async (id: number, data: UpdateParentDTO) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error);
  return result;
};

export const patchParentStatus = async (id: number, is_active: boolean) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};
export const patchParentPassword = async (id: number, password: string) => {
  const res = await fetch(`${API}/${id}/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Failed to update password");
  return res.json();
};

export const deleteParent = async (id: number) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete parent");
  return res.json();
};
