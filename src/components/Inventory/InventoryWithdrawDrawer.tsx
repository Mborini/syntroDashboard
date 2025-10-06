"use client";

import { useState } from "react";
import { Drawer, NumberInput, Textarea, Button } from "@mantine/core";
import { Toast } from "@/lib/toast";
import { withdrawFromInventory } from "@/services/inventoryServices";

type Props = {
  opened: boolean;
  onClose: () => void;
  item: { item_id: number; name: string } | null;
  onSuccess: () => void;
};

export function InventoryWithdrawDrawer({ opened, onClose, item, onSuccess }: Props) {
  const [quantity, setQuantity] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const handleWithdraw = async () => {
    if (!item) return;
    if (quantity <= 0) return Toast.error("يرجى إدخال كمية صحيحة");

    try {
      await withdrawFromInventory({
        item_id: item.item_id,
        quantity,
        notes,
      });
      Toast.success("تم السحب من المستودع بنجاح");
      setQuantity(0);
      setNotes("");
      onClose();
      onSuccess(); // لإعادة تحميل البيانات
    } catch (error) {
      console.error(error);
      Toast.error("فشل السحب من المستودع");
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} position="right" title="سحب من المستودع" size="sm">
      <div dir="rtl" className="flex flex-col gap-4">
        <p>الصنف: <strong>{item?.name}</strong></p>

        <NumberInput
          label="الكمية المسحوبة"
          min={1}
          value={quantity}
          onChange={(val) => setQuantity(Number(val))}
        />

        <Textarea
          label="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />

        <Button color="orange" onClick={handleWithdraw} fullWidth>
          سحب
        </Button>
      </div>
    </Drawer>
  );
}
