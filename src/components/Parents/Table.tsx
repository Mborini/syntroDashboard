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
  KeyRound,
  PencilIcon,
  Plus,
  Trash2,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import ConfirmModal from "../Common/ConfirmModal";
import { Toast } from "@/lib/toast";
import { TableSkeleton } from "../Common/skeleton";
import { ParentDrawer } from "./ParentDrawer";
import { CreateParentDTO, Parent, UpdateParentDTO } from "@/types/parent";
import {
  createParent,
  deleteParent,
  getParents,
  patchParentPassword,
  patchParentStatus,
  updateParent,
} from "@/services/parentServices";
import PasswordModal from "../Common/PasswordModal";
import { ParentFilters } from "./ParentFilters";
import { useCallback } from "react";

export function ParentsTable() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const [modalOpened, setModalOpened] = useState(false);
  const [statusModalOpened, setStatusModalOpened] = useState(false);

  const [passwordModalOpened, setPasswordModalOpened] = useState(false);
  const [passwordParent, setPasswordParent] = useState<Parent | null>(null);

  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [statusParent, setStatusParent] = useState<Parent | null>(null);
 const loadParents = async () => {
    setLoading(true);
    try {
      const data = await getParents();
      setParents(data);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to load parents");
    } finally {
      setLoading(false);
    }
  };
const handleFilter = useCallback(
  (filters: { name: string; phone: string; status: string }) => {
    let filtered = [...parents];

    if (filters.name) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.phone) {
      filtered = filtered.filter((p) =>
        p.phone_number.toLowerCase().includes(filters.phone.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((p) =>
        filters.status === "active" ? p.is_active : !p.is_active
      );
    }

    setFilteredParents(filtered);
  },
  [parents] // تعتمد فقط على parents
);



  // Load parents from API
 

  useEffect(() => {
    loadParents();
  }, []);

  // Keep filteredParents in sync with parents
  useEffect(() => {
    setFilteredParents(parents);
  }, [parents]);

  const handleSubmit = async (data: CreateParentDTO | UpdateParentDTO) => {
    try {
      if (selectedParent) {
        await updateParent(selectedParent.id, data as UpdateParentDTO);
        setParents((prev) =>
          prev.map((p) => (p.id === selectedParent.id ? { ...p, ...data } : p)),
        );
        Toast.success("Parent updated successfully");
      } else {
        const newParent = await createParent(data as CreateParentDTO);
        setParents((prev) => [...prev, newParent]);
        Toast.success("Parent created successfully");
      }
      setDrawerOpened(false);
    } catch (error) {
      console.error(error);
      Toast.error((error as Error).message);
    }
  };

  const handleDeleteClick = (parent: Parent) => {
    setParentToDelete(parent);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!parentToDelete) return;
    try {
      await deleteParent(parentToDelete.id);
      setParents((prev) => prev.filter((p) => p.id !== parentToDelete.id));
      setModalOpened(false);
      Toast.success("Parent deleted successfully");
    } catch (error) {
      console.error(error);
      Toast.error("Failed to delete parent");
    }
  };

  const handleToggleStatusClick = (parent: Parent) => {
    setStatusParent(parent);
    setStatusModalOpened(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!statusParent) return;
    try {
      await patchParentStatus(statusParent.id, !statusParent.is_active);
      // Update state locally without refresh
      setParents((prev) =>
        prev.map((p) =>
          p.id === statusParent.id ? { ...p, is_active: !p.is_active } : p,
        ),
      );
      setStatusParent(null);
      setStatusModalOpened(false);
      Toast.success("Parent status updated successfully");
    } catch (error) {
      console.error(error);
      Toast.error("Failed to update parent status");
      setStatusParent(null);
      setStatusModalOpened(false);
    }
  };

  const handleOpenPasswordModal = (parent: Parent) => {
    setPasswordParent(parent);
    setPasswordModalOpened(true);
  };

  const handleConfirmPassword = async (password: string) => {
    if (!passwordParent) return;
    try {
      await patchParentPassword(passwordParent.id, password);
      Toast.success("Password updated successfully");
      setPasswordModalOpened(false);
      setPasswordParent(null);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to update password");
    }
  };

  if (loading) return <TableSkeleton columns={5} />;

  return (
    <>
      <Button
        color="green"
        variant="light"
        onClick={() => {
          setSelectedParent(null);
          setDrawerOpened(true);
        }}
      >
        <Plus size={18} />
      </Button>
<ParentFilters onFilter={handleFilter} />

      <ScrollArea mt="md">
        <Table className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
          <Table.Thead>
            <Table.Tr className="h-12">
              <Table.Th className="text-center align-middle">Name</Table.Th>
              <Table.Th className="text-center align-middle">Phone Number</Table.Th>
              <Table.Th className="text-center align-middle">Status</Table.Th>
              <Table.Th className="text-center align-middle">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredParents.map((parent) => (
              <Table.Tr key={parent.id} className="h-12">
                <Table.Td>{parent.name}</Table.Td>
                <Table.Td>{parent.phone_number}</Table.Td>
                <Table.Td>
                  <Group className="justify-center">
                    <Badge
                      variant="light"
                      color={parent.is_active ? "green" : "red"}
                    >
                      {parent.is_active ? (
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
                      color="violet"
                      onClick={() => handleOpenPasswordModal(parent)}
                    >
                      <KeyRound size={18} />
                    </ActionIcon>

                    <ActionIcon
                      variant="subtle"
                      color={parent.is_active ? "red" : "green"}
                      onClick={() => handleToggleStatusClick(parent)}
                    >
                      {parent.is_active ? (
                        <UserRoundX size={16} />
                      ) : (
                        <UserCheck size={16} />
                      )}
                    </ActionIcon>

                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      onClick={() => {
                        setSelectedParent(parent);
                        setDrawerOpened(true);
                      }}
                    >
                      <PencilIcon size={18} />
                    </ActionIcon>

                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(parent)}
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

      {/* Drawer */}
      <ParentDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        parent={selectedParent}
        onSubmit={handleSubmit}
      />

      {/* Status Modal */}
      <ConfirmModal
        opened={statusModalOpened}
        onClose={() => setStatusModalOpened(false)}
        onConfirm={handleConfirmToggleStatus}
        title="Change Parent Status"
        message={`Are you sure you want to ${
          statusParent?.is_active ? "deactivate" : "activate"
        } this parent?`}
        color={statusParent?.is_active ? "red" : "green"}
      />

      {/* Delete Modal */}
      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Parent"
        message="Are you sure you want to delete this parent?"
        color="red"
      />

      {/* Password Modal */}
      <PasswordModal
        opened={passwordModalOpened}
        onClose={() => setPasswordModalOpened(false)}
        onConfirm={handleConfirmPassword}
      />
    </>
  );
}
