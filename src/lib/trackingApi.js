import axios from "axios";

async function fetchTrackingFromGAM(tsId, from, to, sessionValue) {
  try {
    const response = await axios.get(
      "https://gamtracking.amman.jo/Tracking/WasteMangement/Endpoints/ManageGarbageTrucksLive.ashx",
      {
        params: {
          from,
          to,
          SelectedVehicles: tsId,
          IsTrucks: "false",
        },
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "X-Requested-With": "XMLHttpRequest",
          Referer:
            "https://gamtracking.amman.jo/Tracking/WasteMangement/MonitorBinsLiftPlaces/MonitorBinsLiftPlaces.aspx",
          Cookie: sessionValue || "",
        },
      }
    );

    const data = response.data; // ✅ مهم جداً

    const encodedPolyline = data.VehiclePolylines?.[0]?.Polyline;
    const totalLiftCount = data.TotalLiftCount;
    const VisitedVehicles = data.VisitedVehicles || [];

    return {
      polyline: encodedPolyline,
      totalLiftCount,
      visitedpoints: VisitedVehicles,
    };
  } catch (err) {
    console.error("❌ GAM ERROR:", err?.response?.status, err?.message);

    return {
      error: true,
      status: err?.response?.status || 500,
      polyline: null,
      totalLiftCount: 0,
      visitedpoints: [],
    };
  }
}
export { fetchTrackingFromGAM };