"use client";

import { ScrollArea, Table, Group, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { Toast } from "@/lib/toast";

import { WarehouseFilter } from "./WarehouseFilter";
import { WarehouseFormDrawer } from "./WarehouseFormDrawer";
import { PiPlusBold } from "react-icons/pi";
import {
  getWarehouseItems,
  deleteWarehouseItem,
} from "@/services/warehouseServices";
import { WarehouseItem } from "@/types/warehouse";
import { TableSkeleton } from "../Common/skeleton";
import { PencilIcon, Trash2 } from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";

export function WarehouseTable() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpened, setFormOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<WarehouseItem | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getWarehouseItems();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      Toast.error("فشل تحميل بيانات المستودع");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (item: WarehouseItem) => {
    setItemToDelete(item);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteWarehouseItem(itemToDelete.item_id);
      Toast.success("تم حذف المنتج بنجاح");
      setItemToDelete(null);
      setModalOpened(false);
      loadData();
    } catch (error) {
      Toast.error("فشل حذف المنتج");
    }
  };
const handleFilter = (filters: any) => {
  const formatDateLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedDate = filters.date
    ? formatDateLocal(filters.date.toString())
    : null;

  const filtered = items.filter((item) => {
    const itemName = item.item_name || "";
    const itemWeight = item.weight || "";
    const itemQuantity = item.quantity || "";

    const itemDate = item.production_date
      ? formatDateLocal(item.production_date)
      : "";

    return (
      itemName.toLowerCase().includes(filters.name.toLowerCase()) &&
      itemWeight.toString().includes(filters.weight) &&
      itemQuantity.toString().includes(filters.quantity) &&
      (!selectedDate || itemDate === selectedDate)
    );
  });

  setFilteredItems(filtered);
};



  if (loading) return <TableSkeleton columns={6} />;

  return (
    <>
      <Group mb="md" justify="space-between">
        <Button
          color="green"
          radius="xl"
          variant="light"
          onClick={() => {
            setSelectedItem(null);
            setFormOpened(true);
          }}
          leftSection={<PiPlusBold size={18} />}
        >
          إضافة منتج
        </Button>

        <WarehouseFilter onFilter={handleFilter} />
      </Group>

      <ScrollArea>
        <Table
          dir="rtl"
          striped
          highlightOnHover
          className="w-full rounded-lg bg-white text-center shadow-md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>الاسم</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الوزن (كغ)</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الكمية</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>تاريخ الإنتاج</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>ملاحظات</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>إجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredItems.map((item) => {
              const formattedDate = item.production_date
                ? new Date(item.production_date).toLocaleDateString("en-EG", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "";

              return (
                <Table.Tr key={item.item_id}>
                  <Table.Td>{item.item_name}</Table.Td>
                  <Table.Td>{item.weight}</Table.Td>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>{formattedDate}</Table.Td>
                  <Table.Td>{item.note}</Table.Td>
                  <Table.Td>
                    <Group justify="center" gap="xs">
                      <Button
                        size="xs"
                        color="orange"
                        variant="light"
                        onClick={() => {
                          setSelectedItem(item);
                          setFormOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </Button>

                      <Button
                        size="xs"
                        color="red"
                        variant="light"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* حذف */}
      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف صنف"
        message="هل تريد حذف هذا الصنف؟"
        color="red"
      />

      {/* إضافة / تعديل */}
      <WarehouseFormDrawer
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        item={selectedItem}
        onSuccess={loadData}
      />
    </>
  );
}
