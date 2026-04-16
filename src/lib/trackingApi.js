import axios from "axios";

async function fetchTrackingFromGAM(tsId, from, to, sessionValue) {
  console.log("COOKIE =>", sessionValue);
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
          Cookie:"ADC_CONN_539B3595F4E=0C40833B5D48284DC01878A2D9ABE533BA5557F7BAD7D889C8E707C5E0F72ACD938329AF65EA0243; ASP.NET_SessionId=zf2hoopwuwdfg4pvurt0sfy4; ADC_REQ_2E94AF76E7=957836A16F5572E82EBDF1D3BE437E120FA36CDF19EFD82E098245DABAB9513B6D68778A3DC8E4B1"        },
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