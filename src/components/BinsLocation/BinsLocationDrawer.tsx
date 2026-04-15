"use client";

import { convertKmlFileToGeoJSON } from "@/app/utils/kmlToGeoJSON";
import { getVehicles, getVehiclesFromGam } from "@/services/employeeServices";
import { Vehicle } from "@/types/employee";
import {
  Drawer,
  TextInput,
  Button,
  Stack,
  NumberInput,
  Select,
  FileInput,
} from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  opened: boolean;
  onClose: () => void;
  item: any | null;
  onSubmit: (data: any) => void;
};

export default function BinsLocationDrawer({
  opened,
  onClose,
  item,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<any>({
    region_name: "",
    vehicle_number: "",
    shift: "",
    bins: 0,
  });

  const [binsFile, setBinsFile] = useState<File | null>(null);
  const [routeFile, setRouteFile] = useState<File | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadVehicle() {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadVehicle();
  }, []);

  // ============================
  // 📌 FILL DATA (EDIT MODE)
  // ============================
  useEffect(() => {
    if (item) {
      setForm({
        region_name: item.region_name || "",
        vehicle_number: item.vehicle_number || "",
        shift: item.shift || "",
        bins: item.bins || 0,
      });
    } else {
      setForm({
        region_name: "",
        vehicle_number: "",
        shift: "",
        bins: 0,
      });
      setBinsFile(null);
      setRouteFile(null);
    }
  }, [item]);

  // ============================
  // 📌 SUBMIT
  // ============================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      let bins_geojson = null;
      let route_geojson = null;

      // ✅ تحويل bins
      if (binsFile) {
        bins_geojson = await convertKmlFileToGeoJSON(binsFile);
      }

      // ✅ تحويل route
      if (routeFile) {
        route_geojson = await convertKmlFileToGeoJSON(routeFile);
      }

      await onSubmit({
        ...form,
        bins_file: binsFile,
        route_file: routeFile,
        bins_geojson,
        route_geojson,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={item ? "تعديل منطقة" : "إضافة منطقة"}
      position="right"
      size="md"
    >
      <Stack
        dir="rtl"
      >
        <TextInput
          label="اسم المنطقة"
          value={form.region_name}
          onChange={(e) => setForm({ ...form, region_name: e.target.value })}
          required
        
        />

        <Select
          label="رقم السيارة"
          data={vehicles.map((vehicle) => ({
            label: `${vehicle.plate} - ${vehicle.sub_fleet} - ${vehicle.type}`,
            value: vehicle.plate,
          }))}
          value={form.vehicle_number}
          onChange={(value) => setForm({ ...form, vehicle_number: value })}
          required
          searchable
        />

        <Select
          label="الشفت"
          data={[
            { label: "صباحي", value: "morning" },
            { label: "مسائي", value: "evening" },
            { label: "ليلي", value: "night" },
          ]}
          value={form.shift}
          onChange={(value) => setForm({ ...form, shift: value })}
        />

        {/* ✅ BINS FILE */}
        <FileInput
          label="ملف الحاويات (KML)"
          placeholder="Upload bins KML"
          accept=".kml"
          value={binsFile}
          onChange={setBinsFile}
        />

        {/* ✅ ROUTE FILE */}
        <FileInput
          label="ملف المسار (KML)"
          placeholder="Upload route KML"
          accept=".kml"
          value={routeFile}
          onChange={setRouteFile}
        />

        <Button loading={loading} onClick={handleSubmit}>
          {item ? "تحديث" : "حفظ"}
        </Button>
      </Stack>
    </Drawer>
  );
}
