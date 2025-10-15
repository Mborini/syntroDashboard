// app/tables/page.tsx
import { AttendanceTable } from "@/components/Attendance/Table";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomersTable } from "@/components/Customers/Table";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "الدوام اليومي",
};

export default async function AttendancePage() {
  return (
    <>
      <Breadcrumb pageName="الدوام اليومي" />

      <div className="space-y-10">
        <AttendanceTable />
      </div>
    </>
  );
}
