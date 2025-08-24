"use client";

import { useEffect, useState } from "react";
import { Drawer, TextInput, Select } from "@mantine/core";
import { AppButton } from "../ui-elements/button";
import {
  ClassDrawerProps,
  CreateClassDTO,
  UpdateClassDTO,
} from "@/types/class";
import { getAcademicYears } from "@/services/classServices"; // افترضنا عندك service لجلب السنوات

export function ClassDrawer({
  opened,
  onClose,
  cls,
  onSubmit,
}: ClassDrawerProps) {
  const [name, setName] = useState("");
  const [academicYearId, setAcademicYearId] = useState<string | null>(null);
  const [academicYears, setAcademicYears] = useState<
    { value: string; label: string }[]
  >([]);

  // جلب السنوات الدراسية عند فتح الـ drawer
  useEffect(() => {
    if (opened) {
      getAcademicYears()
        .then((data) =>
          setAcademicYears(
            data.map((year: any) => ({
              value: String(year.id),
              label: year.name,
            })),
          ),
        )
        .catch((err) => console.error("Failed to load academic years", err));
    }
  }, [opened]);

  // تهيئة الحقول عند تعديل الصف أو فتح drawer جديد
  useEffect(() => {
    if (cls) {
      setName(cls.name);
      setAcademicYearId(String(cls.academic_year_id));
    } else {
      setName("");
      setAcademicYearId(null);
    }
  }, [cls, opened]);

  const handleSubmit = () => {
    const data: CreateClassDTO | UpdateClassDTO = {
      name,
      academic_year: academicYearId || undefined,
    };
    onSubmit(data);
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"
      title={cls ? "تعديل صف" : "إضافة صف"}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          variant="filled"
          radius="lg"
          label="اسم الصف"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Select
          radius="lg"
          variant="filled"
          label="السنة الدراسية"
          data={academicYears}
          value={academicYearId}
          onChange={setAcademicYearId}
        />

        <AppButton
          onClick={handleSubmit}
          color={cls ? "orange" : "blue"}
          fullWidth
        >
          {cls ? "تحديث" : "إضافة"}
        </AppButton>
      </div>
    </Drawer>
  );
}
