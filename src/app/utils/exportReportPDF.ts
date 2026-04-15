import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatInterval = (time: any) => {
  if (!time) return "00:00:00";

  if (typeof time === "object") {
    const h = String(time.hours ?? 0).padStart(2, "0");
    const m = String(time.minutes ?? 0).padStart(2, "0");
    const s = String(time.seconds ?? 0).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  return String(time);
};

const formatTimeOnly = (date: any) => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const exportReportPDF = async (reportId: any) => {
  try {
    const res = await fetch(`/api/PDF/${reportId}`);
    const data = await res.json();

    if (!data) throw new Error("No data found");

    const pdf = new jsPDF();

    const issueDate = new Date().toLocaleDateString("en-US");
    const issueTime = new Date().toLocaleTimeString("en-US");

    let y = 15;

    // =========================
    // TITLE
    // =========================
    pdf.setFontSize(16);
    pdf.text("Vehicle Movement Report", 105, y, { align: "center" });

    y += 8;
    pdf.setFontSize(10);
    pdf.text(`Date: ${issueDate}`, 14, y);

    y += 6;
    pdf.line(10, y, 200, y);
    y += 10;

    // =========================
    // TABLE 1 - VEHICLE DATA
    // =========================
    pdf.setFontSize(12);
    pdf.text("Vehicle Data", 14, y);
    y += 4;

    autoTable(pdf, {
      startY: y,
      head: [["Field", "Value"]],
      body: [
        ["Plate Number", data.plateNumber],
        ["Aria", data.subFleet === "منطقة طارق" ? "Tariq Aria" : "-"],
        ["Shift", data.shift || "-"],
        ["Container Size", `${data.containerSize} TN`],
        ["Date", new Date(data.date).toLocaleDateString("en-US")],
        ["Distance", `${data.distanceKm} KM`],
        ["Driving Time", formatInterval(data.totalDriveTime)],
        ["Stop Time", formatInterval(data.totalStopTime)],
        ["Idle Time", formatInterval(data.totalIdleTime)],
        ["Average Speed", `${data.avgSpeed} KM/H`],
        ["Max Speed", `${data.maxSpeed} KM/H`],
        ["Total Loads", data.totalLifts],
        ["Total Speed Alerts", data.totalAlerts],
      ],
      theme: "striped",
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [49, 75, 143], // لون الخلفية (RGB)
        textColor: 255, // لون النص أبيض
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 }, // العمود الأول ثابت
        1: { cellWidth: 110 }, // العمود الثاني ثابت ومتوحد بكل الجداول
      },
    });

    y = (pdf as any).lastAutoTable.finalY + 10;

    // =========================
    // TABLE 2 - CHECKLIST
    // =========================
    pdf.setFontSize(12);
    pdf.text("Checklist Evaluation", 14, y);
    y += 4;

    autoTable(pdf, {
      startY: y,
      head: [["Evaluation", "Value"]],
      body: [
        ["Trips Count", data.trips || "-"],
        ["Followed Route", data.followedRoute === "true" ? "Yes" : "No"],
        ["Route Compliance", data.completedRoute === "true" ? "Yes" : "No"],
        ["Deviated Route", data.hasDeviation === "true" ? "Yes" : "No"],
        ["Worked Outside Area", data.outsideArea === "true" ? "Yes" : "No"],
        ["Uncollected Bins", data.hasUncollectedBins === "true" ? "Yes" : "No"],
        ["Notes", data.notes || "-"],
      ],
      theme: "striped",
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [232, 203, 56], // لون الخلفية (RGB)
        textColor: 255, // لون النص أبيض
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 }, // العمود الأول ثابت
        1: { cellWidth: 110 }, // العمود الثاني ثابت ومتوحد بكل الجداول
      },
    });
    //go to the next page

    pdf.addPage();
    y = 15; // 👈 مهم جداً إعادة ضبط البداية

    // =========================
    // TABLE 3 - REASONS
    // =========================
    pdf.setFontSize(12);
    pdf.text("Route Compliance Reasons", 14, y);
    y += 4;

    autoTable(pdf, {
      startY: y,
      head: [["Reason Type", "Reason"]],
      body: [
        ["No Trips Reason", data.noTripsReason || "-"],
        ["Unfollowed Route Reason", data.unfollowedRouteReason || "-"],
        ["Uncompleted Route Reason", data.unCompletedRouteReason || "-"],
        ["Deviation Reason", data.deviationReason || "-"],
        ["Outside Area Reason", data.outsideAreaReason || "-"],
        ["Location Outside Area", data.locationOutsideArea || "-"],
        ["Uncollected Bins Reason", data.uncollectedBinsReason || "-"],
      ],
      theme: "striped",
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [58, 158, 47], // لون الخلفية (RGB)
        textColor: 255, // لون النص أبيض
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 }, // العمود الأول ثابت
        1: { cellWidth: 110 }, // العمود الثاني ثابت ومتوحد بكل الجداول
      },
    });

    y = (pdf as any).lastAutoTable.finalY + 12;

    // =========================
    // TABLE 4 - ALERTS
    // =========================
    pdf.setFontSize(12);
    pdf.text("Speed Alerts", 14, y);
    y += 4;

    autoTable(pdf, {
      startY: y,
      head: [["Time", "Speed"]],
      body: (data.alerts || []).map((a: any) => [
        formatTimeOnly(a.alert_time),
        "Exceeding the street speed limit",
      ]),
      theme: "striped",
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [232, 90, 74], // لون الخلفية (RGB)
        textColor: 255, // لون النص أبيض
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 }, // العمود الأول ثابت
        1: { cellWidth: 110 }, // العمود الثاني ثابت ومتوحد بكل الجداول
      },
    });

    pdf.save(`${String(data.plateNumber)}-(${data.shift}).pdf`);
  } catch (error) {
    console.error("PDF ERROR:", error);
    alert("Failed to export PDF");
  }
};
