"use client";

import { Modal, Checkbox, Stack, Button, Grid, Accordion } from "@mantine/core";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import polyline from "@mapbox/polyline";
import "mapbox-gl/dist/mapbox-gl.css";
import { getBinsLocationsByPlate } from "@/services/binsLocationServices";
import ReportChecklist from "@/components/ReportChecklist/ReportChecklist";
import MapScreenshotButton from "./MapScreenshotButton";

type Props = {
  opened: boolean;
  onClose: () => void;
  encodedPolyline: string;
  visitedPoints: any[];
  plateNumber: string;
  selectedReport?: any;
  onChecklistChange?: (data: any, valid: boolean) => void;
  onSaved?: () => void;
};

const PolylineMapModal = forwardRef(function PolylineMapModal(
  {
    opened,
    onClose,
    onSaved,
    encodedPolyline,
    visitedPoints,
    plateNumber,
    selectedReport,
    onChecklistChange,
  }: Props,
  ref,
) {
  const initializedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const mapboxRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [checklistData, setChecklistData] = useState<any>(null);
  const [isChecklistValid, setIsChecklistValid] = useState(false);
  // ✅ فصل التحكم
  const [selectedRouteRegions, setSelectedRouteRegions] = useState<number[]>(
    [],
  );
  const [selectedBinRegions, setSelectedBinRegions] = useState<number[]>([]);
  const apiRef = useRef<any>(null);
  const [showVisited, setShowVisited] = useState(true);

  const visitedMarkersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  // Expose getMap method to parent component
  useImperativeHandle(ref, () => apiRef.current);

  useEffect(() => {
    apiRef.current = {
      getMapImage: () => {
        if (!mapReady || !mapRef.current) return null;

        mapRef.current.triggerRepaint(); // ✅ تأكد الإطار مرسوم
        return mapRef.current.getCanvas().toDataURL("image/png");
      },
    };
  }, [mapReady]);
  ``;
  // -----------------------------
  // RESET عند تغيير المركبة
  // -----------------------------
  useEffect(() => {
    setLayers([]);
    setSelectedRouteRegions([]);
    setSelectedBinRegions([]);
    initializedLayersRef.current = false;
  }, [plateNumber]);

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  useEffect(() => {
    if (!plateNumber) return;

    async function loadLayers() {
      try {
        const data = await getBinsLocationsByPlate(plateNumber);
        setLayers(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadLayers();
  }, [plateNumber]);

  // -----------------------------
  // AUTO SELECT
  // -----------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapboxRef.current) return;

    renderVisitedPoints(mapRef.current);
  }, [visitedPoints]);
  const initializedLayersRef = useRef(false);

  useEffect(() => {
    if (!layers.length) return;
    if (initializedLayersRef.current) return;

    setSelectedRouteRegions(layers.map((l) => l.id));
    setSelectedBinRegions(layers.map((l) => l.id));

    initializedLayersRef.current = true;
  }, [layers]);
  const getMostVisitedBounds = (mapboxgl: any) => {
    const precision = 50; // مستوى التجميع (≈ 10–15 متر)

    const buckets = new Map<
      string,
      { count: number; points: [number, number][] }
    >();

    visitedPoints.forEach((p: any) => {
      if (
        p?.Longitude == null ||
        p?.Latitude == null ||
        isNaN(Number(p.Longitude)) ||
        isNaN(Number(p.Latitude))
      )
        return;

      const lng = Number(p.Longitude);
      const lat = Number(p.Latitude);

      const key = `${lng.toFixed(precision)},${lat.toFixed(precision)}`;

      if (!buckets.has(key)) {
        buckets.set(key, { count: 0, points: [] });
      }

      buckets.get(key)!.count++;
      buckets.get(key)!.points.push([lng, lat]);
    });

    if (!buckets.size) return null;

    // ✅ أكثر مكان تكراراً
    const hotSpot = [...buckets.values()].sort((a, b) => b.count - a.count)[0];

    const mapBounds = hotSpot.points.reduce(
      (b: any, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(hotSpot.points[0], hotSpot.points[0]),
    );

    return mapBounds;
  };
  // -----------------------------
  // INIT MAP
  // -----------------------------
  useEffect(() => {
    if (!opened || initializedRef.current) return;

    initializedRef.current = true;

    const timer = setTimeout(async () => {
      if (!containerRef.current || !encodedPolyline) return;

      const mapboxgl = (await import("mapbox-gl")).default;

      // ✅ حل مشكلة انعكاس اللغة العربية داخل Mapbox
      if (!(mapboxgl as any)._rtlTextPluginInitialized) {
        mapboxgl.setRTLTextPlugin(
          "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
          null,
          true,
        );
        (mapboxgl as any)._rtlTextPluginInitialized = true;
      }

      mapboxRef.current = mapboxgl;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

      const decoded = polyline
        .decode(encodedPolyline)
        .map(([lat, lng]) => [lng, lat] as [number, number]);

      if (!decoded.length) return;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: decoded[0],
        zoom: 12,
        preserveDrawingBuffer: true, // ✅ مهم جداً
      });

      mapRef.current = map;

      map.on("load", () => {
        // MAIN ROUTE
        map.addSource("main-route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: decoded,
            },
          },
        });

        map.addLayer({
          id: "main-route",
          type: "line",
          source: "main-route",
          paint: {
            "line-color": "#52C932",
            "line-width": 3,
          },
        });

        // FIT
        const bounds = decoded.reduce(
          (b: any, coord: any) => b.extend(coord),
          new mapboxgl.LngLatBounds(decoded[0], decoded[0]),
        );

        // ✅ FIT BASED ON VISITED POINTS (DEFAULT)
        // ✅ DEFAULT FOCUS: MOST VISITED AREA (HOTSPOT)
        const hotSpotBounds = getMostVisitedBounds(mapboxgl);

        if (hotSpotBounds) {
          map.fitBounds(hotSpotBounds, {
            padding: 100,
            maxZoom: 14,
            duration: 800,
          });
        } else {
          // fallback → المسار الكامل
          map.fitBounds(bounds, { padding: 50 });
        }

        // START / END
        new mapboxgl.Marker({ color: "green" })
          .setLngLat(decoded[0])
          .addTo(map);

        const lastPoint = decoded[decoded.length - 1] as [number, number];

        new mapboxgl.Marker({ color: "red" }).setLngLat(lastPoint).addTo(map);

        renderVisitedPoints(map);
        setMapReady(true);
      });
    }, 200);

    return () => {
      clearTimeout(timer);

      initializedRef.current = false;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [opened, encodedPolyline]);

  // -----------------------------
  // VISITED POINTS
  // -----------------------------
  const renderVisitedPoints = (map: any) => {
    const mapboxgl = mapboxRef.current;
    if (!mapboxgl || !map) return;

    visitedMarkersRef.current.forEach((m) => m.remove());
    visitedMarkersRef.current = [];

    visitedPoints.forEach((p: any, index: number) => {
      if (p?.Longitude == null || p?.Latitude == null) return;

      const lng = Number(p.Longitude);
      const lat = Number(p.Latitude);
      if (isNaN(lng) || isNaN(lat)) return;

      const el = document.createElement("div");
      el.style.cssText = `
        width:22px;height:22px;border-radius:50%;
        background:white;border:2px solid #1c7ed6;
        display:flex;align-items:center;justify-content:center;
        font-size:11px;font-weight:bold;color:#1c7ed6;
      `;
      el.innerText = String(index + 1);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      visitedMarkersRef.current.push(marker);

      if (!showVisited) el.style.display = "none";
    });
  };

  useEffect(() => {
    visitedMarkersRef.current.forEach((marker) => {
      const el = marker.getElement();
      if (el) el.style.display = showVisited ? "flex" : "none";
    });
  }, [showVisited]);
  useEffect(() => {
    if (!opened) {
      setChecklistData(null);
      setIsChecklistValid(false);
    }
  }, [opened]);
  // -----------------------------
  // DRAW ROUTES & BINS
  // -----------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !mapRef.current) return;
    if (!layers.length) return;

    // ROUTES
    selectedRouteRegions.forEach((id) => {
      const region = layers.find((l) => l.id === id);
      if (!region) return;

      const routeId = `route-${id}`;

      if (!map.getSource(routeId)) {
        map.addSource(routeId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: region.route_geojson,
            },
          },
        });

        map.addLayer({
          id: routeId,
          type: "line",
          source: routeId,
          paint: {
            "line-color": "#ff6b6b",
            "line-width": 3,
          },
        });
      }
    });

    // BINS
    selectedBinRegions.forEach((id) => {
      const region = layers.find((l) => l.id === id);
      if (!region) return;

      const binsId = `bins-${id}`;

      if (!map.getSource(binsId)) {
        map.addSource(binsId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: region.bins_geojson.map((b: any) => ({
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [b[0], b[1]],
              },
            })),
          },
        });

        map.addLayer({
          id: binsId,
          type: "circle",
          source: binsId,
          paint: {
            "circle-radius": 5,
            "circle-color": "#1c7ed6",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });
      }
    });

    // REMOVE
    layers.forEach((layer: any) => {
      const routeId = `route-${layer.id}`;
      const binsId = `bins-${layer.id}`;

      if (!selectedRouteRegions.includes(layer.id)) {
        if (map.getLayer(routeId)) map.removeLayer(routeId);
        if (map.getSource(routeId)) map.removeSource(routeId);
      }

      if (!selectedBinRegions.includes(layer.id)) {
        if (map.getLayer(binsId)) map.removeLayer(binsId);
        if (map.getSource(binsId)) map.removeSource(binsId);
      }
    });
  }, [mapReady, selectedRouteRegions, selectedBinRegions, layers]);

  const [saving, setSaving] = useState(false);

  const saveChecklist = async () => {
    if (!mapRef.current) return;

    try {
      setSaving(true);

      // ✅ 1. تصوير الخريطة
      const imageBase64 = apiRef.current?.getMapImage();
      if (!imageBase64) throw new Error("No image from map");

      // ✅ 2. رفع الصورة على Cloudinary
      const uploadRes = await fetch("/api/upload-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          plateNumber,
        }),
      });
      console.log("UPLOAD RESPONSE:", uploadRes);
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("UPLOAD FAILED:", errorText);
        throw new Error("Upload failed");
      }

      const uploaded = await uploadRes.json();
      console.log("Cloudinary Uploaded:", uploaded);

      if (!uploaded.url || !uploaded.public_id) {
        throw new Error("Cloudinary did not return valid data");
      }

      // ✅ 3. استبعاد أي قيم ممكن تخرب الصورة من checklistData
      const {
        mapImageUrl: _ignore1,
        mapImagePublicId: _ignore2,
        ...safeChecklistData
      } = checklistData || {};

      // ✅ 4. إرسال البيانات مع رابط الصورة

      const payload: any = {
        reportId: selectedReport?.id,
        plateNumber,
        date: new Date().toISOString(),

        ...(checklistData || {}),
      };

      // ✅ امسح أي قيم جاية من الفورم
      delete payload.mapImageUrl;
      delete payload.mapImagePublicId;

      // ✅ أضف القيم الصح من Cloudinary
      payload.mapImageUrl = uploaded.url;
      payload.mapImagePublicId = uploaded.public_id;

      // ✅ 5. حفظ التقرير
      const res = await fetch("/api/report-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("body sent to /api/report-checklist:", payload);
      if (!res.ok) {
        const errText = await res.text();
        console.error("SAVE FAILED:", errText);
        throw new Error("Checklist save failed");
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("فشل حفظ التقييم");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="90%"
      centered
      title="Route View"
      styles={{
        body: {
          direction: "rtl",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "10px",
        },
      }}
    >
      <Grid gutter="md">
        {/* العمود الأول: التقييم */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <ReportChecklist
              onChange={(data, valid) => {
                setChecklistData(data);
                setIsChecklistValid(valid);
                onChecklistChange?.(data, valid);
              }}
            />

            <Button
              color="green"
              loading={saving}
              disabled={!isChecklistValid}
              onClick={saveChecklist}
            >
              حفظ التقييم
            </Button>
          </Stack>
        </Grid.Col>

        {/* العمود الثاني: الخريطة + controls */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="sm">
            {/* checkbox فوق الماب */}
            <Checkbox
              label="اماكن الرفع الفعلية"
              checked={showVisited}
              onChange={(e) => setShowVisited(e.currentTarget.checked)}
            />

            {/* Layers داخل Accordion */}
            <Accordion dir="rtl" variant="separated" defaultValue={null}>
              {layers.map((layer: any) => (
                <Accordion.Item key={layer.id} value={String(layer.id)}>
                  <Accordion.Control>
                    مسار :{layer.region_name}- {layer.shift}
                  </Accordion.Control>

                  <Accordion.Panel>
                    <Stack>
                      <Checkbox
                        label="المسار الاصلي"
                        checked={selectedRouteRegions.includes(layer.id)}
                        onChange={(e) => {
                          const checked = e.currentTarget.checked;
                          setSelectedRouteRegions((prev) =>
                            checked
                              ? [...prev, layer.id]
                              : prev.filter((id) => id !== layer.id),
                          );
                        }}
                      />

                      <Checkbox
                        label="مواقع الحاويات"
                        checked={selectedBinRegions.includes(layer.id)}
                        onChange={(e) => {
                          const checked = e.currentTarget.checked;
                          setSelectedBinRegions((prev) =>
                            checked
                              ? [...prev, layer.id]
                              : prev.filter((id) => id !== layer.id),
                          );
                        }}
                      />
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>

            {/* الماب */}
            <div
              ref={containerRef}
              className="map-export"
              style={{
                width: "100%",
                height: "75vh",
                borderRadius: "10px",
              }}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
});

export default PolylineMapModal;
