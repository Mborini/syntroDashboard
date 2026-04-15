// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SuppliersTable } from "@/components/suppliers/Table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tables",
};

export default async function TablesPage() {
  return (
    <>
      <Breadcrumb pageName="الموردون" />

      <div className="space-y-10">
        <SuppliersTable />
      </div>
    </>
  );
}
