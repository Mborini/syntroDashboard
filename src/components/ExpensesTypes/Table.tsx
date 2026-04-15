"use client";

import {
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { PencilIcon, Trash2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";



import { Toast } from "@/lib/toast";

import { CreateExpenseTypeDTO, ExpenseType, UpdateExpenseTypeDTO } from "@/types/expenseType";
import { createExpenseType, deleteExpenseType, getExpenseTypes, updateExpenseType } from "@/services/expensesTypeServices";
import { ExpensesTypeDrawer } from "./ExpensesDrawer";

export function ExpensesTypeTable() {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType | null>(null);

  const [expenseTypeToDelete, setExpenseTypeToDelete] = useState<ExpenseType | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    async function loadExpenseTypes() {
      setLoading(true);
      try {
        const data = await getExpenseTypes();
        setExpenseTypes(data);
      } catch (error) {
        console.error("Failed to fetch expense types:", error);
      } finally {
        setLoading(false);
      }
    }
    loadExpenseTypes();
  }, []);

  const handleSubmit = async (data: CreateExpenseTypeDTO | UpdateExpenseTypeDTO) => {
    try {
      if (selectedExpenseType) {
        await updateExpenseType(selectedExpenseType.id, data);
      } else {
        await createExpenseType(data as CreateExpenseTypeDTO);
      }

      const refreshed = await getExpenseTypes();
      setExpenseTypes(refreshed);

      setDrawerOpened(false);
      Toast.success("تم حفظ نوع المصروف بنجاح");
    } catch (error) {
      Toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDeleteClick = (expType: ExpenseType) => {
    setExpenseTypeToDelete(expType);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (expenseTypeToDelete) {
      try {
        await deleteExpenseType(expenseTypeToDelete.id);
        setExpenseTypes((prev) =>
          prev.filter((e) => e.id !== expenseTypeToDelete.id)
        );

        setExpenseTypeToDelete(null);
        setModalOpened(false);
        Toast.success("تم حذف نوع المصروف");
      } catch {
        Toast.error("فشل حذف نوع المصروف");
      }
    }
  };

  if (loading) {
    return <TableSkeleton columns={2} />;
  }

  return (
    <>
      <Group mb="md">
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedExpenseType(null);
            setDrawerOpened(true);
          }}
        >
          <PlusCircle size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table dir="rtl" className="w-full rounded-lg bg-white text-center shadow-md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>اسم نوع المصروف</Table.Th>
                <Table.Th>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {expenseTypes.map((exp) => (
                <Table.Tr key={exp.id}>
                  <Table.Td>{exp.name}</Table.Td>

                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        onClick={() => {
                          setSelectedExpenseType(exp);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>

                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(exp)}
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

      <ExpensesTypeDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        expenseType={selectedExpenseType}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف نوع مصروف"
        message="هل تريد حذف هذا النوع؟"
        color="red"
      />
    </>
  );
}
