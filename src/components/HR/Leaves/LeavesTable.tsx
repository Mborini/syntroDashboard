"use client";

import { Table, Button, Group, ActionIcon, ScrollArea } from "@mantine/core";
import { PencilIcon, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Toast } from "@/lib/toast";
import { LeaveDrawer } from "./LeaveDrawer";
import { createLeave, deleteLeave, getLeaves, updateLeave } from "@/services/leaveServices";
import { Leave } from "@/types/leave";
import ConfirmModal from "@/components/Common/ConfirmModal";
import { TableSkeleton } from "@/components/Common/skeleton";
import { FcLeave } from "react-icons/fc";
import { FaRegCalendarPlus } from "react-icons/fa6";


export function LeavesTable() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [leaveToDelete, setLeaveToDelete] = useState<Leave | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    async function loadLeaves() {
      setLoading(true);
      try {
        const data = await getLeaves();
        setLeaves(data);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLeaves();
  }, []);

 const handleSubmit = async (data: Omit<Leave, "id" | "employee_name" | "created_at">) => {
  try {
    if (selectedLeave) {
      // تعديل الإجازة
      await updateLeave(selectedLeave.id, data);
      Toast.success("تم تعديل الإجازة بنجاح");
    } else {
      // إضافة جديدة
      await createLeave(data);
      Toast.success("تم إضافة الإجازة بنجاح");
    }

    const refreshedLeaves = await getLeaves();
    setLeaves(refreshedLeaves);
    setDrawerOpened(false);
  } catch (error) {
    console.error(error);
    Toast.error((error as any).message || "فشل في حفظ الإجازة");
  }
};


  const handleDeleteClick = (leave: Leave) => {
    setLeaveToDelete(leave);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (leaveToDelete) {
      try {
        await deleteLeave(leaveToDelete.id);
        setLeaves((prev) => prev.filter((l) => l.id !== leaveToDelete.id));
        setLeaveToDelete(null);
        setModalOpened(false);
        Toast.success("تم حذف الإجازة بنجاح");
      } catch (error) {
        console.error(error);
        Toast.error("فشل في حذف الإجازة");
      }
    }
  };

    if (loading) {
      return <TableSkeleton columns={7} />;
    }
  return (
    <>
      <Group mb="md">
        <Button color="green" variant="light" 
        onClick={() => { setSelectedLeave(null); setDrawerOpened(true); }}>
          <FaRegCalendarPlus size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table dir="rtl" className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th style={{ textAlign: "center" }}>الموظف</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>التاريخ</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>السبب</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaves.map((leave) => (
                <Table.Tr key={leave.id}>
                  <Table.Td>{leave.employee_name}</Table.Td>
                  <Table.Td>{new Date(leave.date).toLocaleDateString("en-EG")}</Table.Td>
                  <Table.Td>{leave.reason}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon color="orange" variant="subtle" onClick={() => { setSelectedLeave(leave); setDrawerOpened(true); }}>
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon color="red" variant="subtle" onClick={() => handleDeleteClick(leave)}>
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

      <LeaveDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        leave={selectedLeave}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الإجازة"
        message="هل أنت متأكد من حذف هذه الإجازة؟ لا يمكن التراجع عن هذا الإجراء."
        color="red"
      />
    </>
  );
}
