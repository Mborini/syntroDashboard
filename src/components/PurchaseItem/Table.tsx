"use client";

import {
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { PencilIcon, Trash2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import {
  createPurchaseItem,
  deletePurchaseItem,
  getPurchaseItems,
  updatePurchaseItem,
} from "@/services/purchaseItemServices";
import {
  CreatePurchaseItemDTO,
  PurchaseItem,
  UpdatePurchaseItemDTO,
} from "@/types/purchaseItem";
import { PurchaseItemDrawer } from "./PurchaseItemDrawer";
import { PurchaseItemFilter } from "./PurchaseItemFilter";

export function PurchaseItemsTable() {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PurchaseItem | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  // تحميل البيانات
  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const data = await getPurchaseItems();
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Failed to fetch purchase items:", error);
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
    barcode: string;
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
    data: CreatePurchaseItemDTO | UpdatePurchaseItemDTO,
  ) => {
    try {
      if (selectedItem) {
        await updatePurchaseItem(selectedItem.id, data);
        const refreshed = await getPurchaseItems();
        setItems(refreshed);
        setFilteredItems(refreshed);
        Toast.success("تم تحديث الصنف بنجاح");
      } else {
        await createPurchaseItem(data as CreatePurchaseItemDTO);
        const refreshed = await getPurchaseItems();
        setItems(refreshed);
        setFilteredItems(refreshed);
        Toast.success("تم إضافة الصنف بنجاح");
      }
      setDrawerOpened(false);
    } catch (error) {
      Toast.error("فشل حفظ الصنف");
      console.error("Error saving purchase item:", error);
    }
  };

  // ✅ الحذف
  const handleDeleteClick = (item: PurchaseItem) => {
    setItemToDelete(item);
    setModalOpened(true);
  };
const handleConfirmDelete = async () => {
  if (itemToDelete) {
    try {
      await deletePurchaseItem(itemToDelete.id);

      const updated = items.filter((i) => i.id !== itemToDelete.id);
      setItems(updated);
      setFilteredItems(updated);
      setItemToDelete(null);
      setModalOpened(false);

      Toast.success("تم حذف الصنف بنجاح");
    } catch (error: any) {
      // حاول استخراج رسالة الخطأ من الاستجابة
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

      {/* زر الإضافة */}
      <Group justify="space-between" mb="sm">
        {" "}
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedItem(null);
            setDrawerOpened(true);
          }}
        >
          <PlusCircle size={18} />
          إضافة صنف
        </Button>
        <PurchaseItemFilter onFilter={handleFilter} />
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
                <Table.Th style={{ textAlign: "center" }}>الوزن (ك)</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الملاحظات</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {filteredItems.map((item) => (
                <Table.Tr key={item.id} className="h-12 align-middle">
                  <Table.Td>{item.name}</Table.Td>
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
      <PurchaseItemDrawer
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
