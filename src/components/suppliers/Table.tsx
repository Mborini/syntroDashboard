"use client";

import {
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { PencilIcon, Trash2, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";

import { CreateSupplierDTO, UpdateSupplierDTO, Supplier } from "@/types/supplier";
import { Toast } from "@/lib/toast";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "@/services/supplierServices";
import { SupplierDrawer } from "./SupplierDrawer";

export function SuppliersTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    async function loadSuppliers() {
      setLoading(true);
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSuppliers();
  }, []);

  const handleSubmit = async (data: CreateSupplierDTO | UpdateSupplierDTO) => {
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, data);
        const refreshedSuppliers = await getSuppliers();
        setSuppliers(refreshedSuppliers);
        Toast.success("Supplier updated successfully");
      } else {
        await createSupplier(data as CreateSupplierDTO);
        const refreshedSuppliers = await getSuppliers();
        setSuppliers(refreshedSuppliers);
        Toast.success("Supplier created successfully");
      }
      setDrawerOpened(false);
    } catch (error) {
      Toast.error("Failed to save supplier");
      console.error("Failed to save supplier:", error);
    }
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (supplierToDelete) {
      try {
        await deleteSupplier(supplierToDelete.id);
        setSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete.id));
        setSupplierToDelete(null);
        setModalOpened(false);
        Toast.success("Supplier deleted successfully");
      } catch (error) {
        console.error("Failed to delete supplier:", error);
        Toast.error("Failed to delete supplier");
      }
    }
  };

  if (loading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <>
      <Group mb="md">
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedSupplier(null);
            setDrawerOpened(true);
          }}
        >
          <UserRoundPlus size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table dir="rtl" className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th style={{ textAlign: "center" }}>الاسم</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الهاتف</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>العنوان</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {suppliers.map((supplier) => (
                <Table.Tr key={supplier.id} className="h-12 align-middle">
                  <Table.Td>{supplier.name}</Table.Td>
                  <Table.Td>{supplier.phone}</Table.Td>
                  <Table.Td>{supplier.address}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(supplier)}
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

      <SupplierDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        supplier={selectedSupplier}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف مورد"
        message="هل تريد حذف هذا المورد؟"
        color="red"
      />
    </>
  );
}
