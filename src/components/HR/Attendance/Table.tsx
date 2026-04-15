"use client";

import { Table, Button, Group, ActionIcon, ScrollArea, Badge } from "@mantine/core";
import { PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { GiDoorHandle } from "react-icons/gi";
import { FaDoorOpen } from "react-icons/fa6";

import { TableSkeleton } from "../../Common/skeleton";
import ConfirmModal from "../../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { AttendanceDrawer } from "./Drawer";
import { Attendance } from "@/types/attendance";
import { AttendanceFilter } from "./AttendanceFilter";
import { deleteAttendance, getAttendance } from "@/services/attendanceServices";

export function AttendanceTable() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<Attendance | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  // 🟢 فلتر الحالة
  const [filters, setFilters] = useState<{ employee: string; date: string }>({
    employee: "",
    date: "",
  });

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getAttendance();
      setRecords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);
const filteredRecords = useMemo(() => {
  return records.filter((r) => {
    const matchEmployee =
      !filters.employee || r.employee_name === filters.employee;

    // ✅ نحسب اليوم السابق للتاريخ المختار
    let matchDate = true;
    if (filters.date) {
      const selectedDate = new Date(filters.date);
      selectedDate.setDate(selectedDate.getDate() - 1); // اليوم السابق
      const prevDay = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd
      matchDate = r.date?.startsWith(prevDay);
    }

    return matchEmployee && matchDate;
  });
}, [records, filters]);

  const handleDeleteClick = (record: Attendance) => {
    setRecordToDelete(record);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await deleteAttendance(recordToDelete.id);
      setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      Toast.success("تم حذف سجل الحضور بنجاح");
      setRecordToDelete(null);
      setModalOpened(false);
    } catch (error) {
      console.error(error);
      Toast.error((error as any).message || "فشل في حذف سجل الحضور");
    }
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  }

  function formatTime12(timeStr: string | null | undefined): string {
    if (!timeStr) return "-";
    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = Number(hoursStr);
    const minutes = minutesStr.padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  }

  function formatHoursToTime(hours: number | string | null): string {
    if (!hours) return "00:00";
    const h = Math.floor(Number(hours));
    const m = Math.round((Number(hours) - h) * 60);
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  if (loading) return <TableSkeleton columns={8} />;

  return (
    <>
      {/* 🟣 مكون الفلاتر */}
      <Group mb="md" justify="space-between" dir="rtl">
        <AttendanceFilter onFilter={setFilters} />
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedRecord(null);
            setDrawerOpened(true);
          }}
        >
          <FaDoorOpen size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table dir="rtl" className="w-full rounded-lg bg-white text-center shadow-md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{textAlign: "center"}}>الموظف</Table.Th>
                <Table.Th style={{textAlign: "center"}}>التاريخ</Table.Th>
                <Table.Th style={{textAlign: "center"}}>وقت الدخول</Table.Th>
                <Table.Th style={{textAlign: "center"}}>وقت الانصراف</Table.Th>
                <Table.Th style={{textAlign: "center"}}>عدد ساعات العمل</Table.Th>
                <Table.Th style={{textAlign: "center"}}>الساعات المفقودة</Table.Th>
                <Table.Th style={{textAlign: "center"}}>الساعات الإضافية</Table.Th>
                <Table.Th style={{textAlign: "center"}}>الحالة</Table.Th>
                <Table.Th style={{textAlign: "center"}}>إجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredRecords.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.employee_name}</Table.Td>
                  <Table.Td>{formatDate(r.date)}</Table.Td>
                  <Table.Td style={{ direction: "ltr" }}>{formatTime12(r.check_in)}</Table.Td>
                  <Table.Td style={{ direction: "ltr" }}>{formatTime12(r.check_out)}</Table.Td>
                  <Table.Td>{formatHoursToTime(r.total_hours)}</Table.Td>
                  <Table.Td>{formatHoursToTime(r.missing_hours)}</Table.Td>
                  <Table.Td>{formatHoursToTime(r.overtime_hours)}</Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={
                        r.status === "حاضر"
                          ? "green"
                          : r.status === "متأخر"
                          ? "red"
                          : r.status === "وقت إضافي"
                          ? "blue"
                          : "gray"
                      }
                    >
                      {r.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon
                        color={r.check_out ? "orange" : "blue"}
                        variant="subtle"
                        onClick={() => {
                          setSelectedRecord(r);
                          setDrawerOpened(true);
                        }}
                      >
                        {r.check_out ? (
                          <PencilIcon size={18} />
                        ) : (
                          <GiDoorHandle title="انصراف" size={24} />
                        )}
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(r)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </ScrollArea>

      <AttendanceDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        record={selectedRecord}
        onSubmit={async () => {
          await loadRecords();
          setDrawerOpened(false);
        }}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف سجل الحضور"
        message="هل أنت متأكد من حذف هذا السجل؟"
        color="red"
      />
    </>
  );
}
