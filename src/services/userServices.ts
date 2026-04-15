// src/services/userServices.ts

import { CreateUserDTO, UpdateUserDTO, User } from "@/types/user";


const API_URL = "/api/users";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

export async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch(API_URL);
    return await handleResponse<User[]>(res);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(user: CreateUserDTO): Promise<User> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse<User>(res);
}

export async function updateUser(id: number, user: UpdateUserDTO): Promise<User> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse<User>(res);
}

export async function deleteUser(id: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  await handleResponse(res);
  return true;
}

export async function toggleUserStatus(id: number, is_active: boolean): Promise<User> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });
  return handleResponse<User>(res);
}
