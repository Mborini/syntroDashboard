
const API_BASE = "/api/Chart/sales";

export async function getSalesData() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}
