"use client";

import {
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
  Select,
  TextInput,
} from "@mantine/core";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toast } from "@/lib/toast";

import ConfirmModal from "@/components/Common/ConfirmModal";
import { TableSkeleton } from "@/components/Common/skeleton";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { deletePayroll, getPayrolls } from "@/services/payrollServices";
import { Payroll } from "@/types/payroll";
import { PayrollQueryDrawer } from "./LeaveDrawer";

export function PayrollTable() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [payrollToDelete, setPayrollToDelete] = useState<Payroll | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  // 🔹 فلترة
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // 🔸 توليد الشهر الحالي بصيغة yyyy-mm
  useEffect(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    setSelectedMonth(`${year}-${month}`);
  }, []);

  // ✅ تحميل البيانات
  const loadPayrolls = async () => {
    setLoading(true);
    try {
      const data = await getPayrolls();
      setPayrolls(data);
      setFilteredPayrolls(data);
    } catch (error) {
      console.error("Failed to fetch payrolls:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحميل الموظفين
  // const loadEmployees = async () => {
  //   try {
  //     const data = await getEmployees();
  //     setEmployees(data.map((e) => ({ value: e.name, label: e.name })));
  //   } catch (error) {
  //     console.error("Failed to fetch employees:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadPayrolls();
  //   loadEmployees();
  // }, []);

  // ✅ فلترة عند تغيير الموظف أو الشهر
  useEffect(() => {
    let filtered = payrolls;

    if (selectedEmployee) {
      filtered = filtered.filter((p) => p.employee_name === selectedEmployee);
    }

    if (selectedMonth) {
      filtered = filtered.filter((p) => p.month === selectedMonth);
    }

    setFilteredPayrolls(filtered);
  }, [selectedEmployee, selectedMonth, payrolls]);

  const handleDeleteClick = (payroll: Payroll) => {
    setPayrollToDelete(payroll);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (payrollToDelete) {
      try {
        await deletePayroll(payrollToDelete.id);
        setPayrolls((prev) => prev.filter((p) => p.id !== payrollToDelete.id));
        setPayrollToDelete(null);
        setModalOpened(false);
        Toast.success("تم حذف الدفعة بنجاح");
      } catch (error) {
        console.error(error);
        Toast.error("فشل في حذف الدفعة");
      }
    }
  };

  if (loading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <>
      {/* ✅ شريط الفلترة */}
      <Group mb="md" justify="space-between" className="flex-wrap gap-3">
         <Button
          color="green"
          variant="light"
          onClick={() => setDrawerOpened(true)}
        >
          <FaRegMoneyBillAlt size={20} className="mr-1" /> دفع راتب
        </Button>
        <Group>
          <Select
            placeholder="اختر الموظف"
            data={employees}
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            clearable
            searchable
            radius="md"
          />
          <TextInput
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.currentTarget.value)}
            radius="md"
          />
        </Group>

       
      </Group>

      {/* ✅ الجدول */}
      <ScrollArea>
        <div className="flex justify-center">
          <Table
            dir="rtl"
            className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark"
          >
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th style={{ textAlign: "center" }}>الموظف</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>القيمة</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الشهر</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الملاحظات</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredPayrolls.length > 0 ? (
                filteredPayrolls.map((p) => (
                  <Table.Tr key={p.id}>
                    <Table.Td>{p.employee_name}</Table.Td>
                    <Table.Td>{p.amount} د.أ</Table.Td>
                    <Table.Td>{p.month}</Table.Td>
                    <Table.Td>{p.notes || "لا توجد ملاحظات"}</Table.Td>
                    <Table.Td>
                      <Group className="justify-center">
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => handleDeleteClick(p)}
                        >
                          <Trash2 size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                    لا توجد بيانات مطابقة للفلترة
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>
      </ScrollArea>

      {/* ✅ Drawer لدفع الرواتب */}
      <PayrollQueryDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        onSuccess={loadPayrolls}
      />

      {/* ✅ Modal لتأكيد الحذف */}
      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الدفعة"
        message="هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء."
        color="red"
      />
    </>
  );
}
