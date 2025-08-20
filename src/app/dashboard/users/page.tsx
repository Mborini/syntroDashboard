// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UsersTable } from "@/components/Users/Table";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

export default async function TablesPage() {
  return (
    <>
      <Breadcrumb pageName="Users" />

      <div className="space-y-10">
        <UsersTable />
      </div>
    </>
  );
}
