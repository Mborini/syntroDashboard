"use client";

import { ScrollArea, Table, Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/skeleton";
import { Toast } from "@/lib/toast";
import {
  getInventoryWithdrawItems,
  undoInventoryWithdraw,
} from "@/services/inventoryWithdrawServices";
import { InventoryWithdraw } from "@/types/inventoryWithdraw";
import { InventoryFilter } from "./InventoryFilter.tsx";
import { LucideUndo2 } from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";
import { PurchaseInvoice } from "@/types/purchaseInvoice";

export function InventoryWithdrawTable() {
  const [items, setItems] = useState<InventoryWithdraw[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryWithdraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] =
    useState<InventoryWithdraw | null>(null);
  async function loadWithdrawals() {
    setLoading(true);
    try {
      const data = await getInventoryWithdrawItems();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      Toast.error("فشل تحميل سحوبات المستودع");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleDeleteClick = (inv: InventoryWithdraw) => {
    setInvoiceToDelete(inv);
    setModalOpened(true);
  };
  const handleUndo = async (id: number) => {
    try {
      await undoInventoryWithdraw(id);
      Toast.success("تم التراجع عن السحب بنجاح");
      await loadWithdrawals();
    } catch (err) {
      console.error(err);
      Toast.error("حدث خطأ أثناء التراجع عن السحب");
    }
  };
  const handleFilter = (filters: {
    name: string;
    weight: string;
    date: Date | null;
  }) => {
    const filtered = items.filter((item) => {
      const matchesName = item.item_name
        .toLowerCase()
        .includes(filters.name.toLowerCase());

      const matchesWeight = item.item_weight
        .toString()
        .includes(filters.weight);

      const matchesDate = filters.date
        ? new Date(item.created_at).toDateString() ===
          filters.date.toDateString()
        : true;

      return matchesName && matchesWeight && matchesDate;
    });

    setFilteredItems(filtered);
  };

  if (loading) return <TableSkeleton columns={6} />;

  return (
    <>
      <InventoryFilter onFilter={handleFilter} />
      <ScrollArea>
        <Table
          dir="rtl"
          className="w-full rounded-lg bg-white text-center shadow-md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>اسم الصنف</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الوزن (كغ)</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>
                الكمية المسحوبة
              </Table.Th>
              <Table.Th style={{ textAlign: "center" }}>ملاحظات السحب</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>تاريخ السحب</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>
                تراجع عن السحب
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredItems.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.item_name}</Table.Td>
                <Table.Td>{item.item_weight}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>{item.notes || "-"}</Table.Td>
                <Table.Td>
                  {new Date(item.created_at).toLocaleDateString("en-JO")}
                </Table.Td>
                <Table.Td>
                  <Group justify="center">
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <LucideUndo2 size={16} />
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={async () => {
          if (invoiceToDelete) {
            await handleUndo(invoiceToDelete.id);
            setModalOpened(false);
            setInvoiceToDelete(null);
          }
        }}
        title="التراجع عن عملية السحب"
        message="هل أنت متأكد من رغبتك في ارجاع الكمية المسحوبة الى مستودع المواد الاولية؟ لا يمكن التراجع عن هذا الإجراء."
        color="red"
      />
    </>
  );
}
