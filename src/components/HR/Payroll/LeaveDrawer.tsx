"use client";

import {
  Drawer,
  Select,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Toast } from "@/lib/toast";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/services/employeeServices";
import {
  getPayrollByEmployeeAndMonth,
  createPayroll,
} from "@/services/payrollServices";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function PayrollQueryDrawer({ opened, onClose, onSuccess }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [month, setMonth] = useState<string>("");
  const [salary, setSalary] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");

  // ✅ حالة اللودينغ الخاصة بزر "استعلم"
  const [queryLoading, setQueryLoading] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadEmployees();
  }, []);

  const handleQuery = async () => {
    if (!employeeId || !month) {
      return Toast.error("الرجاء اختيار الموظف والشهر!");
    }

    try {
      setQueryLoading(true); // ✅ يبدأ اللودينغ
      const res = await getPayrollByEmployeeAndMonth(employeeId, month);

      if (res?.alreadyPaid) {
        setSalary(null);
        return Toast.error(res.message || "تم دفع الراتب مسبقًا!");
      }

      if (res?.amount != null) {
        setSalary(res.amount);
        setNotes("");
      } else {
        setSalary(0);
        Toast.info("لا يوجد راتب لهذا الموظف في هذا الشهر");
      }
    } catch (error) {
      console.error(error);
      Toast.error("حدث خطأ أثناء جلب الراتب");
    } finally {
      setQueryLoading(false); // ✅ ينتهي اللودينغ
    }
  };

  const handlePayment = async () => {
    if (!employeeId || !month) {
      return Toast.error("الرجاء إدخال كل الحقول بشكل صحيح!");
    }

    try {
      await createPayroll({
        employee_id: employeeId,
        amount: salary ?? 0,
        month,
        notes,
      });

      Toast.success("تمت إضافة الدفعة بنجاح");

      // تحديث الجدول مباشرة
      onSuccess?.();

      // إعادة التهيئة
      onClose();
      setEmployeeId(null);
      setMonth("");
      setSalary(null);
      setNotes("");
    } catch (error: any) {
      console.error(error);
      Toast.error(error.message || "فشل في دفع الراتب");
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="sm" title="استعلام الراتب">
      <div dir="rtl" className="flex flex-col gap-4">
        <Select
          radius="md"
          label="الموظف"
          placeholder="اختر الموظف"
          value={employeeId ? employeeId.toString() : undefined}
          onChange={(val) => setEmployeeId(Number(val))}
          data={employees.map((e) => ({
            value: e.id.toString(),
            label: e.name,
          }))}
        />

        <TextInput
          radius="md"
          label="الشهر"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.currentTarget.value)}
        />

        {/* ✅ زر الاستعلام مع حالة لودينغ */}
        <Button
          radius="md"
          variant="light"
          color="blue"
          fullWidth
          onClick={handleQuery}
          loading={queryLoading} // 🔵 هنا السحر
        >
          {queryLoading ? "جاري الاستعلام..." : "استعلم"}
        </Button>

        {salary !== null && (
          <>
            <TextInput
              radius="md"
              label="الراتب"
              value={salary.toString()}
              readOnly
              style={{ cursor: "not-allowed" }}
            />

            <Textarea
              radius="md"
              label="ملاحظات"
              value={notes}
              onChange={(e) => setNotes(e.currentTarget.value)}
            />

            <Button color="green" variant="light" fullWidth onClick={handlePayment}>
              دفع الراتب
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
}
