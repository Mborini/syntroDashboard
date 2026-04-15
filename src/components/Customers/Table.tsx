"use client";

import { Table, Button, Group, ActionIcon, ScrollArea } from "@mantine/core";
import { PencilIcon, Trash2, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";

import { Toast } from "@/lib/toast";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/customerServices";
import { CustomerDrawer } from "./customerDrawer";
import {
  CreateCustomerDTO,
  Customer,
  UpdateCustomerDTO,
} from "@/types/customer";

export function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const handleSubmit = async (data: CreateCustomerDTO | UpdateCustomerDTO) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, data);
        const refreshedCustomers = await getCustomers();
        setCustomers(refreshedCustomers);
        Toast.success("تم تحديث الزبون بنجاح");
      } else {
        await createCustomer(data as CreateCustomerDTO);
        const refreshedCustomers = await getCustomers();
        setCustomers(refreshedCustomers);
        Toast.success("تم اضافة الزبون بنجاح");
      }
      setDrawerOpened(false);
    } catch (error) {
      Toast.error("فشل في حفظ الزبون");
      console.error(error);
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete.id);
        setCustomers((prev) =>
          prev.filter((c) => c.id !== customerToDelete.id),
        );
        setCustomerToDelete(null);
        setModalOpened(false);
        Toast.success("تم حذف الزبون بنجاح");
      } catch (error) {
        console.error(error);
        Toast.error("فشل في حذف الزبون");
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
            setSelectedCustomer(null);
            setDrawerOpened(true);
          }}
        >
          <UserRoundPlus size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table
            dir="rtl"
            className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card"
          >
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th style={{ textAlign: "center" }}>الاسم</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الهاتف</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>العنوان</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {customers.map((customer) => (
                <Table.Tr key={customer.id} className="h-12 align-middle">
                  <Table.Td>{customer.name}</Table.Td>
                  <Table.Td>{customer.phone}</Table.Td>
                  <Table.Td>{customer.address}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(customer)}
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

      <CustomerDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        customer={selectedCustomer}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الزبون"
        message="هل تريد حذف هذا الزبون؟"
        color="red"
      />
    </>
  );
}
