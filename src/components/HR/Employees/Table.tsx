"use client";

import {
  Badge,
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { PencilIcon, Trash2, UserCheck, UserPlus, UserX } from "lucide-react";
import { useEffect, useState } from "react";

import { TableSkeleton } from "../../Common/skeleton";
import ConfirmModal from "../../Common/ConfirmModal";

import { Toast } from "@/lib/toast";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  toggleEmployeeStatus,
  updateEmployee,
} from "@/services/employeeServices";
import {
  CreateEmployeeDTO,
  Employee,
  UpdateEmployeeDTO,
} from "@/types/employee";
import { EmployeeDrawer } from "./UserDrawer";

export function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [modalOpened, setModalOpened] = useState(false);
  const [statusEmployee, setStatusEmployee] = useState<Employee | null>(null);
  const [statusModalOpened, setStatusModalOpened] = useState(false);

  const handleToggleStatusClick = (employee: Employee) => {
    setStatusEmployee(employee);
    setStatusModalOpened(true);
  };

  useEffect(() => {
    async function loadEmployees() {
      setLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEmployees();
  }, []);

  const handleSubmit = async (data: CreateEmployeeDTO | UpdateEmployeeDTO) => {
    try {
      if (selectedEmployee) {
        // update
        await updateEmployee(selectedEmployee.id, data);

        // إعادة جلب جميع الموظفين بعد التعديل
        const refreshedEmployees = await getEmployees();
        setEmployees(refreshedEmployees);
        Toast.success("تم تحديث الموظف بنجاح");
      } else {
        // create
        await createEmployee(data as CreateEmployeeDTO);
        // إعادة جلب جميع الموظفين بعد الإضافة
        const refreshedEmployees = await getEmployees();
        setEmployees(refreshedEmployees);
        Toast.success("تم إضافة الموظف بنجاح");
      }
      setDrawerOpened(false);
    } catch (error) {
      Toast.error("فشل في حفظ الموظف");
      console.error("Failed to save employee:", error);
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete.id);
        setEmployees((prev) =>
          prev.filter((e) => e.id !== employeeToDelete.id),
        );
        setEmployeeToDelete(null);
        setModalOpened(false);
        Toast.success("تم حذف الموظف بنجاح");
      } catch (error) {
        console.error("Failed to delete employee:", error);
        Toast.error("فشل في حذف الموظف");
      }
    }
  };

  if (loading) {
    return <TableSkeleton columns={7} />;
  }

  return (
    <>
      <Group mb="md">
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedEmployee(null);
            setDrawerOpened(true);
          }}
        >
         <UserPlus size={18} /> 
        </Button>
      </Group>

      <ScrollArea>
        <div  className="flex justify-center">
          <Table dir="rtl" className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th style={{ textAlign: "center" }}>الاسم</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الهاتف</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>العنوان</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>تاريخ البدء</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>تاريخ الانتهاء</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الراتب</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الحالة</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {employees.map((employee) => (
                <Table.Tr key={employee.id} className="h-12 align-middle">
                  <Table.Td>{employee.name}</Table.Td>
                  <Table.Td>{employee.phone}</Table.Td>
                  <Table.Td>{employee.address}</Table.Td>
                <Table.Td>
        {employee.start_date
          ? new Date(employee.start_date).toLocaleDateString("ar-EG")
          : "-"}
      </Table.Td>
      <Table.Td>
        {employee.end_date
          ? new Date(employee.end_date).toLocaleDateString("ar-EG")
          : "-"}
      </Table.Td>
                  <Table.Td>{employee.salary}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      {employee.is_active ? (
                        <Badge variant="light" color="green">
                          <UserCheck size={16} />
                        </Badge>
                      ) : (
                        <Badge variant="light" color="red">
                          <UserX size={16} />
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  
                  <Table.Td>
                    <Group className="justify-center">
                      
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(employee)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                  
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </ScrollArea>

      <EmployeeDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        employee={selectedEmployee}
        onSubmit={handleSubmit}
      />
   
      <ConfirmModal
      
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الموظف"
        message="هل انت متأكد من حذف هذا الموظف؟ لن تتمكن من التراجع عن هذا الإجراء."
        color="red"
      />
    </>
  );
}
