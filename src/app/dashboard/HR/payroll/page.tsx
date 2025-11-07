// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PayrollTable } from "@/components/HR/Payroll/PayrollTable";

export default async function LeavesPage() {
  return (
    <>
      <Breadcrumb pageName="الرواتب" />

      <div className="space-y-10">
        <PayrollTable />
      </div>
    </>
  );
}
