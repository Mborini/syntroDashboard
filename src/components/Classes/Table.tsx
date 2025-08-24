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
  Plus,
  Trash2,
  UserCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { getClasses } from "@/services/studentServices";
import { TableSkeleton } from "../Common/skeleton";
import { ClassDrawer } from "./ClassDrawer";
import { Class, CreateClassDTO, UpdateClassDTO } from "@/types/class";
import {
  createClass,
  deleteClass,
  updateClass,
} from "@/services/classServices";
import { ClassFilters } from "./ClassFilters";

export function ClassTable() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [statusModalOpened, setStatusModalOpened] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await getClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);
  const handleSubmit = async (data: CreateClassDTO | UpdateClassDTO) => {
    try {
      if (selectedClass) {
        await updateClass(selectedClass.id, data as UpdateClassDTO);
        Toast.success("Class updated successfully");
      } else {
        await createClass(data as CreateClassDTO);
        Toast.success("Class created successfully");
      }
      loadClasses();
      setDrawerOpened(false);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to save class");
    }
  };

  const handleDeleteClick = (cls: Class) => {
    setClassToDelete(cls);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    try {
      await deleteClass(classToDelete.id);
      setClasses((prev) => prev.filter((c) => c.id !== classToDelete.id));
      setModalOpened(false);
      Toast.success("Class deleted successfully");
    } catch (error) {
      console.error(error);
      Toast.error("Failed to delete class");
    }
  };
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  const handleFilter = (filters: { name: string; academic_year: string }) => {
    let filtered = [...classes];
    if (filters.name) {
      filtered = filtered.filter((cls) =>
        cls.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.academic_year) {
      filtered = filtered.filter(
        (cls) => cls.academic_year === filters.academic_year,
      );
    }
    setFilteredClasses(filtered);
  };
  if (loading) return <TableSkeleton columns={5} />;

  return (
    <>
      
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedClass(null);
            setDrawerOpened(true);
          }}
        >
          <Plus size={18} />
        </Button>
    
      <ClassFilters
        academicYears={[...new Set(classes.map((cls) => cls.academic_year))]}
        onFilter={handleFilter}
      />
      <ScrollArea mt="md">
        <Table className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
          <Table.Thead>
            <Table.Tr className="h-12">
              <Table.Th className="text-center align-middle">Name</Table.Th>
              <Table.Th className="text-center align-middle">
                Academic Year
              </Table.Th>
              <Table.Th className="text-center align-middle">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredClasses.map((cls) => (
              <Table.Tr key={cls.id} className="h-12">
                <Table.Td>{cls.name}</Table.Td>
                <Table.Td>{cls.academic_year}</Table.Td>
                <Table.Td>
                  <Group className="justify-center">
                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      onClick={() => {
                        setSelectedClass(cls);
                        setDrawerOpened(true);
                      }}
                    >
                      <PencilIcon size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(cls)}
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

      <ClassDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        cls={selectedClass}
        onSubmit={handleSubmit}
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
