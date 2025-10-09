// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ExpensesInvoiceTable } from "@/components/ExpensesInvoice/Table";
import { SalesItemsTable } from "@/components/SalesItem/Table";

export default async function SalesItemsPage() {
  return (
    <>
      <Breadcrumb pageName="اصناف المبيعات" />

      <div className="space-y-10">
        <SalesItemsTable />
      </div>
    </>
  );
}
