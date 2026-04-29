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
          Cookie:
"ADC_CONN_539B3595F4E=1AD7C076310F260C57E6E839FECA86FA5810B8619C3EFCC6373AA5E9192961F1B4093D77E647F07D; ASP.NET_SessionId=5jzrnxqvw4nzb1fpjfwgtmuw; ADC_REQ_2E94AF76E7=BC7113FF03127CA92ABE9A44FEED968CF80339084A1A10DB75457DF46FE886D54DA6DEDABF22678C"
        },
      },
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
