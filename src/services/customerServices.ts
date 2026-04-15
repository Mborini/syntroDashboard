import { Customer, CreateCustomerDTO, UpdateCustomerDTO } from "@/types/customer";

const API_URL = "/api/customers";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(API_URL);
  return handleResponse<Customer[]>(res);
}

export async function createCustomer(data: CreateCustomerDTO): Promise<Customer> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Customer>(res);
}

export async function updateCustomer(id: string | number, data: UpdateCustomerDTO): Promise<Customer> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Customer>(res);
}

export async function deleteCustomer(id: string | number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await handleResponse(res);
}
