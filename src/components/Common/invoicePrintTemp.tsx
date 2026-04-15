import { SalesInvoice } from "@/types/salesInvoice";

export default function handlePrintInvoice(inv: SalesInvoice) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  // أنشئ محتوى HTML للفاتورة
  printWindow.document.write(`
    <html dir="rtl">
      <head>
        <title>فاتورة رقم #${inv.invoice_no}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: center; }
          th { background-color: #f0f0f0; }
          h2, h3, p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h2>فاتورة رقم #${inv.invoice_no}</h2>
        <p><strong>الزبون:</strong> ${inv.customer_name}</p>
        <p><strong>التاريخ:</strong> ${new Date(inv.invoice_date).toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>الوزن</th>
              <th>السعر الافرادي</th>
              <th>المجموع الاجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items
              .map(
                (item : any) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.weight}</td>
                <td>${item.unit_price}</td>
                <td>${Number(item.price).toLocaleString(undefined, { style: 'currency', currency: 'JOD' })}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h3>الإجمالي الكلي: ${inv.grand_total.toLocaleString(undefined, { style: 'currency', currency: 'JOD' })}</h3>
        <h3>المدفوع: ${inv.paid_amount.toLocaleString(undefined, { style: 'currency', currency: 'JOD' })}</h3>
        <h3>الباقي: ${inv.remaining_amount.toLocaleString(undefined, { style: 'currency', currency: 'JOD' })}</h3>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};