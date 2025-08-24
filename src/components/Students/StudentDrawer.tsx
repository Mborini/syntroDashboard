"use client";

import { useEffect, useState } from "react";
import { Drawer, TextInput, Select, Switch } from "@mantine/core";
import { AppButton } from "../ui-elements/button";
import {
  StudentDrawerProps,
  CreateStudentDTO,
  UpdateStudentDTO,
} from "@/types/student";
import { getClasses, getSections } from "@/services/studentServices";

export function StudentDrawer({
  opened,
  onClose,
  student,
  onSubmit,
}: StudentDrawerProps) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
console.log(student);
  const [classes, setClasses] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [sections, setSections] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    if (opened) {
      getClasses().then((data) => {
        setClasses(
          data.map((c: any) => ({ value: String(c.id), label: c.name })),
        );
      });
    }
  }, [opened]);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setClassId(String(student.class_id));
      setSectionId(String(student.section_id));
      setIsActive(student.is_active);
      getSections(student.class_id).then((data) => {
        setSections(
          data.map((s: any) => ({ value: String(s.id), label: s.name })),
        );
      });
    } else {
      setName("");
      setClassId(null);
      setSectionId(null);
      setIsActive(true);
      setSections([]);
    }
  }, [student, opened]);

  const handleClassChange = async (value: string | null) => {
    setClassId(value);
    setSectionId(null);
    if (value) {
      const data = await getSections(Number(value));
      setSections(
        data.map((s: any) => ({ value: String(s.id), label: s.name })),
      );
    } else {
      setSections([]);
    }
  };

  const handleSubmit = () => {
    const data: CreateStudentDTO | UpdateStudentDTO = {
      name,
      section_id: Number(sectionId),
      is_active: isActive,
    };
    onSubmit(data);
  };

  return (
    <Drawer
      bg={"red"}
      opened={opened}
      onClose={onClose}
      position="right"
      size="sm"
      title={student ? "تعديل طالب" : "إضافة طالب"}
    >
      <div className="flex flex-col gap-4">
        <TextInput
          radius={"md"}
          label="اسم الطالب"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="أدخل اسم الطالب"
        />

        <Select
          radius={"md"}
          label="الصف"
          data={classes}
          value={classId}
          onChange={handleClassChange}
          placeholder="اختر الصف"
        />

        <Select
          radius={"md"}
          label="الشعبة"
          data={sections}
          value={sectionId}
          onChange={setSectionId}
          placeholder="اختر الشعبة"
        />

        <Switch
          label="فعال"
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
        />

        <AppButton onClick={handleSubmit} color={student ? "orange" : "blue"} fullWidth>
          {student ? "تحديث" : "إضافة"}
        </AppButton>

      </div>
    </Drawer>
  );
}
