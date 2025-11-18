// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ExpensesTypeTable } from "@/components/ExpensesTypes/Table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tables",
};

export default async function TablesPage() {
  return (
    <>
      <Breadcrumb pageName="الموردون" />

      <div className="space-y-10">
        <ExpensesTypeTable />
      </div>
    </>
  );
}
