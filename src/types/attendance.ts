export interface Attendance {
  id: number;
  employee_id: number;
  employee_name: string; // لإظهار الاسم في الجدول
  date: string; // YYYY-MM-DD
  check_in?: string; // HH:MM
  check_out?: string; // HH:MM
  total_hours: number;
  overtime_hours: number;
  missing_hours: number;
  status: "حاضر" | "متأخر" | "وقت إضافي";
  created_at: string;
}
export interface CreateAttendanceDTO {
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  total_hours?: number;      // اجعلها اختيارية
  overtime_hours?: number;
  missing_hours?: number;
  status?: "حاضر" | "متأخر" | "وقت إضافي"; // بالعربي
}
export interface UpdateAttendanceDTO extends Partial<CreateAttendanceDTO> {}
