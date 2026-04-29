import axios from "axios";

async function fetchTrackingFromGAM(tsId, from, to, sessionValue) {
  console.log("🚀 GAM REQUEST START");
  console.log("📦 Params:", { tsId, from, to });
  console.log("🍪 Session exists:", !!sessionValue);
  console.log("🍪 Session preview:", sessionValue?.slice(0, 50));

  const startTime = Date.now();

  try {
    const response = await axios.get(
      "https://gamtracking.amman.jo/Tracking/WasteMangement/Endpoints/ManageGarbageTrucksLive.ashx",
      {
        timeout: 30000,
        params: {
          from,
          to,
          SelectedVehicles: tsId,
          IsTrucks: "false",
        },
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          Referer:
            "https://gamtracking.amman.jo/Tracking/WasteMangement/MonitorBinsLiftPlaces/MonitorBinsLiftPlaces.aspx",
          ...(sessionValue ? { Cookie: sessionValue } : {}),
        },
      }
    );

    const duration = Date.now() - startTime;

    console.log("✅ GAM SUCCESS");
    console.log("⏱ Duration:", duration + "ms");
    console.log("📊 Response keys:", Object.keys(response.data || {}));

    return {
      polyline: response.data?.VehiclePolylines?.[0]?.Polyline,
      totalLiftCount: response.data?.TotalLiftCount,
      visitedpoints: response.data?.VisitedVehicles || [],
    };

  } catch (err) {
    const duration = Date.now() - startTime;

    console.log("❌ GAM ERROR");
    console.log("⏱ Duration:", duration + "ms");
    console.log("🔴 Status:", err?.response?.status);
    console.log("📄 Message:", err?.message);
    console.log("📦 Data:", err?.response?.data);

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