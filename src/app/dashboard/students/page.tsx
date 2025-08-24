// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { StudentTable } from "@/components/Students/Table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tables",
};

export default async function StudentsPage() {
  return (
    <>
      <Breadcrumb pageName="Students" />

      <div className="space-y-10">
        <StudentTable />
      </div>
    </>
  );
}
