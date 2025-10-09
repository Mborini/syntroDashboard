"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  TextInput,
  NumberInput,
  Button,
  Divider,
  Select,
} from "@mantine/core";
import { Trash2 } from "lucide-react";

import { getCustomers } from "@/services/customerServices";
import { getAvailableWarehouseItems } from "@/services/salesInvoiceServices";
import { Toast } from "@/lib/toast";
import { CreateSalesInvoiceDTO, SalesInvoice, UpdateSalesInvoiceDTO } from "@/types/salesInvoice";

type Props = {
  opened: boolean;
  onClose: () => void;
  invoice?: SalesInvoice | null;
  onSubmit: (data: CreateSalesInvoiceDTO | UpdateSalesInvoiceDTO) => void;
};

export function SalesInvoiceDrawer({
  opened,
  onClose,
  invoice,
  onSubmit,
}: Props) {
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState<
    { item_id: number; qty: number; price: number; weight?: number; unit_price?: number }[]
  >([]);
  const [customerId, setCustomerId] = useState(0);
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [status, setStatus] = useState<"ذمم" | "مدفوع جزئي" | "مدفوع">("ذمم");
  const [paidAmount, setPaidAmount] = useState(0);
  const [salesItems, setSalesItems] = useState<
    { id: number; name: string; weight: string; sale_price: number; available_quantity: number }[]
  >([]);
const grandTotal = Number(
  items.reduce((sum, i) => sum + (Number(i.unit_price || 0) * Number(i.qty || 0)), 0).toFixed(2)
);

const remainingAmount = Math.max(grandTotal - (Number(paidAmount) || 0), 0);

  // تحميل الفاتورة الحالية عند التعديل
  useEffect(() => {
    if (invoice) {
      setCustomerId(invoice.customer_id || 0);
      setInvoiceDate(invoice.invoice_date || "");
      setItems(invoice.items || []);
      setPaidAmount(invoice.paid_amount || 0);
    } else {
      setCustomerId(0);
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setItems([{ item_id: 0, qty: 1, price: 0, weight: 0, unit_price: 0 }]);
      setPaidAmount(0);
    }
  }, [invoice, opened]);

  useEffect(() => {
  async function loadItems() {
    try {
      const data = await getAvailableWarehouseItems();

   const formattedData = data.map((item: any) => ({
  id: item.id,
  name: item.name,            // استخدام الحقل الصحيح من السيرفر
  weight: item.weight ?? 0,   // الوزن أو الكمية المتاحة
  sale_price: item.sale_price ?? 0, // لتحديث السعر تلقائي
  available_quantity: item.available_quantity ?? 0, // اختيارياً للعرض أو التحقق
}));

      setSalesItems(formattedData);
      console.log("Sales items loaded:", formattedData);
    } catch (error) {
      console.error("Failed to fetch sales items:", error);
    }
  }
  loadItems();
}, []);


  useEffect(() => {
    async function getAllCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    }
    getAllCustomers();
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

  const addItem = () => setItems([...items, { item_id: 0, qty: 1, price: 0, weight: 0, unit_price: 0 }]);

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const statusMap: Record<string, number> = {
    ذمم: 1,
    "مدفوع جزئي": 2,
    مدفوع: 3,
  };

  const handleSave = () => {
    const safePaidAmount = Number(paidAmount) || 0;

   const roundedItems = items.map((item) => ({
  ...item,
  qty: Number(item.qty),
  unit_price: Number(item.unit_price ?? 0),
  price: Number(item.unit_price ?? 0) * Number(item.qty ?? 0),
}));

const roundedGrandTotal = Number(
  roundedItems.reduce((sum, i) => sum + i.price, 0).toFixed(2)
);

const roundedPaidAmount = Number((Number(paidAmount) || 0).toFixed(2));
const roundedRemainingAmount = Number(
  Math.max(roundedGrandTotal - roundedPaidAmount, 0).toFixed(2)
);

const data: CreateSalesInvoiceDTO | UpdateSalesInvoiceDTO = {
  customer_id: customerId,
  invoice_date: invoiceDate,
  items: roundedItems,
  grand_total: roundedGrandTotal,
  status: statusMap[status],
  paid_amount: roundedPaidAmount,
  remaining_amount: roundedRemainingAmount,
};


    onSubmit(data);
  };

  const isValid =
    customerId > 0 &&
    items.length > 0 &&
    items.every((it) => it.item_id > 0 && it.qty > 0 && it.price > 0) &&
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
        {/* معلومات الفاتورة */}
        <div dir="rtl" className="grid grid-cols-2 gap-4">
         
          <TextInput
            variant="filled"
            label="التاريخ"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.currentTarget.value)}
          />
          <Select
            variant="filled"
            searchable
            clearable
            label="الزبون"
            placeholder="ابحث عن الزبون"
            value={customerId ? String(customerId) : ""}
            onChange={(val) => setCustomerId(val ? Number(val) : 0)}
            data={customers.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
          />
        </div>

        <Divider />
        <div dir="rtl" className="grid grid-cols-7 gap-1 text-center font-bold">
          <span className="col-span-2">الصنف</span>
          <span>الوزن (ك)</span>
          <span>الكمية</span>
          <span>السعر الفردي</span>
          <span>الإجمالي الفردي</span>
          <span>حذف</span>
        </div>

        <Divider />
        <div dir="rtl" className="space-y-2">
{items.map((item, i) => (
  <div key={i} className="grid grid-cols-7 items-center gap-2">
    {/* 🟢 اختيار الصنف */}
<Select
  dir="rtl"
  className="col-span-2"
  variant="filled"
  placeholder="اسم الصنف"
  data={salesItems
    .filter((p) => !items.some((it, idx) => it.item_id === p.id && idx !== i))
    .map((p) => ({
      value: String(p.id),
      label: `${p.name}`,
    }))
  }
  value={item.item_id ? String(item.item_id) : ""}
  onChange={(val) => {
   const selectedItem = salesItems.find((p) => p.id === Number(val));
if (selectedItem) {
  handleItemChange(i, "item_id", selectedItem.id);
  handleItemChange(i, "weight", selectedItem.weight ?? 0);
  handleItemChange(i, "unit_price", selectedItem.sale_price ?? 0); // السعر الفردي
  handleItemChange(i, "price", (selectedItem.sale_price ?? 0) * (item.qty ?? 1)); // الإجمالي الفردي
} else {
  handleItemChange(i, "item_id", 0);
  handleItemChange(i, "weight", 0);
  handleItemChange(i, "unit_price", 0);
  handleItemChange(i, "price", 0);
}

  }}
  searchable
  clearable
/>


    {/* ⚖️ الوزن (ReadOnly) */}
    <NumberInput
      variant="filled"
      placeholder="الوزن"
      value={item.weight ?? 0}
      readOnly
    />

  <NumberInput
  variant="filled"
  placeholder="الكمية"
  value={item.qty}
  min={1}
max={salesItems.find((p) => p.id === item.item_id)?.available_quantity || 1}
  onChange={(val) => {
    const maxQty = salesItems.find((p) => p.id === item.item_id)?.available_quantity || 1;

    // إذا حاول المستخدم تجاوز الحد
   if ((Number(val) || 0) > maxQty) {
  Toast.error(`الكمية المتوفرة بمستودع الانتاج هي: ${maxQty}`);
}


const qty = Math.min(Number(val) || 1, maxQty);

handleItemChange(i, "qty", qty);

const selectedItem = salesItems.find((p) => p.id === item.item_id);
if (selectedItem) {
  handleItemChange(i, "unit_price", selectedItem.sale_price ?? 0); 
  handleItemChange(i, "price", (selectedItem.sale_price ?? 0) * qty); // ⚡ هنا نستخدم qty الجديدة
}

  }
} 
  
/>



   <NumberInput
    variant="filled"
    placeholder="السعر الفردي"
    value={item.unit_price}
    readOnly
  />
  <NumberInput
    variant="filled"
    placeholder="الإجمالي الفردي"
    value={item.price}
    readOnly
  />

    {/* 🔴 زر الحذف */}
    <Button
      variant="light"
      color="red"
      disabled={items.length === 1}
      onClick={() => removeItem(i)}
    >
      <Trash2 size={18} />
    </Button>
  </div>
))}



        </div>

        <Button className="my-7" variant="light" onClick={addItem}>
          إضافة صنف +
        </Button>

        <Divider />

        {/* الإجماليات */}
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
          <div className="flex gap-2">
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
