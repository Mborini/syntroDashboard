// عنصر واحد داخل الفاتورة
export type InvoiceItem = {
  id?: number;       // اختياري (لو بتخزن بالـ DB)
  name: string;      // اسم الصنف
  qty: number;       // الكمية
  price: number;     // السعر للوحدة
};

// إنشاء فاتورة جديدة
export type CreateExpensesInvoiceDTO = {
  invoice_no: string;       // رقم الفاتورة
  supplier_id?: number;     // معرف المورد (اختياري لو عندك جدول موردين)
  supplier?: string;   // اسم المورد (لو ما عندك جدول منفصل)
  invoice_date?: string;    // تاريخ الفاتورة
  items: InvoiceItem[];     // العناصر
  currency?: string;        // العملة (USD, JOD, ...)
status?: number; // بدل "Draft" | "Posted"
  grand_total?: number;
  paid_amount?: number;     // المبلغ المدفوع
  remaining_amount?: number; // المبلغ المتبقي
};

// تحديث فاتورة (كل شيء اختياري لأنه تحديث جزئي)
export type UpdateExpensesInvoiceDTO = Partial<CreateExpensesInvoiceDTO>;

// الفاتورة كاملة زي ما بترجع من الـ API أو DB
export type ExpensesInvoice = {
  remaining_amount: number;
  paid_amount: number;
  id: number;                // رقم داخلي من قاعدة البيانات
  invoice_no: string;
  supplier_id?: number;
  supplier?: string;
  invoice_date: string;
  items: InvoiceItem[];
  currency?: string;
  grand_total: number;       // المجموع الكلي محسوب = sum(items.qty * items.price)
status?: number; // بدل "Draft" | "Posted"
  created_at?: string;       // وقت الإنشاء
  updated_at?: string;       // وقت آخر تعديل
};
