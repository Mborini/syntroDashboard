// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EmployeeReportTable } from "@/components/reports/employee/Table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "تقرير الموظفين",
};

export default async function TablesPage() {
  return (
    <>
      <Breadcrumb pageName="تقرير الموظفين" />

      <div className="space-y-10">
        <EmployeeReportTable />
      </div>
    </>
  );
}
