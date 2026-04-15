// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VehiclesTable } from "@/components/HR/Vehicles/Table";

export default async function EmployeesPage() {
  
  return (
    <>
      <Breadcrumb pageName="الاليات " />

      <div className="space-y-10">
        <VehiclesTable />
      </div>
    </>
  );
}
