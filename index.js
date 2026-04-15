const axios = require("axios");
const polyline = require("@mapbox/polyline");

async function fetchData() {
  const cookie = process.env.TrACKING_CoOKIES;
  try {
    const response = await axios.get(
      "https://gamtracking.amman.jo/Tracking/WasteMangement/Endpoints/ManageGarbageTrucksLive.ashx",
      {
        params: {
          from: "2026-04-09 08:32",
          to: "2026-04-09 23:59",
          SelectedVehicles: "2926",
          IsTrucks: "false",
        },
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "X-Requested-With": "XMLHttpRequest",
          Referer:
            "https://gamtracking.amman.jo/Tracking/WasteMangement/MonitorBinsLiftPlaces/MonitorBinsLiftPlaces.aspx",
           Cookie: cookie,
          },
    });

    const data = response.data;

    // ✅ polyline
    const encodedPolyline = data.VehiclePolylines?.[0]?.Polyline;

    // ✅ count lift
    const totalLiftCount = data.TotalLiftCount;

    // 🔥 فك polyline (اختياري)
    let decodedCoordinates = [];
    if (encodedPolyline) {
      decodedCoordinates = polyline.decode(encodedPolyline, 5).map(
        ([lat, lng]) => ({ lat, lng })
      );
    }

    // ✅ النتيجة النهائية
    const result = {
      polyline: encodedPolyline,
      totalLiftCount,
      coordinates: decodedCoordinates, // اختياري
    };

    console.log("✅ Final Result:");
    console.log(result);

    return result;
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

fetchData();