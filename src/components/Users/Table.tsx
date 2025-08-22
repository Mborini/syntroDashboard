"use client";

import {
  Badge,
  Table,
  Button,
  Group,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import {
  PencilIcon,
  Trash2,
  UserCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
import { useEffect, useState } from "react";

import { UserDrawer } from "./UserDrawer";
import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "@/services/userServices";
import { CreateUserDTO, UpdateUserDTO, User } from "@/types/user";
import { Toast } from "@/lib/toast";

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const [statusModalOpened, setStatusModalOpened] = useState(false);

  const handleToggleStatusClick = (user: User) => {
    setStatusUser(user);
    setStatusModalOpened(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (statusUser) {
      try {
        const updatedUser = await toggleUserStatus(
          statusUser.id,
          !statusUser.isActive,
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === updatedUser.id
              ? { ...updatedUser, role: u.role }
              : u,
          ),
        );
        Toast.success("User status changed successfully");
      } catch (error) {
        console.error("Failed to toggle user status:", error);
        Toast.error("Failed to change user status");
      } finally {
        setStatusUser(null);
        setStatusModalOpened(false);
      }
    }
  };

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleSubmit = async (data: CreateUserDTO | UpdateUserDTO) => {
    try {
      if (selectedUser) {
        // update
        await updateUser(selectedUser.id, data);

        // إعادة جلب جميع المستخدمين بعد التعديل
        const refreshedUsers = await getUsers();
        setUsers(refreshedUsers);
        Toast.success("User updated successfully");
      } else {
        // create
        await createUser(data as CreateUserDTO);
        // إعادة جلب جميع المستخدمين بعد الإضافة
        const refreshedUsers = await getUsers();
        setUsers(refreshedUsers);
        Toast.success("User created successfully");
      }
      setDrawerOpened(false);
    } catch (error) {
      Toast.error("Failed to save user");
      console.error("Failed to save user:", error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setUserToDelete(null);
        setModalOpened(false);
        Toast.success("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
        Toast.error("Failed to delete user");
      }
    }
  };

  if (loading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <>
      <Group mb="md">
        <Button
          color="green"
          variant="light"
          onClick={() => {
            setSelectedUser(null);
            setDrawerOpened(true);
          }}
        >
          <UserRoundPlus size={18} />
        </Button>
      </Group>

      <ScrollArea>
        <div className="flex justify-center">
          <Table className="w-full rounded-lg bg-white text-center shadow-md dark:bg-gray-dark dark:shadow-card">
            <Table.Thead>
              <Table.Tr className="h-12 align-middle">
                <Table.Th className="text-center align-middle">Name</Table.Th>
                <Table.Th className="text-center align-middle">Role</Table.Th>
                <Table.Th className="text-center align-middle">Status</Table.Th>
                <Table.Th className="text-center align-middle">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id} className="h-12 align-middle">
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>{user.role}</Table.Td>
                  <Table.Td>
                    <Group className="justify-center">
                      {user.isActive ? (
                        <Badge variant="light" color="green">
                          <UserCheck size={16} />
                        </Badge>
                      ) : (
                        <Badge variant="light" color="red">
                          <UserRoundX size={16} />
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group className="flex justify-center">
                      <ActionIcon
                        variant="subtle"
                        color={user.isActive ? "red" : "green"}
                        onClick={() => handleToggleStatusClick(user)}
                      >
                        {user.isActive ? (
                          <UserRoundX  size={16} />
                        ) : (
                          <UserCheck  size={16} />
                        )}
                      </ActionIcon>

                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        onClick={() => {
                          setSelectedUser(user);
                          setDrawerOpened(true);
                        }}
                      >
                        <PencilIcon size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(user)}
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

      <UserDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        user={selectedUser}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        opened={statusModalOpened}
        onClose={() => setStatusModalOpened(false)}
        onConfirm={handleConfirmToggleStatus}
        title="Change User Status"
        message={`Are you sure you want to ${statusUser?.isActive ? "deactivate" : "activate"} this user?`}
        color={statusUser?.isActive ? "red" : "green"}
      />

      <ConfirmModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        color="red"
      />
    </>
  );
}
