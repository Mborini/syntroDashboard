"use client";
import { Badge } from "@mantine/core";

import {
  PencilIcon,
  Trash2,
  UserCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserDrawer } from "./UserDrawer";
import { User } from "@/types/user";
import { Table, Button, Group, ActionIcon, ScrollArea } from "@mantine/core";
import { TableSkeleton } from "../Common/skeleton";
import ConfirmModal from "../Common/ConfirmModal";

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (data: User) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u === selectedUser ? { ...u, ...data } : u)),
      );
    } else {
      setUsers((prev) => [...prev, data]);
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeleteUser(user);
    setModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (deleteUser) {
      setUsers((prev) => prev.filter((u) => u !== deleteUser));
      setDeleteUser(null);
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
          <Table className="w-full rounded-lg bg-white text-center shadow-md">
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
                <Table.Tr key={user.username} className="h-12 align-middle">
                  <Table.Td className="align-middle">{user.username}</Table.Td>
                  <Table.Td className="align-middle">{user.role}</Table.Td>
                  <Table.Td className="align-middle">
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
                  <Table.Td className="align-middle">
                    <Group className="flex justify-center align-middle">
                      <ActionIcon variant="subtle" color="blue">
                        {user.isActive ? (
                          <UserRoundX size={16} />
                        ) : (
                          <UserCheck size={16} />
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
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
      />
    </>
  );
}
