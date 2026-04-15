import { Vehicle } from "@/types/employee";

const API_BASE_1 = "/api/HR/vehicles";
const API_BASE_2 = "/api/HR/vehicles/sync";

export async function getVehiclesFromGam(): Promise<Vehicle[]> {
  const res = await fetch(`${API_BASE_1}`);
  if (!res.ok) throw new Error("Failed to fetch vehicles from gam");
  return res.json();
}
export async function getVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${API_BASE_2}`);
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
}
export async function syncVehicles(vehicles: any[]) {
  try {
    const res = await fetch(`${API_BASE_1}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicles),
    });

    if (!res.ok) {
      throw new Error("Failed to sync vehicles");
    }

    return await res.json();
  } catch (error) {
    console.error("Sync error:", error);
    throw error;
  }
}