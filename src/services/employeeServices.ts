import { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from "@/types/employee";

const API_BASE = "/api/HR/employees";

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

export async function createEmployee(data: CreateEmployeeDTO): Promise<Employee> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create employee");
  return res.json();
}

export async function updateEmployee(id: number, data: UpdateEmployeeDTO): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return res.json();
}

export async function deleteEmployee(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete employee");
}

export async function toggleEmployeeStatus(id: number, is_active: boolean): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${id}/toggle-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });
  if (!res.ok) throw new Error("Failed to toggle employee status");
  return res.json();
}
