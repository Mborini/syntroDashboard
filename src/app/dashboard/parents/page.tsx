// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ParentsTable } from "@/components/Parents/Table";

export default async function ParentsPage() {
  return (
    <>
      <Breadcrumb pageName="Parents" />

      <div className="space-y-10">
        <ParentsTable />
      </div>
    </>
  );
}
