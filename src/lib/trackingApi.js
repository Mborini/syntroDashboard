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
          Cookie:"ADC_CONN_539B3595F4E=D5F1836B52B7EE7D06D94FC513CA160FB292F31489D0F3CB174790409212C0509D993AB4948A312A; ASP.NET_SessionId=ngawyjutn4g2fvqnkzyvsbf4; ADC_REQ_2E94AF76E7=6156A76D3DAAB4D80C9E9EDDD64C513F4F3B8C284403BE07F0D33F0C523FE26FC2CA4792F0B6C428"
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