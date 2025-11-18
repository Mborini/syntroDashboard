"use client";

import { useEffect, useState } from "react";
import {
  Group,
  Table,
  ScrollArea,
  ActionIcon,
  Button,
  Badge,
  Text,
} from "@mantine/core";
import { EyeIcon, PencilIcon, Plus, Trash2 } from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { TableSkeleton } from "../Common/skeleton";

import { InvoiceDetailsModal } from "./InvoiceDetailsModal";

import { InvoiceFilter } from "./InvoiceFilter";
import {
  CreateExpensesInvoiceDTO,
  ExpensesInvoice,
  UpdateExpensesInvoiceDTO,
} from "@/types/ExpensesInvoice";
import {
  createExpensesInvoice,
  deleteExpensesInvoice,
  getExpensesInvoices,
  updateExpensesInvoice,
} from "@/services/ExpensesInvoiceServices";
import { ExpensesInvoiceDrawer } from "./InvoiceDrawer";

export function ExpensesInvoiceTable() {
  const [invoices, setInvoices] = useState<ExpensesInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<ExpensesInvoice[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ExpensesInvoice | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] =
    useState<ExpensesInvoice | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<ExpensesInvoice | null>(
    null,
  );
  const statusTextMap: Record<number, string> = {
    1: "ذمم",
    2: "مدفوع جزئي",
    3: "مدفوع",
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await getExpensesInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to load expenses invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleSubmit = async (
    data: CreateExpensesInvoiceDTO | UpdateExpensesInvoiceDTO,
  ) => {
    try {
      if (selectedInvoice) {
        await updateExpensesInvoice(
          selectedInvoice.id,
          data as UpdateExpensesInvoiceDTO,
        );
        Toast.success("تم تحديث الفاتورة بنجاح");
      } else {
        await createExpensesInvoice(data as CreateExpensesInvoiceDTO);
        Toast.success("تم إنشاء الفاتورة بنجاح");
      }
      await loadInvoices();
      setDrawerOpened(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error(error);
      Toast.error("حدث خطأ أثناء حفظ الفاتورة");
    }
  };

  const handleDeleteClick = (inv: ExpensesInvoice) => {
    setInvoiceToDelete(inv);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      await deleteExpensesInvoice(invoiceToDelete.id);
      setInvoices((prev) => prev.filter((c) => c.id !== invoiceToDelete.id));
      setFilteredInvoices((prev) =>
        prev.filter((c) => c.id !== invoiceToDelete.id),
      );
      setModalOpened(false);
      Toast.success("تم حذف الفاتورة بنجاح");
    } catch (error) {
      console.error(error);
      Toast.error("فشل حذف الفاتورة");
    }
  };

  const handleFilter = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredInvoices(invoices);
      return;
    }
    setFilteredInvoices(
      invoices.filter(
        (inv) =>
          inv.invoice_no.toLowerCase().includes(q) ||
          (inv.supplier || "").toLowerCase().includes(q),
      ),
    );
  };

  if (loading) return <TableSkeleton columns={6} />;

  return (
    <>
      <Group justify="space-between" mb="sm">
        <Button
          size="xm"
          radius="xl"
          color="green"
          variant="light"
          onClick={() => {
            setSelectedInvoice(null);
            setDrawerOpened(true);
          }}
        >
          {" "}
          فاتورة جديدة <Plus size={16} />
        </Button>

        <InvoiceFilter
          onFilter={({
            invoiceNo,
            supplier,
            itemName,
            startDate,
            endDate,
            status,
          }) => {
            setFilteredInvoices(
              invoices.filter((inv) => {
                const matchesInvoiceNo = inv.invoice_no
                  .toLowerCase()
                  .includes(invoiceNo.trim().toLowerCase());
                const matchesSupplier = (inv.supplier || "")
                  .toLowerCase()
                  .includes(supplier.trim().toLowerCase());

                const invoiceDate = new Date(inv.invoice_date);
                invoiceDate.setHours(0, 0, 0, 0);

                const start = startDate ? new Date(startDate) : null;
                if (start) start.setHours(0, 0, 0, 0);

                const end = endDate ? new Date(endDate) : null;
                if (end) end.setHours(0, 0, 0, 0);

                const matchesStartDate = start ? invoiceDate >= start : true;
                const matchesEndDate = end ? invoiceDate <= end : true;

                const matchesItemName = itemName
                  ? inv.items.some((item) =>
                      item.name
                        .toLowerCase()
                        .includes(itemName.trim().toLowerCase()),
                    )
                  : true;

                const matchesStatus = status
                  ? String(inv.status) === status
                  : true;

                return (
                  matchesInvoiceNo &&
                  matchesSupplier &&
                  matchesStartDate &&
                  matchesEndDate &&
                  matchesItemName &&
                  matchesStatus
                );
              }),
            );
          }}
        />

        {filteredInvoices.length > 0 && (
          <Table
            dir="rtl"
            withTableBorder
            className="mt-4 rounded-lg bg-white shadow-md"
          >
            <Table.Thead className="bg-blue-50">
              <Table.Tr>
                <Table.Th style={{ textAlign: "center" }}>
                  عدد الفواتير
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  الإجمالي الكلي
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>المدفوع</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>ذمم</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              <Table.Tr>
                <Table.Td style={{ textAlign: "center" }}>
                  {filteredInvoices.length}
                </Table.Td>

                <Table.Td style={{ textAlign: "center" }}>
                  {filteredInvoices
                    .reduce(
                      (sum, inv) =>
                        sum +
                        inv.items.reduce(
                          (s, item) =>
                            s + Number(item.qty) * Number(item.price),
                          0,
                        ),
                      0,
                    )
                    .toLocaleString(undefined, {
                      style: "currency",
                      currency: "JOD",
                    })}
                </Table.Td>

                <Table.Td style={{ textAlign: "center" }}>
                  {filteredInvoices
                    .reduce((sum, inv) => sum + Number(inv.paid_amount) || 0, 0)
                    .toLocaleString(undefined, {
                      style: "currency",
                      currency: "JOD",
                    })}
                </Table.Td>

                <Table.Td style={{ textAlign: "center" }}>
                  {filteredInvoices
                    .reduce(
                      (sum, inv) => sum + Number(inv.remaining_amount) || 0,
                      0,
                    )
                    .toLocaleString(undefined, {
                      style: "currency",
                      currency: "JOD",
                    })}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        )}
      </Group>

      <ScrollArea mt="md">
        <Table
          dir="rtl"
          className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card"
        >
          <Table.Thead className="dark:bg-gray-darker bg-blue-50">
            <Table.Tr className="h-12 justify-center text-center">
              <Table.Th style={{ textAlign: "center" }}>رقم الفاتورة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>المورد</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>التاريخ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الأصناف</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>
                الإجمالي الكلي
              </Table.Th>
              <Table.Th style={{ textAlign: "center" }}>المدفوع</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الباقي</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الحالة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {filteredInvoices.map((inv) => {
              const grandTotal = inv.items.reduce(
                (sum, item) => sum + Number(item.qty) * Number(item.price),
                0,
              );

              const numericStatus = Number(inv.status);
              return (
                <Table.Tr
                  key={inv.id}
                  className="h-12 cursor-pointer hover:bg-gray-100"
                >
                  <Table.Td>{inv.invoice_no}</Table.Td>
                  <Table.Td>{inv.expense_type || "-"}</Table.Td>
                  <Table.Td>
                    {new Date(inv.invoice_date).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <Text dir="rtl" size="sm">
                      {" "}
                      ({inv.items.length}) صنف{" "}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {grandTotal.toLocaleString(undefined, {
                      style: "currency",
                      currency: "JOD",
                    })}
                  </Table.Td>
                  <Table.Td>
                    {(inv.paid_amount || 0).toLocaleString(undefined, {
                      style: "currency",
                      currency: "JOD",
                    })}
                  </Table.Td>
                  <Table.Td>
                    {(inv.remaining_amount || 0).toLocaleString(undefined, {
                      style: "currency",
                      currency: "JOD",
                    })}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      className="w-20 text-start align-top"
                      color={
                        numericStatus === 3
                          ? "green"
                          : numericStatus === 2
                            ? "yellow"
                            : numericStatus === 1
                              ? "red"
                              : "gray"
                      }
                    >
                      {statusTextMap[numericStatus]}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Group className="justify-center" gap="xs">
                      <ActionIcon
                        radius="xl"
                        variant="light"
                        color="blue"
                        onClick={() => {
                          setInvoiceDetails(inv);
                          setDetailsOpened(true);
                        }}
                      >
                        <EyeIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        radius="xl"
                        variant="light"
                        color="orange"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(inv);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        radius="xl"
                        variant="light"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(inv);
                        }}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <ExpensesInvoiceDrawer
        opened={drawerOpened}
        onClose={() => {
          setDrawerOpened(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSubmit={handleSubmit}
      />

      <InvoiceDetailsModal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        invoice={invoiceDetails}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الفاتورة"
        message="هل أنت متأكد أنك تريد حذف هذه الفاتورة؟"
        color="red"
      />
    </>
  );
}
