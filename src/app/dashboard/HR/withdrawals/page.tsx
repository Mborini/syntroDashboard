// app/tables/page.tsx
import { AttendanceTable } from "@/components/HR/Attendance/Table";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomersTable } from "@/components/Customers/Table";
import { Metadata } from "next";
import { WithdrawalsTable } from "@/components/HR/Withdrawals/Table";

export const metadata: Metadata = {
  title: "المسحوبات ",
};

export default async function AttendancePage() {
  return (
    <>
      <Breadcrumb pageName="المسحوبات" />

      <div className="space-y-10">
        <WithdrawalsTable />
      </div>
    </>
  );
}
