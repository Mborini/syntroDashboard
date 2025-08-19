"use client";

import { TrashIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/skeleton";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export function UsersTable() {
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <TableSkeleton columns={3} />; 


  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user: any, index: number) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              <TableCell className="min-w-[155px] xl:pl-7.5">
                <h5 className="text-dark dark:text-white">{user.username}</h5>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">{user.role}</p>
              </TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary">
                    <span className="sr-only">View User</span>
                    <EyeIcon className="size-5" />
                  </button>

                  <button className="hover:text-orange-400">
                    <span className="sr-only">Edit User</span>
                    <PencilIcon className="size-5" />
                  </button>

                  <button className="hover:text-red-dark">
                    <span className="sr-only">Delete User</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
