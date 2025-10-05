// عنصر واحد داخل الفاتورة
export type InvoiceItem = {
  id?: number;        // رقم داخلي (اختياري)
  item_id: number;    // معرف الصنف فقط
  qty: number;        // الكمية
  price: number;      // السعر للوحدة
  name?: string; // اسم الصنف (اختياري للعرض فقط)
};

// إنشاء فاتورة جديدة
export type CreatePurchaseInvoiceDTO = {
  invoice_no: string;          
  supplier_id?: number;        
  supplier?: string;           
  invoice_date?: string;       
  items: InvoiceItem[];        // الأصناف
  currency?: string;           
  status: number;              // 1 = ذمم، 2 = مدفوع جزئي، 3 = مدفوع
  grand_total: number;         
  paid_amount: number;         
  remaining_amount: number;    
};

// تحديث فاتورة (كل القيم اختيارية)
export type UpdatePurchaseInvoiceDTO = Partial<CreatePurchaseInvoiceDTO>;

// الفاتورة كاملة من قاعدة البيانات
export type PurchaseInvoice = {
  id: number;                  
  invoice_no: string;          
  supplier_id?: number;
  supplier?: string;
  invoice_date: string;
  items: InvoiceItem[];        // الأصناف تحتوي فقط على item_id
  currency?: string;
  status: number;              
  grand_total: number;
  paid_amount: number;
  remaining_amount: number;
  created_at?: string;         
  updated_at?: string;         
};
