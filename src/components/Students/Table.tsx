"use client";

import { useEffect, useState } from "react";
import {
  Group,
  Table,
  ScrollArea,
  ActionIcon,
  Badge,
  Button,
} from "@mantine/core";
import {
  PencilIcon,
  Trash2,
  UserCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
import { StudentDrawer } from "./StudentDrawer";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { Student, CreateStudentDTO, UpdateStudentDTO } from "@/types/student";
import {
  getStudents,
  createStudent,
  updateStudent,
  patchStudentStatus,
  deleteStudent,
} from "@/services/studentServices";
import { TableSkeleton } from "../Common/skeleton";

export function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [statusModalOpened, setStatusModalOpened] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [statusStudent, setStatusStudent] = useState<Student | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);
  console.log(students);
  const handleSubmit = async (data: CreateStudentDTO | UpdateStudentDTO) => {
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, data as UpdateStudentDTO);
        Toast.success("Student updated successfully");
      } else {
        await createStudent(data as CreateStudentDTO);
        Toast.success("Student created successfully");
      }
      loadStudents();
      setDrawerOpened(false);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to save student");
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent(studentToDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setModalOpened(false);
      Toast.success("Student deleted successfully");
    } catch (error) {
      console.error(error);
      Toast.error("Failed to delete student");
    }
  };

  const handleToggleStatusClick = (student: Student) => {
    setStatusStudent(student);
    setStatusModalOpened(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!statusStudent) return;
    try {
      await patchStudentStatus(statusStudent.id, !statusStudent.is_active);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === statusStudent.id ? { ...s, is_active: !s.is_active } : s,
        ),
      );
      setStatusModalOpened(false);
      Toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      Toast.error("Failed to update status");
    }
  };

  if (loading) return <TableSkeleton columns={5} />;

  return (
    <>
      <Group mb="md">
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedStudent(null);
            setDrawerOpened(true);
          }}
        >
          <UserRoundPlus size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <Table className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
          <Table.Thead>
            <Table.Tr className="h-12">
              <Table.Th className="text-center align-middle">Name</Table.Th>
              <Table.Th className="text-center align-middle">Class</Table.Th>
              <Table.Th className="text-center align-middle">Section</Table.Th>
              <Table.Th className="text-center align-middle">Status</Table.Th>
              <Table.Th className="text-center align-middle">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {students.map((student) => (
              <Table.Tr key={student.id} className="h-12">
                <Table.Td>{student.name}</Table.Td>
                <Table.Td>{student.class_name}</Table.Td>
                <Table.Td>{student.section_name}</Table.Td>
                <Table.Td>
                  <Group className="justify-center">
                    <Badge
                      variant="light"
                      color={student.is_active ? "green" : "red"}
                    >
                      {student.is_active ? (
                        <UserCheck size={16} />
                      ) : (
                        <UserRoundX size={16} />
                      )}
                    </Badge>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group className="justify-center">
                    <ActionIcon
                      variant="subtle"
                      color={student.is_active ? "red" : "green"}
                      onClick={() => handleToggleStatusClick(student)}
                    >
                      {student.is_active ? (
                        <UserRoundX size={16} />
                      ) : (
                        <UserCheck size={16} />
                      )}
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      onClick={() => {
                        setSelectedStudent(student);
                        setDrawerOpened(true);
                      }}
                    >
                      <PencilIcon size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <Trash2 size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <StudentDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        student={selectedStudent}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        opened={statusModalOpened}
        onClose={() => setStatusModalOpened(false)}
        onConfirm={handleConfirmToggleStatus}
        title="Change Student Status"
        message={`Are you sure you want to ${statusStudent?.is_active ? "deactivate" : "activate"} this student?`}
        color={statusStudent?.is_active ? "red" : "green"}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        color="red"
      />
    </>
  );
}
