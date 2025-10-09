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
import { CreateSalesItemDTO, SalesItem, UpdateSalesItemDTO } from "@/types/salesItem";
import { SalesItemDrawer } from "./PurchaseItemDrawer";
import { SalesItemFilter } from "./PurchaseItemFilter";
import { PiPlusBold } from "react-icons/pi";
import { createSalesItem, deleteSalesItem, getSalesItems, updateSalesItem } from "@/services/salesItemServices";


export function SalesItemsTable() {
  const [items, setItems] = useState<SalesItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SalesItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<SalesItem | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  // تحميل البيانات
  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const data = await getSalesItems();
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Failed to fetch sales items:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItems();

  }, []);

  // ✅ دالة الفلترة
  const handleFilter = (filters: {
    name: string;
    weight: string;
    notes: string | null | undefined;
  }) => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.weight.toString().includes(filters.weight) &&
        (item.notes || "").toLowerCase().includes((filters.notes || "").toLowerCase()),
    );
    setFilteredItems(filtered);
  };

  // ✅ الحفظ (إضافة أو تعديل)
  const handleSubmit = async (
    data: CreateSalesItemDTO | UpdateSalesItemDTO,
  ) => {
    try {
      if (selectedItem) {
        await updateSalesItem(selectedItem.id, data);
        const refreshed = await getSalesItems();
        setItems(refreshed);
        setFilteredItems(refreshed);
        Toast.success("تم تحديث الصنف بنجاح");
      } else {
        await createSalesItem(data as CreateSalesItemDTO);
        const refreshed = await getSalesItems();
        setItems(refreshed);
        setFilteredItems(refreshed);
        Toast.success("تم إضافة الصنف بنجاح");
      }
      setDrawerOpened(false);
    } catch (error) {
      Toast.error("فشل حفظ الصنف");
      console.error("Error saving sales item:", error);
    }
  };

  // ✅ الحذف
  const handleDeleteClick = (item: SalesItem) => {
    setItemToDelete(item);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteSalesItem(itemToDelete.id);

        const updated = items.filter((i) => i.id !== itemToDelete.id);
        setItems(updated);
        setFilteredItems(updated);
        setItemToDelete(null);
        setModalOpened(false);

        Toast.success("تم حذف الصنف بنجاح");
      } catch (error: any) {
        const message =
          error?.message || error?.error || "فشل حذف الصنف";

        Toast.error(message);
        console.error(error);
      }
    }
  };

  if (loading) return <TableSkeleton columns={4} />;
  return (
    <>
      {/* ✅ فلاتر الأصناف */}
      <Group mb="md" justify="space-between">
        <Button
                radius={"md"}

          color="green"
          variant="light"
          onClick={() => {
            setSelectedItem(null);
            setDrawerOpened(true);
          }}
           leftSection={<PiPlusBold size={18} />}
        >
          إضافة صنف
        </Button>
        <SalesItemFilter onFilter={handleFilter} />
      </Group>

      {/* جدول الأصناف */}
      <ScrollArea>
        <div className="flex justify-center">
          <Table
            dir="rtl"
            className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card"
          >
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th style={{ textAlign: "center" }}>الاسم</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>سعر التكلفة </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>سعر البيع</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الوزن (ك)</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الملاحظات</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {filteredItems.map((item) => (
                <Table.Tr key={item.id} className="h-12 align-middle">
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{item.cost_price}</Table.Td>
                  <Table.Td>{item.sale_price}</Table.Td>
                  <Table.Td>{item.weight}</Table.Td>
                  <Table.Td>{item.notes}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        onClick={() => {
                          setSelectedItem(item);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(item)}
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

      {/* Drawer */}
      <SalesItemDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        item={selectedItem}
        onSubmit={handleSubmit}
      />

      {/* تأكيد الحذف */}
      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف صنف"
        message="هل تريد حذف هذا الصنف؟"
        color="red"
      />
    </>
  );
}
