"use client";
import { useRef } from "react";
import { Modal, Table, Text, Badge, Button, ActionIcon } from "@mantine/core";
import { SalesInvoice } from "@/types/salesInvoice";
import handlePrintInvoice from "../Common/invoicePrintTemp";
import { MdLocalPrintshop } from "react-icons/md";

type Props = {
  opened: boolean;
  onClose: () => void;
  invoice: SalesInvoice | null;
};

export function InvoiceDetailsModal({ opened, onClose, invoice }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const numericStatus = Number(invoice.status);
  const statusTextMap: Record<number, string> = {
    2: "مدفوع جزئي",
    1: "ذمم",
    3: "مدفوع",
  };




  return (
    <Modal
      dir="rtl"
      opened={opened}
      onClose={onClose}
      title={`فاتورة رقم #${invoice.invoice_no}`}
      size="lg"
    >
      <div ref={printRef}>
        <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
          <Text fw="bold">اسم الزبون: {invoice.customer_name}</Text>
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
          <ActionIcon
            radius="xl"
            variant="light"
            color="green"
            onClick={() => handlePrintInvoice(invoice)}
          >
            <MdLocalPrintshop />
          </ActionIcon>
        </div>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>الصنف</Table.Th>
              <Table.Th>الكمية</Table.Th>
              <Table.Th>الوزن</Table.Th>
              <Table.Th>السعر الافرادي</Table.Th>
              <Table.Th>المجموع الاجمالي</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invoice.items.map((item, i) => (
              <Table.Tr key={i}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.qty}</Table.Td>
                <Table.Td>{item.weight}</Table.Td>
                <Table.Td>{item.unit_price}</Table.Td>
                <Table.Td>
                  {Number(item.price).toLocaleString(undefined, {
                    style: "currency",
                    currency: "JOD",
                  })}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Text mt="md" fw="bold">
          الإجمالي الكلي:{" "}
          {invoice.grand_total.toLocaleString(undefined, {
            style: "currency",
            currency: "JOD",
          })}
        </Text>
        <Text mt="md" fw="bold">
          المدفوع:{" "}
          {invoice.paid_amount.toLocaleString(undefined, {
            style: "currency",
            currency: "JOD",
          })}
        </Text>
        <Text mt="md" fw="bold">
          الباقي:{" "}
          {invoice.remaining_amount.toLocaleString(undefined, {
            style: "currency",
            currency: "JOD",
          })}
        </Text>
      </div>



    </Modal>
  );
}
