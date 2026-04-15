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
import { EyeIcon, PencilIcon, Plus, Printer, Trash2 } from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { TableSkeleton } from "../Common/skeleton";

import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { SalesInvoiceDrawer } from "./PurchaseInvoiceDrawer";
import {
  getSalesInvoices,
  deleteSalesInvoice,
  updateSalesInvoice,
  createSalesInvoice,
} from "@/services/salesInvoiceServices";

import { InvoiceFilter } from "./InvoiceFilter";
import {
  CreateSalesInvoiceDTO,
  SalesInvoice,
  UpdateSalesInvoiceDTO,
} from "@/types/salesInvoice";
import { MdLocalPrintshop } from "react-icons/md";
import handlePrintInvoice from "../Common/invoicePrintTemp";

export function SalesInvoiceTable() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<SalesInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(
    null,
  );
  const [modalOpened, setModalOpened] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<SalesInvoice | null>(
    null,
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<SalesInvoice | null>(
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
      const data = await getSalesInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error(error);
      Toast.error("فشل جلب الفواتير");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);


  const handleSubmit = async (
    data: CreateSalesInvoiceDTO | UpdateSalesInvoiceDTO,
  ) => {
    try {
      if (selectedInvoice) {
        // استخدام الدالة من السيرفس
        await updateSalesInvoice(selectedInvoice.id, data as any);
        Toast.success("تم تعديل الفاتورة بنجاح");
      } else {
        await createSalesInvoice(data);
        Toast.success("تم إنشاء الفاتورة بنجاح");
      }
      await loadInvoices();
      setDrawerOpened(false);
      setSelectedInvoice(null);
    } catch (error: any) {
      console.error(error);
      Toast.error(error.message || "فشل حفظ الفاتورة");
    }
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      await deleteSalesInvoice(invoiceToDelete.id);
      setInvoices((prev) => prev.filter((c) => c.id !== invoiceToDelete.id));
      setFilteredInvoices((prev) =>
        prev.filter((c) => c.id !== invoiceToDelete.id),
      );
      setModalOpened(false);
      Toast.success("تم حذف الفاتورة بنجاح");
      await loadInvoices();
    } catch (error: any) {
      console.error(error);
      Toast.error(error.message || "فشل حذف الفاتورة");
    }
  };

  const handleDeleteClick = (inv: SalesInvoice) => {
    setInvoiceToDelete(inv);
    setModalOpened(true);
  };

  // داخل SalesInvoiceTable
  const handleFilter = ({
    invoiceNo,
    customer,
    itemName,
    startDate,
    endDate,
    status,
  }: {
    invoiceNo: string;
    customer: string;
    itemName: string;
    startDate: string;
    endDate: string;
    status: string;
  }) => {
    let filtered = [...invoices];
    if (itemName.trim()) {
      filtered = filtered.filter((inv) =>
        inv.items.some((i) =>
          i.item_name?.toLowerCase().includes(itemName.trim().toLowerCase()),
        ),
      );
    }

    if (invoiceNo.trim()) {
      filtered = filtered.filter((inv) =>
        inv.invoice_no.toString().includes(invoiceNo.trim()),
      );
    }

    if (customer.trim()) {
      ``;
      filtered = filtered.filter((inv) =>
        inv.customer_name
          ?.toLowerCase()
          .includes(customer.trim().toLowerCase()),
      );
    }

    if (itemName.trim()) {
      filtered = filtered.filter((inv) =>
        inv.items.some((i) =>
          i.item_name?.toLowerCase().includes(itemName.trim().toLowerCase()),
        ),
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((inv) => new Date(inv.invoice_date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter((inv) => new Date(inv.invoice_date) <= end);
    }

    if (status) {
      filtered = filtered.filter((inv) => inv.status.toString() === status);
    }

    setFilteredInvoices(filtered);
  };

  if (loading) return <TableSkeleton columns={6} />;

  return (
    <>
      <Group justify="space-between" mb="sm">
        <Button
          size="sm"
          radius="xl"
          color="green"
          variant="light"
          onClick={() => {
            setSelectedInvoice(null);
            setDrawerOpened(true);
          }}
        >
          فاتورة جديدة <Plus size={16} />
        </Button>

        <InvoiceFilter onFilter={handleFilter} />
      </Group>
      {filteredInvoices.length > 0 && (
        <Table
          dir="rtl"
          withTableBorder
          className="mt-4 rounded-lg bg-white shadow-md"
        >
          <Table.Thead className="bg-blue-50">
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>عدد الفواتير</Table.Th>
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
                  .reduce((sum, inv) => sum + (Number(inv.grand_total) || 0), 0)
                  .toLocaleString(undefined, {
                    style: "currency",
                    currency: "JOD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </Table.Td>

              <Table.Td style={{ textAlign: "center" }}>
                {filteredInvoices
                  .reduce((sum, inv) => sum + Number(inv.paid_amount) || 0, 0)
                  .toLocaleString(undefined, {
                    style: "currency",
                    currency: "JOD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </Table.Td>

              <Table.Td style={{ textAlign: "center" }}>
                {filteredInvoices
                  .reduce(
                    (sum, inv) => sum + (Number(inv.remaining_amount) || 0),
                    0,
                  )
                  .toLocaleString(undefined, {
                    style: "currency",
                    currency: "JOD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      )}
      <ScrollArea mt="md">
        <Table
          dir="rtl"
          className="w-full rounded-lg bg-white text-center shadow-md"
        >
          <Table.Thead className="bg-blue-50">
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>رقم الفاتورة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الزبون</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>التاريخ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>عدد الأصناف</Table.Th>
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
              const numericStatus = Number(inv.status);

              return (
                <Table.Tr key={inv.id} className="h-12 hover:bg-gray-100">
                  <Table.Td>{inv.invoice_no}</Table.Td>
                  <Table.Td>{inv.customer_name}</Table.Td>
                  <Table.Td>
                    {new Date(inv.invoice_date).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td> ({inv.items.length}) صنف </Table.Td>
                  <Table.Td>
                    {(inv.grand_total || 0).toLocaleString(undefined, {
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
                      color={
                        numericStatus === 3
                          ? "green"
                          : numericStatus === 2
                            ? "yellow"
                            : "red"
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
      color="green"
     onClick={() => handlePrintInvoice(inv)}
    >
      {/* أيقونة الطباعة */}
      <MdLocalPrintshop />
    </ActionIcon>

    <ActionIcon
      radius="xl"
      variant="light"
      color="orange"
      onClick={() => {
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
      onClick={() => handleDeleteClick(inv)}
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

      <SalesInvoiceDrawer
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
        title="حذف الفاتورة مبيعات"
        message="سيتم حذف هذه الفاتورة بشكل كامل و ارجاع كميات الاصناف الى مستودع الانتاج , هل انت متأكد من عملية الحذف؟"
        color="red"
      />
    </>
  );
}
