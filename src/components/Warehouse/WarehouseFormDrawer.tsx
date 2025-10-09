"use client";

import {
  Drawer,
  TextInput,
  Textarea,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Toast } from "@/lib/toast";
import {
  addWarehouseItem,
  updateWarehouseItem,
} from "@/services/warehouseServices";
import { WarehouseItem } from "@/types/warehouse";
import { getSalesItems } from "@/services/salestemServices copy";
import { SalesItem } from "@/types/salesItem";

type Props = {
  opened: boolean;
  onClose: () => void;
  item: WarehouseItem | null;
  onSuccess: () => void;
};

export function WarehouseFormDrawer({
  opened,
  onClose,
  item,
  onSuccess,
}: Props) {
  const [salesItemId, setSalesItemId] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [items, setItems] = useState<SalesItem[]>([]);
  const [name, setName] = useState(""); 
  const [quantity, setQuantity] = useState("");

  const formatDate = (dateStr: string) => dateStr?.split("T")[0] || "";

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await getSalesItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch sales items:", error);
      }
    }
    loadItems();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    if (item) {
      setSalesItemId(item.sales_item_id);
      setWeight(Number(item.weight));
      setNote(item.note || "");
      setProductionDate(formatDate(item.production_date) || today);
      setQuantity(item.quantity ? String(item.quantity) : "");
    } else {
      setSalesItemId(null);
      setWeight("");
      setNote("");
      setProductionDate(today);
      setName("");
      setQuantity("");
    }
  }, [item]);

  useEffect(() => {
    if (item && items.length > 0) {
      const selected = items.find((s) => s.id === item.sales_item_id);
      if (selected) setName(selected.name);
    }
  }, [items, item]);

  // الزر معطل إذا كان أي حقل أساسي ناقص
  const isDisabled = !salesItemId || !weight || !productionDate || !quantity;

  const handleSubmit = async () => {
    if (isDisabled) {
      Toast.error("يرجى تعبئة جميع الحقول الأساسية قبل الحفظ");
      return;
    }

    const selectedItem = items.find((s) => s.id === salesItemId);
    const itemName = selectedItem ? selectedItem.name : "";

    try {
      if (item) {
        await updateWarehouseItem(item.item_id, {
          sales_item_id: salesItemId,
          item_name: itemName,
          weight,
          note,
          production_date: productionDate,
          quantity,
        });
        Toast.success("تم تعديل المنتج بنجاح");
      } else {
        await addWarehouseItem({
          sales_item_id: salesItemId,
          item_name: itemName,
          weight,
          note,
          production_date: productionDate,
          quantity,
        });
        Toast.success("تمت إضافة المنتج بنجاح");
      }

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
      Toast.error("فشل في حفظ البيانات");
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={item ? "تعديل المنتج" : "إضافة منتج"}
      size="sm"
    >
      <div dir="rtl" className="flex flex-col gap-4">
        <Select
          variant="filled"
          searchable
          clearable
          label="الصنف"
          placeholder="ابحث عن الصنف"
          value={salesItemId ? String(salesItemId) : ""}
          onChange={(val) => {
            const selected = items.find((s) => String(s.id) === val);
            if (selected) {
              setSalesItemId(selected.id);
              setName(selected.name);
              setWeight(Number(selected.weight));
            } else {
              setSalesItemId(null);
              setName("");
              setWeight("");
            }
          }}
          data={items.map((s) => ({
            value: String(s.id),
            label: s.name,
          }))}
        />

        <TextInput
          variant="filled"
          radius="md"
          label="الوزن (كغ)"
          value={weight}
          onChange={(val) => setWeight(typeof val === "number" ? val : 0)}
          required
        />

        <TextInput
          variant="filled"
          radius="md"
          label="الكمية"
          value={quantity}
          onChange={(e) => setQuantity(e.currentTarget.value)}
          required
        />

        <TextInput
          variant="filled"
          radius="md"
          label="تاريخ الإنتاج"
          type="date"
          value={productionDate}
          onChange={(e) => setProductionDate(e.currentTarget.value)}
          required
        />

        <Textarea
          variant="filled"
          radius="md"
          label="ملاحظات"
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
        />

        <Group grow>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              color="green"
              variant="light"
              radius="md"
              onClick={handleSubmit}
              disabled={isDisabled}
            >
              {item ? "تعديل" : "إضافة"}
            </Button>
              <Button color="red" variant="light" onClick={onClose} fullWidth>
            إلغاء
          </Button>
          </div>
        </Group>
      </div>
    </Drawer>
  );
}
