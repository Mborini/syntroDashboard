// الفاتورة الرئيسية
export interface SalesInvoice {
  id: number;
  invoice_no: number;
  customer_id: number;
    customer_name?: string; // اسم الزبون للعرض فقط
  invoice_date: string; // YYYY-MM-DD
  items: SalesInvoiceItem[];
  grand_total: number;
  paid_amount: number;
  remaining_amount: number;
  status: number; // 1: ذمم, 2: مدفوع جزئي, 3: مدفوع
  created_at?: string;
  updated_at?: string;
  item_name?: string; // اسم الصنف للعرض فقط
}


// كل صنف داخل الفاتورة
export interface SalesInvoiceItem {
  id?: number; // موجود عند التحديث فقط
  item_name?: string; // اسم الصنف للعرض فقط
  name?: string; // اسم الصنف للعرض فقط
  invoice_id?: number; // موجود عند التحديث فقط
  item_id: number;
  qty: number;
  customer_name?: string; // اسم الزبون للعرض فقط
  unit_price: number;
  price: number; // qty * unit_price
  weight?: number;
}

// DTO لإنشاء فاتورة جديدة
export interface CreateSalesInvoiceDTO {
  customer_id: number;
  invoice_date: string;
  items: {
    item_id: number;
    qty: number;
    unit_price: number;
    price: number;
    weight?: number;
  }[];
  grand_total: number;
  paid_amount: number;
  remaining_amount: number;
  status: number;
}

// DTO لتحديث فاتورة موجودة
export interface UpdateSalesInvoiceDTO extends CreateSalesInvoiceDTO {
  id: number; // رقم الفاتورة المراد تعديلها
}
