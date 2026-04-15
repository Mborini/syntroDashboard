// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseInvoiceTable } from "@/components/PurchaseInvoice/Table";

export default async function PurchasesPage() {
  return (
    <>
      <Breadcrumb pageName="مشتريات" />

      <div className="space-y-10">
        <PurchaseInvoiceTable />
      </div>
    </>
  );
}
