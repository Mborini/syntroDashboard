"use client";

import { ScrollArea, Table, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/skeleton";
import { Toast } from "@/lib/toast";
import { InventoryItem } from "@/types/inventory";
import { getInventoryItems } from "@/services/inventoryServices";
import { InventoryFilter } from "./InventoryFilter.tsx";

export function InventoryTable() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInventory() {
      setLoading(true);
      try {
        const data = await getInventoryItems();
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        Toast.error("فشل تحميل المستودع");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  const handleFilter = (filters: { name: string; weight: string }) => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.weight.toString().includes(filters.weight)
    );
    setFilteredItems(filtered);
  };

  if (loading) return <TableSkeleton columns={4} />;

  return (
    <>
      <InventoryFilter onFilter={handleFilter} />
      <ScrollArea>
        <Table dir="rtl" className="w-full text-center bg-white rounded-lg shadow-md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{textAlign: "center"}}>الاسم</Table.Th>
              <Table.Th style={{textAlign: "center"}}>الوزن (كغ)</Table.Th>
              <Table.Th style={{textAlign: "center"}}>الكمية</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredItems.map((item) => (
              <Table.Tr key={item.item_id}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.weight}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
