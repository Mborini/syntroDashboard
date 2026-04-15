"use client";

import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Table,
  ScrollArea,
  Text,
  Group,
  Button,
  Paper,
  Box,
  Badge,
  ActionIcon,
  Tooltip,
  TextInput,
  Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import {
  deleteReportBySlug,
  getReports,
  uploadReport,
} from "@/services/reportService";
import {
  RiFileExcel2Line,
  RiMoonClearFill,
  RiSpeedUpFill,
} from "react-icons/ri";
import {
  LucideUpload,
  LucideCar,
  LucideAlertTriangle,
  LucideClock,
  Trash2,
} from "lucide-react";
import {
  FaFilePdf,
  FaLayerGroup,
  FaRegCircleStop,
  FaRoute,
  FaSpinner,
  FaTrashArrowUp,
} from "react-icons/fa6";
import { TbSteeringWheel } from "react-icons/tb";
import { IoMdSpeedometer } from "react-icons/io";
import { CiSaveUp1 } from "react-icons/ci";
import { FaMapMarkedAlt } from "react-icons/fa";
import PolylineMapModal from "./PolylineMapModal";
import { GiPathDistance } from "react-icons/gi";
import { exportReportPDF } from "@/app/utils/exportReportPDF";
import { Toast } from "@/lib/toast";
import { useSession } from "next-auth/react";
type ReportData = {
  id: number;
  plateNumber: string;
  organization: string;
  subFleet: string;
  date: string;
  totalDriveTime: string;
  avgSpeed: number;
  totalAlerts: number;
  totalIdleTime: string;
  totalStopTime: string;
  maxSpeed: number;
  totalLifts: number;
  polyline: string;
  visitedpoints: any[]; // تأكد من نوع البيانات الفعلي لهذا الحقل
  distanceKm: number;
  isRated: boolean;
  alerts: {
    alertTime: string;
    alertType: string;
    speed: number;
    speed_limit: number;
    address: string;
  }[];
};

