// components/EmployeeReport/EmployeeReportTable.tsx
"use client";

import { Table, ScrollArea, Text, Group } from "@mantine/core";
import { useEffect, useState, useMemo, useRef } from "react";
import { TableSkeleton } from "../../Common/skeleton";
import { getEmployeesSammaryReport } from "@/services/employeesSammaryReport";
import { EmployeeReportFilter } from "./EmployeeReportFilter";
import { EmployeeReportActions } from "./EmployeeReportActions";
import { CiCircleCheck } from "react-icons/ci";
import { VscError } from "react-icons/vsc";

type EmployeeSummary = {
  employee_name: string;
  salary: number;
  month: string;
  total_work_hours: number;
  overtime_hours: number;
  missing_hours: number;
  total_leaves: number;
  total_withdrawals: number;
  remaining_salary: number;
  is_paid: boolean;
};

export function EmployeeReportTable() {
  const [data, setData] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", month: "" });
  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getEmployeesSammaryReport();
        setData(res as any);
      } catch (err) {
        console.error("Failed to fetch employee summary:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // الفلترة محلياً (client side)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName =
        !filters.name ||
        item.employee_name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesMonth = !filters.month || item.month === filters.month;
      return matchesName && matchesMonth;
    });
  }, [data, filters]);

  if (loading) {
    return <TableSkeleton columns={8} />;
  }

  return (
    <ScrollArea>
      {/* مكون الفلاتر */}
<div className="flex justify-between items-center mb-4">
        <EmployeeReportActions tableRef={tableRef} />
  <EmployeeReportFilter onFilter={setFilters} />
</div>


      <div className="flex justify-center">
       <Table
          ref={tableRef}
          dir="rtl"
          className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card"
        >

          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>الموظف</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الشهر</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الراتب الأساسي</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>ساعات العمل</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الإضافي</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>نقص الساعات</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الإجازات</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>السحوبات</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الراتب المتبقي</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>حالة الدفع</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredData.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item.employee_name}</Table.Td>
                <Table.Td>{item.month}</Table.Td>
                <Table.Td>{item.salary}</Table.Td>
                <Table.Td>{item.total_work_hours}</Table.Td>
                <Table.Td>{item.overtime_hours}</Table.Td>
                <Table.Td>{item.missing_hours}</Table.Td>
                <Table.Td>{item.total_leaves}</Table.Td>
                <Table.Td>{item.total_withdrawals}</Table.Td>
                <Table.Td>{item.remaining_salary}</Table.Td>
                <Table.Td>
  <div className="flex items-center justify-center gap-1">
    {item.is_paid ? (
      <>
        <CiCircleCheck size={18} color="green" />
        <Text c={"green"}>مدفوع</Text>
      </>
    ) : (
      <>
        <VscError size={18} color="red" />
        <Text c={"red"}>غير مدفوع</Text>
      </>
    )}
  </div>
</Table.Td>


                    
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        
      </div>
     <Group dir="rtl" className="mt-4 px-2">
  <Text size="sm" c="red">
    * عدد ساعات العمل محسوب على أساس 9 ساعات يومياً
  </Text>
  <Text size="sm" c="red">
    * كل ساعة إضافية تحتسب بقيمة 1.5 دينار
  </Text>
  <Text size="sm" c="red">
    * خصم الإجازات بعد أول يومين في الشهر
  </Text>
</Group>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">لا توجد نتائج مطابقة</p>
      )}
    </ScrollArea>
  );
}
