// trackingApi.js
const axios = require("axios");
const polyline = require("@mapbox/polyline");

async function fetchTrackingFromGAM(tsId, from, to) {
  const cookie = process.env.TrACKING_CoOKIES;
  try {
    const response = await axios.get(
      "https://gamtracking.amman.jo/Tracking/WasteMangement/Endpoints/ManageGarbageTrucksLive.ashx",
      {
        params: {
          from: from,
          to: to,
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
          Cookie:cookie,
        },
      }
    );
    
    // ✅ polyline
    const encodedPolyline = data.VehiclePolylines?.[0]?.Polyline;

    // ✅ count lift
    const totalLiftCount = data.TotalLiftCount;
    // ✅ visited points
    const VisitedVehicles = data.VisitedVehicles || [];

    // ✅ النتيجة النهائية
    const result = {
      polyline: encodedPolyline,
      totalLiftCount,
      visitedpoints: VisitedVehicles,
    };

    return result;
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return { polyline: null, totalLiftCount: 0, coordinates: [] };
  }
}

module.exports = { fetchTrackingFromGAM };