export function PlaybackReportTable() {
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
const [newSessionValue, setNewSessionValue] = useState("");
  const [checklists, setChecklists] = useState<Record<string, any>>({});
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null);
  const [openedMap, setOpenedMap] = useState(false);
  const [selectedPolyline, setSelectedPolyline] = useState<string>("");
  const [dropStatus, setDropStatus] = useState<
    "idle" | "dragging" | "rejected"
  >("idle");
  const openRef = useRef<() => void>(null);
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [mapReady, setMapReady] = useState(false);
  const loadReports = async () => {
    setLoading(true);
    try {
      // استدعاء دالة الـ GET التي أنشأناها في الـ API
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);
const handleUpload = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!selectedFile) return;

  setUploading(true);

  try {
    await uploadReport(selectedFile);

    notifications.show({
      title: "نجاح",
      message: "تم رفع التقرير بنجاح",
      color: "green",
    });

    setSelectedFile(null);
    setDropStatus("idle");
    loadReports();
  } catch (err: any) {
  console.error("UPLOAD ERROR:", err || err.message);

  Toast.error(
    err?.response?.data?.error ||
    "انتهت الجلسة, يرجى إعادة تسجيل الدخول"
  );

  // 🔥 افتح المودال
  setSessionModalOpen(true);
}finally {
    setUploading(false);
  }
};

  // =========================
  // 📊 بيانات التقرير
  // =========================
  const saveChecklistForReport = (
    report: ReportData,
    data: any,
    valid: boolean,
  ) => {
    const key = `${report.plateNumber}-${report.date}`;

    setChecklists((prev) => ({
      ...prev,
      [key]: { data, valid },
    }));
  };

  const handleDelete = async (plate: string, rawDate: string) => {
    // إضافة تأكيد قبل الحذف
    if (
      !window.confirm(
        `هل أنت متأكد من حذف تقرير المركبة ${plate} لتاريخ ${new Date(rawDate).toLocaleDateString()}؟`,
      )
    ) {
      return;
    }

    try {
      await deleteReportBySlug(plate, rawDate);
      loadReports(); // تحديث الجدول
    } catch (error) {
      console.error("Delete failed", error);
      alert("فشل عملية الحذف، يرجى المحاولة لاحقاً");
    }
  };

  const formatInterval = (time: any) => {
    if (!time) return "00:00:00";

    if (typeof time === "object") {
      const h = String(time.hours ?? 0).padStart(2, "0");
      const m = String(time.minutes ?? 0).padStart(2, "0");
      const s = String(time.seconds ?? 0).padStart(2, "0");
      return `${h}:${m}:${s}`;
    }

    return String(time);
  };
   const { update } = useSession();
 
  return (
    <>
      {/* منطقة الرفع */}
      <Paper
        p="md"
        radius="md"
        shadow="sm"
        mb="xl"
        style={{
          border: "3px dashed #ced4da",
          backgroundColor:
            dropStatus === "dragging"
              ? "#e7f5ff"
              : dropStatus === "rejected"
                ? "#fff5f5"
                : selectedFile
                  ? "#ebfbee"
                  : "#f8f9fa",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onClick={() => openRef.current?.()}
      >
        <Dropzone
          openRef={openRef}
          onDrop={(files) => {
            setSelectedFile(files[0]);
            setDropStatus("idle");
          }}
          onReject={() => {
            setSelectedFile(null);
            setDropStatus("rejected");
          }}
          onDragEnter={() => setDropStatus("dragging")}
          onDragLeave={() => setDropStatus("idle")}
          maxSize={10 * 1024 ** 2}
          accept={[MIME_TYPES.xlsx, MIME_TYPES.xls]}
          activateOnClick={false}
        >
          <Box style={{ pointerEvents: "none" }}>
            {selectedFile ? (
              <Text ta="center" fw={700} c="teal">
                {selectedFile.name}
              </Text>
            ) : dropStatus === "rejected" ? (
              <Text ta="center" c="red" fw={500}>
                يرجى اختيار ملف Excel صحيح (.xlsx, .xls)
              </Text>
            ) : (
              <Text ta="center" c="dimmed">
                اسحب ملف التقرير هنا أو اضغط للاختيار من الجهاز
              </Text>
            )}
          </Box>

          <Group justify="center" mt="md">
            <Button
              variant="light"
              color="blue"
              onClick={(e) => {
                e.stopPropagation();
                openRef.current?.();
              }}
              leftSection={<RiFileExcel2Line size={18} />}
            >
              اختر ملف التقرير
            </Button>

            {selectedFile && (
              <Button
                variant="light"
                color="teal"
                onClick={handleUpload}
                loading={uploading}
                leftSection={<LucideUpload size={18} />}
              >
                حفظ ومعالجة البيانات
              </Button>
            )}
          </Group>
        </Dropzone>
      </Paper>

      {/* جدول عرض البيانات من القاعدة */}
      <ScrollArea>
        <Table
          dir="rtl"
          highlightOnHover
          withTableBorder
          verticalSpacing="sm"
          className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark"
        >
          <Table.Thead bg="gray.0">
            <Table.Tr>
              <Table.Th style={{ textAlign: "center" }}>رقم المركبة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>المنطقة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>التاريخ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>
                المسافة المقطوعة (كم)
              </Table.Th>
              <Table.Th style={{ textAlign: "center" }}>وقت القيادة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>وقت الخمول</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>وقت التوقف</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>متوسط السرعة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>أقصى سرعة</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>عدد الرفع</Table.Th>
              <Table.Th style={{ textAlign: "center" }}> المسار</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>عدد التنبيهات</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={13}>
                  <Text
                    py="xl"
                    display="flex"
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <FaSpinner className="animate-spin" size={24} />
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : reports.length === 0 ? (
              /* 2. حالة عدم وجود بيانات */
              <Table.Tr>
                <Table.Td colSpan={12}>
                  <Text py={40} ta="center" c="dimmed" fw={500}>
                    لا توجد بيانات في سجل التقارير.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              reports.map((report, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <LucideCar size={16} color="gray" />
                      <Text fw={700}>{report.plateNumber}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {report.subFleet}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {new Date(report.date).toLocaleDateString("ar-EG")}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <FaRoute size={14} />
                      <Text dir="ltr">{report.distanceKm}</Text>
                    </Group>
                  </Table.Td>
                  {/* التعديل هنا لعرض وقت القيادة بشكل صحيح */}
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <TbSteeringWheel size={14} />
                      <Text dir="ltr">
                        {formatInterval(report.totalDriveTime)}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <RiMoonClearFill size={14} />
                      <Text dir="ltr">
                        {formatInterval(report.totalIdleTime)}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <FaRegCircleStop size={14} />
                      <Text dir="ltr">
                        {formatInterval(report.totalStopTime)}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <IoMdSpeedometer size={14} />
                      <Text dir="ltr">{formatInterval(report.avgSpeed)}</Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <RiSpeedUpFill size={18} />
                      <Text dir="ltr">{formatInterval(report.maxSpeed)}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <FaTrashArrowUp size={16} />
                      <Text dir="ltr">{formatInterval(report.totalLifts)}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => {
                          setSelectedReport(report);

                          setPlateNumber(report.plateNumber);
                          setSelectedPolyline(report.polyline);

                          setOpenedMap(true);
                        }}
                      >
                        <FaMapMarkedAlt size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip
                      label={
                        <div>
                          {report.alerts?.map((a, i) => (
                            <div key={i} style={{ fontSize: 12 }}>
                              {i + 1} | time: {new Date(a.alertTime).toLocaleString("ar-EG")} | location: {a.address}| speed: {a.speed} km/h| type: {a.alertType}
                            </div>
                          ))}
                        </div>
                      }
                      withArrow
                      position="top"
                      multiline
                     
                    >
                      <Badge
                        variant="light"
                        color={Number(report.totalAlerts) > 0 ? "red" : "gray"}
                        style={{ cursor: "pointer" }}
                      >
                        <Group gap={4}>{report.totalAlerts}</Group>
                      </Badge>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="green"
                      disabled={!report.isRated}
                      onClick={() =>
                        exportReportPDF(
                          report.id,
                        )
                      }
                    >
                      <FaFilePdf size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() =>
                        handleDelete(report.plateNumber, report.date)
                      }
                    >
                      <Trash2 size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
        <PolylineMapModal
          onSaved={loadReports}
          selectedReport={selectedReport}
          plateNumber={plateNumber}
          opened={openedMap}
          onClose={() => setOpenedMap(false)}
          encodedPolyline={selectedPolyline}
          visitedPoints={selectedReport?.visitedpoints || []}
          onChecklistChange={(data, valid) => {
            if (selectedReport) {
              saveChecklistForReport(selectedReport, data, valid);
            }
          }}
        />
      </ScrollArea>
      <Modal
  opened={sessionModalOpen}
  onClose={() => setSessionModalOpen(false)}
  centered
  withCloseButton={false}
>
  <div className="space-y-4" dir="rtl">
    <TextInput
      label="تحديث الجلسة"
      placeholder="أدخل القيمة الجديدة"
      value={newSessionValue}
      onChange={(e) => setNewSessionValue(e.currentTarget.value)}
    />

    <Button
  fullWidth
  disabled={!newSessionValue}
  onClick={async () => {
    await update({
      sessionValue: newSessionValue,
    });

    setSessionModalOpen(false);
    setNewSessionValue("");

    // مهم جدًا
    loadReports();
  }}
>
  حفظ الجلسة
</Button>
  </div>
</Modal>
    </>
  );
}
