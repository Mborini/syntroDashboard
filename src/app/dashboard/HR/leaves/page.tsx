// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { LeavesTable } from "@/components/HR/Leaves/LeavesTable";

export default async function LeavesPage() {
  return (
    <>
      <Breadcrumb pageName="الإجازات" />

      <div className="space-y-10">
        <LeavesTable />
      </div>
    </>
  );
}
