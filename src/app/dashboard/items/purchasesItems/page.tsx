// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseItemsTable } from "@/components/PurchaseItem/Table";

export default async function PurchasesItemsPage() {
  return (
    <>
      <Breadcrumb pageName="اصناف المشتريات" />

      <div className="space-y-10">
        <PurchaseItemsTable />
      </div>
    </>
  );
}
