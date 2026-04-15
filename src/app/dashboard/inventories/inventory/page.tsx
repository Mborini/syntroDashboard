// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InventoryTable } from "@/components/Inventory/Table";

export default async function InventoryPage() {
  return (
    <>
      <Breadcrumb pageName=" مستودع المواد الاولية" />

      <div className="space-y-10">
        <InventoryTable />
      </div>
    </>
  );
}
