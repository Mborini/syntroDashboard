// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ExpensesInvoiceTable } from "@/components/ExpensesInvoice/Table";
import { BinsLocationTable } from "@/components/BinsLocation/Table";

export default async function BinsLocationPage() {
  return (
    <>
      <Breadcrumb pageName="مواقع الحاويات" />

      <div className="space-y-10">
        <BinsLocationTable />
      </div>
    </>
  );
}
