"use client";

import { EyeIcon, PencilIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/skeleton";

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
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {user.username}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {user.role}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right">
                <div className="flex justify-end gap-3">
                  <button className="text-gray-500 hover:text-blue-500">
                    <span className="sr-only">View User</span>
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-orange-400">
                    <span className="sr-only">Edit User</span>
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-red-600">
                    <span className="sr-only">Delete User</span>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
