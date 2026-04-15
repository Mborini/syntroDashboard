export async function getInventoryWithdrawItems() {
  const res = await fetch("/api/inventory/withdrawals");
  if (!res.ok) throw new Error("فشل تحميل بيانات السحوبات");
  return res.json();
}
//undo
//  const handleUndo = async (id: number) => {
//     if (!confirm("هل أنت متأكد من التراجع عن هذه العملية؟")) return;
//     try {
//       const res = await fetch(`/api/inventory/withdrawals/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("فشل التراجع عن السحب");
//       Toast.success("تم التراجع عن السحب بنجاح");
//       await loadWithdrawals();
//     } catch (err) {
//       console.error(err);
//       Toast.error("حدث خطأ أثناء التراجع عن السحب");
//     }
//   };
export async function undoInventoryWithdraw(id: number) {
  const res = await fetch(`/api/inventory/withdrawals/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("فشل التراجع عن السحب");
  return res.json();
}