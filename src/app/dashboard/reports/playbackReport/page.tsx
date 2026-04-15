// app/tables/page.tsx
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PlaybackReportTable } from "@/components/reports/playbackReport/Table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "تقرير عرض النقاط",
};

export default async function TablesPage() {
  return (
    <>
      <Breadcrumb pageName="تقرير عرض النقاط" />

      <div className="space-y-10">
        <PlaybackReportTable />
      </div>
    </>
  );
}
