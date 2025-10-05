"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  TextInput,
  NumberInput,
  Button,
  Group,
  Text,
  ActionIcon,
  Divider,
  Select,
} from "@mantine/core";
import { Trash2 } from "lucide-react";
import { CreateExpensesInvoiceDTO, ExpensesInvoice, UpdateExpensesInvoiceDTO } from "@/types/ExpensesInvoice";
import { getSuppliers } from "@/services/supplierServices";

type Props = {
  opened: boolean;
  onClose: () => void;
  invoice?: ExpensesInvoice | null;
  onSubmit: (data: CreateExpensesInvoiceDTO | UpdateExpensesInvoiceDTO) => void;
};

export function ExpensesInvoiceDrawer({
  opened,
  onClose,
  invoice,
  onSubmit,
}: Props) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplierId, setSupplierId] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState<
    { name: string; qty: number; price: number }[]
  >([]);
  const [status, setStatus] = useState<"ذمم" | "مدفوع جزئي" | "مدفوع">("ذمم");
  const [paidAmount, setPaidAmount] = useState(0);

  const grandTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const remainingAmount = Math.max(grandTotal - paidAmount, 0);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (invoice) {
      setInvoiceNo(invoice.invoice_no);
      setSupplierId(invoice.supplier_id || 0);
      setInvoiceDate(invoice.invoice_date || "");
      setItems(invoice.items || []);
      setPaidAmount(invoice.paid_amount || 0);
    } else {
      setInvoiceNo("");
      setSupplierId(0);
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setItems([{ name: "", qty: 1, price: 0 }]);
      setPaidAmount(0);
    }
  }, [invoice, opened]);
 useEffect(() => {
    async function loadSuppliers() {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    }
    loadSuppliers();
  }, []);
  // تحديث الحالة تلقائيًا
  useEffect(() => {
    if (paidAmount === 0) setStatus("ذمم");
    else if (paidAmount < grandTotal) setStatus("مدفوع جزئي");
    else setStatus("مدفوع");
  }, [paidAmount, grandTotal]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };
  const statusMap: Record<string, number> = {
    ذمم: 1,
    "مدفوع جزئي": 2,
    مدفوع: 3,
  };

const handleSave = () => {
  // تقريب القيم لعشريتين
  const roundedItems = items.map((item) => ({
    ...item,
    price: Math.round(item.price * 100) / 100,
    qty: item.qty, // لا داعي لتقريب الكمية لأنها عدد صحيح
  }));

  const roundedGrandTotal = Math.round(
    roundedItems.reduce((sum, i) => sum + i.qty * i.price, 0) * 100
  ) / 100;

  const roundedPaidAmount = Math.round(paidAmount * 100) / 100;

  const roundedRemainingAmount = Math.max(
    Math.round((roundedGrandTotal - roundedPaidAmount) * 100) / 100,
    0
  );

  const data: CreateExpensesInvoiceDTO | UpdateExpensesInvoiceDTO = {
    invoice_no: invoiceNo,
supplier_id: supplierId,    invoice_date: invoiceDate,
    items: roundedItems,
    grand_total: roundedGrandTotal,
    status: statusMap[status],
    paid_amount: roundedPaidAmount,
    remaining_amount: roundedRemainingAmount,
  };

  onSubmit(data);
};

   const isValid =
  invoiceNo.trim() !== "" &&
  supplierId > 0 &&
  items.length > 0 &&
  items.every((it) => it.name.trim() !== "" && it.qty > 0 && it.price > 0) &&
  paidAmount >= 0 &&
  paidAmount <= grandTotal;


  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={invoice ? "تعديل فاتورة" : "فاتورة جديدة"}
    >
      <div className="flex flex-col gap-4">
        <div dir="rtl" className="grid grid-cols-3 gap-4">
          <TextInput
            variant="filled"
            label="رقم الفاتورة"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.currentTarget.value)}
          />
          <TextInput
            variant="filled"
            label="التاريخ"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.currentTarget.value)}
          />
         <Select
           variant="filled"
           label="المورد"
           placeholder="اختر المورد"
           value={supplierId ? String(supplierId) : ""}
           onChange={(val) => setSupplierId(val ? Number(val) : 0)}
           data={suppliers.map((s) => ({ value: String(s.id), label: s.name }))}
         />
        </div>
        <Divider />
        <div dir="rtl" className="grid grid-cols-4 text-center font-bold">
          <span>اسم الصنف</span>
          <span>الكمية</span>
          <span>السعر</span>
          <span>حذف</span>
        </div>
        <Divider />
        <div dir="rtl" className="space-y-2">
          {items.map((item, i) => (
            <Group key={i} grow>
              <TextInput
                variant="filled"
                placeholder="اسم الصنف"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(i, "name", e.currentTarget.value)
                }
              />
              <NumberInput
                variant="filled"
                placeholder="الكمية"
                value={item.qty}
                min={1}
                onChange={(val) => handleItemChange(i, "qty", val)}
              />
              <NumberInput
                variant="filled"
                placeholder="السعر"
                value={item.price}
                min={0}
                onChange={(val) => handleItemChange(i, "price", val)}
              />
              <ActionIcon
                variant="subtle"
                color="red"
                disabled={items.length === 1}
                onClick={() => removeItem(i)}
              >
                <Trash2 size={18} />
              </ActionIcon>
            </Group>
          ))}
        </div>
        <Button className="my-7" variant="light" onClick={addItem}>
          إضافة صنف +
        </Button>
        <Divider />
        <div dir="rtl" className="ml-auto flex w-1/2 flex-col gap-3">
          <TextInput
            c={grandTotal > 0 ? "green" : "gray"}
            mt="md"
            variant="filled"
            label="الإجمالي"
            value={grandTotal.toLocaleString(undefined, {
              style: "currency",
              currency: "JOD",
            })}
            readOnly
          />
          <NumberInput
            variant="filled"
            label="المبلغ المدفوع"
            value={paidAmount}
            min={0}
            max={grandTotal}
            onChange={(val) => setPaidAmount(Number(val) || 0)}
          />
          <div className="flex-col-2 flex gap-2">
            <TextInput
              variant="filled"
              label="الباقي"
              value={remainingAmount.toLocaleString(undefined, {
                style: "currency",
                currency: "JOD",
              })}
              readOnly
              c={remainingAmount > 0 ? "red" : "gray"}
            />
            <TextInput
              variant="filled"
              label="الحالة"
              value={status}
              readOnly
            />
          </div>
        </div>

        <Button
          variant={invoice ? "outline" : "light"}
          color={invoice ? "orange" : "green"}
          fullWidth
          disabled={!isValid}
          onClick={handleSave}
        >
          {invoice ? "تعديل و حفظ" : "حفظ"}
        </Button>
      </div>
    </Drawer>
  );
}
