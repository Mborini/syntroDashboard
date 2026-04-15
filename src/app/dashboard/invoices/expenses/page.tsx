// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ExpensesInvoiceTable } from "@/components/ExpensesInvoice/Table";

export default async function ExpensesPage() {
  return (
    <>
      <Breadcrumb pageName="المصاريف" />

      <div className="space-y-10">
        <ExpensesInvoiceTable />
      </div>
    </>
  );
}
