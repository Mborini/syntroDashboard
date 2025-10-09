// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SalesInvoiceTable } from "@/components/SalesInvoice/Table";

export default async function SalesPage() {
  return (
    <>
      <Breadcrumb pageName="مبيعات" />

      <div className="space-y-10">
        <SalesInvoiceTable />
      </div>
    </>
  );
}
