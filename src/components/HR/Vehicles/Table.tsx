"use client";

import {
  Badge,
  Table,
  Button,
  Group,
  ScrollArea,
  Pagination,
} from "@mantine/core";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../../Common/skeleton";
import { getVehiclesFromGam, syncVehicles } from "@/services/employeeServices";
import { Vehicle } from "@/types/employee";
import { TbTruck, TbTruckOff } from "react-icons/tb";
import { VehicleFilters } from "./VehicleFilters";
import toast from "react-hot-toast";
import { IoIosCloudUpload } from "react-icons/io";
import { BiSolidCloudUpload } from "react-icons/bi";

export function VehiclesTable() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [activePage, setActivePage] = useState(1); // الصفحة الحالية
  const rowsPerPage = 10; // عدد الصفوف لكل صفحة
  const [syncLoading, setSyncLoading] = useState(false);
  useEffect(() => {
    async function loadVehicles() {
      setLoading(true);
      try {
        const data = await getVehiclesFromGam();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const handleSyncVehicles = async () => {
    setSyncLoading(true);

    const toastId = toast.loading("جاري حفظ البيانات...");

    try {
      const data = await syncVehicles(vehicles);

      if (data.success) {
        toast.success("تم حفظ البيانات بنجاح", { id: toastId });
      } else {
        toast.error("فشل الحفظ", { id: toastId });
      }
    } catch (error) {
      toast.error("صار خطأ", { id: toastId });
    } finally {
      setSyncLoading(false);
    }
  };

  const handleFilter = (filters: {
    plate: string;
    subFleet: string;
    containerSize: number | null;
  }) => {
    const filtered = vehicles.filter((v) => {
      return (
        v.plate.includes(filters.plate) &&
        v.subFleet.includes(filters.subFleet) &&
        (filters.containerSize === null ||
          Number(v.containerSize) === filters.containerSize)
      );
    });
    setFilteredVehicles(filtered);
    setActivePage(1); // إعادة الصفحة الأولى بعد التصفية
  };

  if (loading) {
    return <TableSkeleton columns={7} />;
  }

  // الصفوف التي ستظهر في الصفحة الحالية
  const paginatedVehicles = filteredVehicles.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage,
  );

  return (
    <>
      <Group justify="space-between" align="flex-end" className="gap-2">
        <Button
        
          color="orange"
          variant="light"
          onClick={handleSyncVehicles}
          disabled={syncLoading}
          loading={syncLoading}
        >
          <BiSolidCloudUpload size={24} />
        </Button>

        <div style={{ flex: 1 }}>
          <VehicleFilters onFilter={handleFilter} />
        </div>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table
            dir="rtl"
            className="w-full rounded-lg bg-white text-center shadow-md"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: "center" }}>TS-Id</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>رقم اللوحة</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>النوع</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الشركة</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  الفئة الفرعية
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  حجم الحمولة / طن
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>كابسة</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {paginatedVehicles.map((vehicle) => (
                <Table.Tr key={vehicle.id} className="h-12 align-middle">
                  <Table.Td>{vehicle.TsId}</Table.Td>
                  <Table.Td>{vehicle.plate}</Table.Td>
                  <Table.Td>{vehicle.type}</Table.Td>
                  <Table.Td>{vehicle.company}</Table.Td>
                  <Table.Td>{vehicle.subFleet}</Table.Td>
                  <Table.Td>{vehicle.containerSize}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      {vehicle.isGarbageTruck ? (
                        <Badge variant="light" color="green">
                          <TbTruck size={16} />
                        </Badge>
                      ) : (
                        <Badge variant="light" color="red">
                          <TbTruckOff size={16} />
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </ScrollArea>

      <Group justify="center" mt="md">
        <Pagination
          value={activePage}
          onChange={setActivePage}
          total={Math.ceil(filteredVehicles.length / rowsPerPage)}
          size="md"
          radius="md"
        />
      </Group>
    </>
  );
}
