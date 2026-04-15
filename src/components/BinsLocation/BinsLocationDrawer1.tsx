"use client";

import { Modal, Checkbox, Group } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function GeoJSONMapModal({ opened, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  const [data, setData] = useState<any[]>([]);
  const [showBins, setShowBins] = useState(true);
  const [showRoute, setShowRoute] = useState(true);

  // ============================
  // 📌 GET DATA
  // ============================
  useEffect(() => {
    fetch("/api/binsLocations")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  }, []);

  // ============================
  // 📌 INIT MAP
  // ============================
  useEffect(() => {
    if (!opened) return;

    const init = async () => {
      if (!containerRef.current) return;

      const mapboxgl = (await import("mapbox-gl")).default;

      mapboxgl.accessToken =
        "YOUR_MAPBOX_TOKEN";

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [36.0, 32.0], // عمان
        zoom: 11,
      });

      mapRef.current = map;

      map.on("load", () => {
        drawLayers(map);
      });
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [opened]);

  // ============================
  // 📌 DRAW LAYERS
  // ============================
  const drawLayers = (map: any) => {
    if (!map || !data.length) return;

    data.forEach((item, index) => {
      // ======================
      // ROUTE
      // ======================
      if (showRoute && item.route_geojson) {
        const geojson =
          typeof item.route_geojson === "string"
            ? JSON.parse(item.route_geojson)
            : item.route_geojson;

        const id = `route-${index}`;

        if (!map.getSource(id)) {
          map.addSource(id, {
            type: "geojson",
            data: geojson,
          });

          map.addLayer({
            id: id,
            type: "line",
            source: id,
            paint: {
              "line-color": "#ff0000",
              "line-width": 3,
            },
          });
        }
      }

      // ======================
      // BINS
      // ======================
      if (showBins && item.bins_geojson) {
        const geojson =
          typeof item.bins_geojson === "string"
            ? JSON.parse(item.bins_geojson)
            : item.bins_geojson;

        const id = `bins-${index}`;

        if (!map.getSource(id)) {
          map.addSource(id, {
            type: "geojson",
            data: geojson,
          });

          map.addLayer({
            id: id,
            type: "circle",
            source: id,
            paint: {
              "circle-radius": 5,
              "circle-color": "#1c7ed6",
            },
          });
        }
      }
    });
  };

  // ============================
  // 📌 UPDATE ON CHECKBOX
  // ============================
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    data.forEach((_, index) => {
      const routeId = `route-${index}`;
      const binsId = `bins-${index}`;

      if (map.getLayer(routeId)) map.removeLayer(routeId);
      if (map.getSource(routeId)) map.removeSource(routeId);

      if (map.getLayer(binsId)) map.removeLayer(binsId);
      if (map.getSource(binsId)) map.removeSource(binsId);
    });

    if (map.isStyleLoaded()) {
      drawLayers(map);
    }
  }, [showRoute, showBins, data]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="عرض المواقع"
      centered
    >
      {/* ✅ CHECKBOX */}
      <Group mb="sm">
        <Checkbox
          label="عرض المسارات"
          checked={showRoute}
          onChange={(e) => setShowRoute(e.currentTarget.checked)}
        />

        <Checkbox
          label="عرض الحاويات"
          checked={showBins}
          onChange={(e) => setShowBins(e.currentTarget.checked)}
        />
      </Group>

      {/* ✅ MAP */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "10px",
        }}
      />
    </Modal>
  );
}