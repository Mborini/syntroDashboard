// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { MonthlyReportReset } from "@/components/reports/employee copy/Table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "التقرير المالي",
};

export default async function TablesPage() {
  return (
    <>
      <Breadcrumb pageName="التقرير المالي" />

      <div className="space-y-10">
        <MonthlyReportReset />
      </div>
    </>
  );
}
