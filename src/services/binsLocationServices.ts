const BASE_URL = "/api/binsLocations";

// GET
export async function getBinsLocations() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
export async function getBinsLocationsByPlate(plate: string) {
  const res = await fetch(`/api/binsLocations/${plate}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
// CREATE
export async function createBinsLocation(data: any) {
  const formData = new FormData();

  formData.append("region_name", data.region_name);
  formData.append("vehicle_number", data.vehicle_number);

  if (data.shift) formData.append("shift", data.shift);
  if (data.bins !== undefined) formData.append("bins", String(data.bins));

  if (data.bins_file) formData.append("bins_file", data.bins_file);
  if (data.route_file) formData.append("route_file", data.route_file);

  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateBinsLocation(id: string, data: any) {
  const formData = new FormData();

  formData.append("id", id); // 🔥 لازم تضيفها

  formData.append("region_name", data.region_name);
  formData.append("vehicle_number", data.vehicle_number);

  if (data.shift) formData.append("shift", data.shift);
  if (data.bins !== undefined) formData.append("bins", String(data.bins));
  if (data.route) formData.append("route", data.route);

  if (data.bins_file) formData.append("bins_file", data.bins_file);
  if (data.route_file) formData.append("route_file", data.route_file);

  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// DELETE
export async function deleteBinsLocation(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw await res.json();
  return res.json();
}