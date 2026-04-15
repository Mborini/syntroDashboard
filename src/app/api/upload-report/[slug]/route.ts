import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  let client;
  try {
    const { slug } = await params;
    const [plate, dateStr] = decodeURIComponent(slug).split('_');

    client = await pool.connect();

    // 1. استخراج التاريخ وتحضير احتمالات (اليوم نفسه، اليوم التالي، اليوم السابق)
    // هذا يحل مشكلة فرق التوقيت (Timezone) التي قد تزيد أو تنقص يوماً
    const dateObj = new Date(dateStr);
    const nextDay = new Date(dateObj);
    nextDay.setDate(dateObj.getDate() + 1);
    const prevDay = new Date(dateObj);
    prevDay.setDate(dateObj.getDate() - 1);

    const possibleDates = [
      dateStr,
      nextDay.toISOString().split('T')[0],
      prevDay.toISOString().split('T')[0]
    ];

    // 2. الحذف المرن
    // سيقوم بحذف التقرير إذا طابق اللوحة وأي من التواريخ الثلاثة القريبة
    const deleteQuery = `
      DELETE FROM vehicle_daily_summaries 
      WHERE vehicle_id = (SELECT id FROM vehicles WHERE plate = $1)
      AND (
        TO_CHAR(report_date, 'YYYY-MM-DD') = ANY($2)
        OR report_date_uts = ANY($3)
      )
    `;

    // تحويل التواريخ لـ UTS أيضاً لزيادة دقة المطابقة
    const possibleUts = possibleDates.map(d => Math.floor(new Date(d).getTime() / 1000));

    const result = await client.query(deleteQuery, [plate, possibleDates, possibleUts]);

    if (result.rowCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'لم يتم العثور على التقرير. تأكد من رقم اللوحة أو التاريخ.' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `تم حذف التقرير بنجاح (rowCount: ${result.rowCount})` 
    });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}