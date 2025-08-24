// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ClassTable } from "@/components/Classes/Table";

export default async function ClassesPage() {
  return (
    <>
      <Breadcrumb pageName="Classes" />

      <div className="space-y-10">
        <ClassTable />
      </div>
    </>
  );
}
