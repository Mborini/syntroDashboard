// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EmployeesTable } from "@/components/HR/Employees/Table";

export default async function EmployeesPage() {
  return (
    <>
      <Breadcrumb pageName="إدارة الموظفين" />

      <div className="space-y-10">
        <EmployeesTable />
      </div>
    </>
  );
}
