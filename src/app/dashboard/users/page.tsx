// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import { UsersTable } from "@/components/Users";
import { TableSkeleton } from "@/components/Common/skeleton";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export const metadata: Metadata = {
  title: "Tables",
};

export default async function TablesPage() {

  return (
    <>
      <Breadcrumb pageName="Users" />

      <div className="space-y-10">
        <UsersTable />

        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense>

        <InvoiceTable />
      </div>
    </>
  );
}
