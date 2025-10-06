// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InventoryWithdrawTable } from "@/components/Inventorywithdraw/Table";

export default async function InventoryWithdrawPage() {
  return (
    <>
      <Breadcrumb pageName=" حركات السحب" />

      <div className="space-y-10">
        <InventoryWithdrawTable />
      </div>
    </>
  );
}
