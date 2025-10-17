"use client";

import { Drawer, Button, TextInput, Select, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { getEmployees } from "@/services/employeeServices";
import { createAttendance, updateAttendance } from "@/services/attendanceServices";
import { Attendance } from "@/types/attendance";

type Props = {
  opened: boolean;
  onClose: () => void;
  record: Attendance | null;
  onSubmit: () => void;
};

export function AttendanceDrawer({ opened, onClose, record, onSubmit }: Props) {
  const [employees, setEmployees] = useState<{ value: string; label: string }[]>([]);
  const [form, setForm] = useState({
    employee_id: 0,
    date: "",
    check_in: "",
    check_out: "",
  });

  useEffect(() => {
    async function loadEmployees() {
      const data = await getEmployees();
      setEmployees(data.map((e: any) => ({ value: e.id.toString(), label: e.name })));
    }
    loadEmployees();
  }, []);

  useEffect(() => {
    if (record)
      setForm({
        employee_id: record.employee_id,
        date: record.date,
        check_in: record.check_in || "",
        check_out: record.check_out || "",
      });
    else
      setForm({
        employee_id: 0,
        date: "",
        check_in: "",
        check_out: "",
      });
  }, [record]);

  const handleSave = async () => {
    if (!form.employee_id || !form.date || (!form.check_in && !form.check_out)) return;

    try {
      if (record) {
        await updateAttendance(record.id, {
          check_in: form.check_in,
          check_out: form.check_out,
        });
      } else {
        await createAttendance({
          employee_id: form.employee_id,
          date: form.date,
          check_in: form.check_in,
        });
      }
      onSubmit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={record ? "تحديث الحضور والانصراف" : "إضافة سجل حضور"}
      position="right"
      size="md"
    >
      {!record && (
        <Select
          variant="filled"
          radius="md"
          label="الموظف"
          data={employees}
          value={form.employee_id?.toString() || ""}
          onChange={(val) => setForm({ ...form, employee_id: Number(val) })}
          required
          mb="sm"
        />
      )}

      <TextInput
        variant="filled"
          radius="md"
        label="التاريخ"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
        mb="sm"
        disabled={!!record}
      />

      <TextInput
        variant="filled"
          radius="md"
        label="وقت الدخول"
        type="time"
        value={form.check_in}
        onChange={(e) => setForm({ ...form, check_in: e.target.value })}
        required
        mb="sm"
      />

      <TextInput
        variant="filled"
          radius="md"
        label="وقت الانصراف"
        type="time"
        value={form.check_out}
        onChange={(e) => setForm({ ...form, check_out: e.target.value })}
        mb="sm"
      />

      <Group >
        <Button color="green" onClick={handleSave}>
          {record ? "تحديث" : "إضافة"}
        </Button>
      </Group>
    </Drawer>
  );
}
