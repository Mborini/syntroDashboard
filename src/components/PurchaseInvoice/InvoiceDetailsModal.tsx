"use client";
import { PurchaseInvoice } from "@/types/purchaseInvoice";
import { Modal, Table, Text } from "@mantine/core";
import { Badge } from "@mantine/core"; // استخدم Mantine Badge بدل Lucide

type Props = {
  opened: boolean;
  onClose: () => void;
  invoice: PurchaseInvoice | null;
};

export function InvoiceDetailsModal({ opened, onClose, invoice }: Props) {
  if (!invoice) return null;

  const numericStatus = Number(invoice.status);
  const statusTextMap: Record<number, string> = {
    2: "مدفوع جزئي",
    1: "ذمم",
    3: "مدفوع",
  };

  const grandTotal = invoice.items.reduce(
    (sum, item) => sum + Number(item.qty) * Number(item.price),
    0,
  );
  const paid_amount = Math.max(invoice.paid_amount || 0, 0);
  const remainingAmount = Math.max(grandTotal - paid_amount, 0);

  return (
    <Modal
      dir="rtl"
      opened={opened}
      onClose={onClose}
      title={`فاتورة رقم #${invoice.invoice_no}`}
      size="lg"
    >
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Text fw="bold">المورد: {invoice.supplier}</Text>
        <Text fw="bold">
          التاريخ: {new Date(invoice.invoice_date).toLocaleDateString()}
        </Text>
        <Badge
          variant="light"
          className="text-center"
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
      </div>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>الصنف</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>الكمية</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>السعر</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>الإجمالي</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {invoice.items.map((item, i) => (
            <Table.Tr key={i} style={{ textAlign: "center" }}>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.qty}</Table.Td>
              <Table.Td>{item.price}</Table.Td>
              <Table.Td>
                {(Number(item.qty) * Number(item.price)).toLocaleString(
                  undefined,
                  {
                    style: "currency",
                    currency: "JOD",
                  },
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Text mt="md" fw="bold">
        الإجمالي الكلي:{" "}
        {grandTotal.toLocaleString(undefined, {
          style: "currency",
          currency: "JOD",
        })}
      </Text>
      <Text mt="md" fw="bold">
        المدفوع:{" "}
        {paid_amount.toLocaleString(undefined, {
          style: "currency",
          currency: "JOD",
        })}
      </Text>
      <Text mt="md" fw="bold">
        الباقي:{" "}
        {remainingAmount.toLocaleString(undefined, {
          style: "currency",
          currency: "JOD",
        })}
      </Text>
    </Modal>
  );
}
