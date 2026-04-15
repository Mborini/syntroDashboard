// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { WarehouseTable } from "@/components/Warehouse/WarehouseTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tables",
};

export default async function WarehouseTablePage() {
  return (
    <>
      <Breadcrumb pageName="مستودع الانتاج" />

      <div className="space-y-10">
        <WarehouseTable />
      </div>
    </>
  );
}
