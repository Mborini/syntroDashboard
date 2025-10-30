import { EmployeeSammaryReport } from "@/types/employeesSammaryReport";

const API_URL = "/api/reports/employee";

export async function getEmployeesSammaryReport(): Promise<EmployeeSammaryReport[]> {
  const res = await fetch(API_URL);
  return res.json();
}
