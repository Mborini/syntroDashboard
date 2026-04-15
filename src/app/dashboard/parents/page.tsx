// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default async function ParentsPage() {
  return (
    <>
      <Breadcrumb pageName="Parents" />

      <div className="space-y-10">
        <h2 className="text-lg font-semibold">Parents List</h2>
      </div>
    </>
  );
}
