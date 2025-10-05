// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomersTable } from "@/components/Customers/Table";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "الزبائن",
};

export default async function customersPage() {
  return (
    <>
      <Breadcrumb pageName="الزبائن" />

      <div className="space-y-10">
        <CustomersTable />
      </div>
    </>
  );
}
