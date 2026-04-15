"use client";

import {
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { PiPlusBold } from "react-icons/pi";

import {
  createBinsLocation,
  deleteBinsLocation,
  getBinsLocations,
  updateBinsLocation,
} from "@/services/binsLocationServices";

import { BinsLocationFilter } from "./BinsLocationFilter";
import BinsLocationDrawer from "./BinsLocationDrawer";

type BinsLocation = {
  id: string;
  region_name: string;
  vehicle_number: string;
  shift?: string;
  bins?: number;
  route?: string;
  file_url?: string;
};

type BinsLocationDTO = {
  region_name: string;
  vehicle_number: string;
  file: File | null;
  shift?: string;
  bins?: number;
  route?: string;
};

export function BinsLocationTable() {
  const [items, setItems] = useState<BinsLocation[]>([]);
  const [filteredItems, setFilteredItems] = useState<BinsLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BinsLocation | null>(null);

  const [deleteItem, setDeleteItem] = useState<BinsLocation | null>(null);
  const [confirmOpened, setConfirmOpened] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getBinsLocations();
    setItems(data);
    setFilteredItems(data);
    setLoading(false);
  };

  const handleFilter = (filters: {
    region_name: string;
    vehicle_number: string;
  }) => {
    const filtered = items.filter(
      (i) =>
        i.region_name.toLowerCase().includes(filters.region_name.toLowerCase()) &&
        i.vehicle_number.toLowerCase().includes(filters.vehicle_number.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handleSubmit = async (data: BinsLocationDTO) => {
    try {
      if (selectedItem) {
        await updateBinsLocation(selectedItem.id, data);
        Toast.success("تم التحديث");
      } else {
        await createBinsLocation(data);
        Toast.success("تم الإضافة");
      }

      await loadData();
      setDrawerOpened(false);
      setSelectedItem(null);
    } catch {
      Toast.error("فشل الحفظ");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    await deleteBinsLocation(deleteItem.id);

    setItems((p) => p.filter((i) => i.id !== deleteItem.id));
    setFilteredItems((p) => p.filter((i) => i.id !== deleteItem.id));

    setConfirmOpened(false);
    setDeleteItem(null);

    Toast.success("تم الحذف");
  };

  if (loading) return <TableSkeleton columns={6} />;

  return (
    <>
      {/* TOP BAR */}
      <Group mb="md" justify="space-between">
        <Button
          color="green"
          variant="light"
          leftSection={<PiPlusBold size={18} />}
          onClick={() => {
            setSelectedItem(null);
            setDrawerOpened(true);
          }}
        >
          إضافة منطقة
        </Button>

        <BinsLocationFilter onFilter={handleFilter} />
      </Group>

      {/* TABLE */}
      <ScrollArea>
        <Table
          dir="rtl"
          className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card"
        >
          <Table.Thead>
            <Table.Tr>
               <Table.Th style={{ textAlign: "center" }}>اسم المنطقة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الشفت</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>رقم السيارة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredItems.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td >{item.region_name}</Table.Td>
                <Table.Td>{item.shift}</Table.Td>
                <Table.Td>{item.vehicle_number}</Table.Td>
                <Table.Td>{item.route}</Table.Td>

                <Table.Td>
                  <Group justify="center">
                    <ActionIcon
                      color="orange"
                      variant="subtle"
                      onClick={() => {
                        setSelectedItem(item);
                        setDrawerOpened(true);
                      }}
                    >
                      <PencilIcon size={18} />
                    </ActionIcon>

                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => {
                        setDeleteItem(item);
                        setConfirmOpened(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* DRAWER */}
      <BinsLocationDrawer
        opened={drawerOpened}
        onClose={() => {
          setDrawerOpened(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSubmit={handleSubmit}
      />

      {/* DELETE */}
      <ConfirmModal
        opened={confirmOpened}
        onClose={() => setConfirmOpened(false)}
        onConfirm={handleDelete}
        title="حذف منطقة"
        message="هل أنت متأكد؟"
        color="red"
      />
    </>
  );
}