// components/Withdrawals/WithdrawalsTable.tsx
"use client";

import { Table, Group, Button, ScrollArea, ActionIcon } from "@mantine/core";
import { PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toast } from "@/lib/toast";
import ConfirmModal from "../../Common/ConfirmModal";

import { Withdrawal } from "@/types/withdrawal";

import {
  getWithdrawals,
  createWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
} from "@/services/withdrawalServices";
import { WithdrawalDrawer } from "./WithdrawalDrawer";

import { TbCashRegister } from "react-icons/tb";
import { TableSkeleton } from "@/components/Common/skeleton";

export function WithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>(
    [],
  );
  const [employees, setEmployees] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);

  const [modalOpened, setModalOpened] = useState(false);
  const [withdrawalToDelete, setWithdrawalToDelete] =
    useState<Withdrawal | null>(null);

  // تحميل البيانات
  // useEffect(() => {
  //   async function loadData() {
  //     setLoading(true);
  //     try {
  //       const [wData, eData] = await Promise.all([
  //         getWithdrawals(),
         
  //       ]);
  //       setWithdrawals(wData);
  //       setFilteredWithdrawals(wData);
  //       setEmployees(eData);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   loadData();
  // }, []);

  const handleSubmit = async (data: any) => {
    try {
      if (selectedWithdrawal) {
        await updateWithdrawal(selectedWithdrawal.id, data);
        Toast.success("تم تحديث قيمة السحب");
      } else {
        await createWithdrawal(data);
        Toast.success("تم إضافة قيمة السحب");
      }

      const refreshed = await getWithdrawals();
      setWithdrawals(refreshed);
      setFilteredWithdrawals(refreshed);
      setDrawerOpened(false);
    } catch (error) {
  Toast.error(error instanceof Error ? error.message : "فشل في حفظ قيمة السحب");
      console.error(error);
    }
  };

  const handleDeleteClick = (withdrawal: Withdrawal) => {
    setWithdrawalToDelete(withdrawal);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (withdrawalToDelete) {
      try {
        await deleteWithdrawal(withdrawalToDelete.id);
        const updated = withdrawals.filter(
          (w) => w.id !== withdrawalToDelete.id,
        );
        setWithdrawals(updated);
        setFilteredWithdrawals(updated);
        Toast.success("تم حذف قيمة السحب");
        setModalOpened(false);
      } catch (error) {
        Toast.error("فشل في حذف قيمة السحب");
        console.error(error);
      }
    }
  };

  

  if (loading) return <TableSkeleton columns={8} />;

  return (
    <>
      <Group justify="space-between" mb="sm"><Button
        color="green"
        variant="light"
        mb="sm"
        onClick={() => {
          setSelectedWithdrawal(null);
          setDrawerOpened(true);
        }}
      >
        <TbCashRegister size={18} />
      </Button>

      </Group>

      

      {/* 🧾 جدول المسحوبات */}
      <ScrollArea>
        <Table
          dir="rtl"
          className="w-full rounded-lg bg-white text-center shadow-md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>الموظف</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>المبلغ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>التاريخ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>ملاحظة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>إجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredWithdrawals.length > 0 ? (
              filteredWithdrawals.map((w) => (
                <Table.Tr key={w.id}>
                  <Table.Td>{w.employee_name}</Table.Td>
                  <Table.Td>{w.amount}</Table.Td>
                  <Table.Td>
                    {new Date(w.date).toLocaleDateString("en-EG")}
                  </Table.Td>
                  <Table.Td>{w.note || "-"}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon
                        color="orange"
                        variant="subtle"
                        onClick={() => {
                          setSelectedWithdrawal(w);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(w)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>لا توجد نتائج مطابقة</Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Drawer لإضافة / تعديل المسحوبة */}
      <WithdrawalDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        withdrawal={selectedWithdrawal || undefined}
       
        onSubmit={handleSubmit}
      />

      {/* Modal لتأكيد الحذف */}
      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف قيمة السحب"
        message="هل أنت متأكد من حذف قيمة السحب؟"
        color="red"
      />
    </>
  );
}
