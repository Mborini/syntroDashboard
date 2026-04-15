export type BinsLocationDTO = {
  region_name: string;
  vehicle_number: string;
  file: File | null;
};

export type BinsLocation = {
  id: string;
  region_name: string;
  vehicle_number: string;
  file_url?: string;
};