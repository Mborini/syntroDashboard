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

function formatSecondsToTime(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return "00:00:00";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return (
    String(h).padStart(2, "0") +
    ":" +
    String(m).padStart(2, "0") +
    ":" +
    String(s).padStart(2, "0")
  );
}

export const exportReportPDF = async (reportId: any) => {
  try {
    const res = await fetch(`/api/PDF/${reportId}`);
    const data = await res.json();
    if (!data) throw new Error("No Data");

    const pdf = new jsPDF();
    const issueDate = new Date().toLocaleDateString("en-US");

    let y = 15;

    pdf.setFontSize(16);
    pdf.text("Vehicle Movement Report", 105, y, { align: "center" });

    y += 8;
    pdf.setFontSize(10);
    pdf.text(`Date: ${issueDate}`, 14, y);

    y += 6;
    pdf.line(10, y, 200, y);
    y += 8;

    // ✅ Layout System
    const pageWidth = pdf.internal.pageSize.getWidth();
    const leftMargin = 14;
    const gap = 6;
    const leftColWidth = 95;
    const rightColWidth = pageWidth - leftColWidth - leftMargin * 2 - gap;
    const rightStartX = leftMargin + leftColWidth + gap;

    // =======================
    // VEHICLE DATA (LEFT)
    // =======================

    pdf.setFontSize(12);
    pdf.text("Vehicle Data", leftMargin, y);

    autoTable(pdf, {
      startY: y + 3,
      margin: { left: leftMargin },
      tableWidth: leftColWidth,
      head: [["Field", "Value"]],
      body: [
        ["Plate Number", data.plateNumber],
        [
          "Area",
          data.subFleet === "منطقة طارق"
            ? "Tariq Area"
            : data.subFleet === "منطقة الجبيهة"
              ? "Jubeiha Area"
              : data.subFleet === "منطقة ابو نصير"
                ? "Abu Nseir Area"
                : data.subFleet,
        ],
        ["Shift", data.shift || "-"],
        ["Compactor Size", `${data.containerSize} TN`],
        ["Date", new Date(data.date).toLocaleDateString("en-US")],
        ["Full Work Time", formatSecondsToTime(data.fullWorkTimeSeconds)],
        ["Departure Time", data.firstTripTime || "-"],
        ["Return Time", data.lastTripTime || "-"],
        ["Total Distance", `${data.distanceKm} KM`],
        ["Total Driving Time", formatInterval(data.totalDriveTime)],
        ["Total Stop Time", formatInterval(data.totalStopTime)],
        ["Total Idle Time", formatInterval(data.totalIdleTime)],
        ["Average Speed", `${data.avgSpeed} KM/H`],
        ["Max Speed", `${data.maxSpeed} KM/H`],
        ["Total Lifts", data.totalLifts],
        ["Total Speed Alerts", data.totalAlerts],
      ],
      styles: { fontSize: 8 },
    });

    const vehicleEndY = (pdf as any).lastAutoTable.finalY;

    // =======================
    // CHECKLIST (RIGHT TOP)
    // =======================

    pdf.text("Checklist Evaluation", rightStartX, y);

    autoTable(pdf, {
      startY: y + 3,
      margin: { left: rightStartX },
      tableWidth: rightColWidth,
      head: [["Evaluation", "Value"]],
      body: [
        ["Total Trips", data.trips || "-"],
        ["Followed Route", data.followedRoute === "true" ? "Yes" : "No"],
        ["Route Compliance", data.completedRoute === "true" ? "Yes" : "No"],
        ["Deviated Route", data.hasDeviation === "true" ? "Yes" : "No"],
        ["Worked Outside Area", data.outsideArea === "true" ? "Yes" : "No"],
        ["Uncollected Bins", data.hasUncollectedBins === "true" ? "Yes" : "No"],
        ["Notes", data.notes || "-"],
      ],
      styles: { fontSize: 8 },
    });

    const checklistEndY = (pdf as any).lastAutoTable.finalY;

    // =======================
    // REASONS (RIGHT)
    // =======================

    pdf.text("Route Compliance Reasons", rightStartX, checklistEndY + 7);

    autoTable(pdf, {
      startY: checklistEndY + 10,
      margin: { left: rightStartX },
      tableWidth: rightColWidth,
      head: [["Reason Type", "Reason"]],
      body: [
        ["No Trips", data.noTripsReason || "-"],
        ["Unfollowed Route", data.unfollowedRouteReason || "-"],
        ["Uncompleted Route", data.unCompletedRouteReason || "-"],
        ["Deviation", data.deviationReason || "-"],
        ["Outside Area", data.outsideAreaReason || "-"],
        ["Location Outside Area", data.locationOutsideArea || "-"],
        ["Uncollected Bins", data.uncollectedBinsReason || "-"],
      ],
      styles: { fontSize: 8 },
    });

    const reasonsEndY = (pdf as any).lastAutoTable.finalY;
    const nextRowY = Math.max(vehicleEndY, reasonsEndY) + 10;

    // =======================
    // MAP (LEFT BOTTOM)
    // =======================

    if (data.mapImageUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = data.mapImageUrl;

      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const base64 = canvas.toDataURL("image/png");
      const ratio = img.height / img.width;
      const imgWidth = leftColWidth;

      pdf.text("Route Map", leftMargin, nextRowY);

      pdf.addImage(
        base64,
        "PNG",
        leftMargin,
        nextRowY + 3,
        imgWidth,
        imgWidth * ratio,
      );
    }

    // =======================
    // ALERTS (RIGHT BOTTOM)
    // =======================

    pdf.text("Speed Alerts", rightStartX, nextRowY);

    autoTable(pdf, {
      startY: nextRowY + 3,
      margin: { left: rightStartX },
      tableWidth: rightColWidth,
      head: [["Time", "Alert"]],
      body: (data.alerts || []).map((a: any) => [
        formatTimeOnly(a.alert_time),
        "Exceeding the street speed limit",
      ]),
      styles: { fontSize: 8 },
    });

    pdf.save(`${String(data.plateNumber)}-(${data.shift}).pdf`);
  } catch (error) {
    console.error(error);
    alert("Failed to export PDF");
  }
};
