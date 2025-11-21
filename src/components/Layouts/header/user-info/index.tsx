"use client";

import { Menu, UnstyledButton, Group, Avatar, Text, Divider } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { ShieldUser, LogOutIcon } from "lucide-react";
import { FaArrowDown } from "react-icons/fa";

export function UserInfo() {
  const { data: session } = useSession();

  return (
    <Menu width={175} position="bottom-end" offset={10} withArrow>
      {/* Trigger */}
      <Menu.Target>
        <UnstyledButton>
          <Group wrap="nowrap">
            <Avatar
              radius="xl"
              size={40}
              color="blue"
            >
              <ShieldUser size={22} />
            </Avatar>

            <div className="hidden md:block">
              <Text size="sm" fw={500} >
                {session?.user?.username}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      {/* Content */}
      <Menu.Dropdown>

        {/* User Info */}
        <Menu.Label>User Information</Menu.Label>

        <Group px="sm" py="xs" >
          <Avatar radius="xl" size={45} color="blue">
            <ShieldUser size={24} />
          </Avatar>

          <div>
            <Text size="sm" fw={600}>
              {session?.user?.username}
            </Text>
            <Text size="xs" c="dimmed">
              {session?.user?.role}
            </Text>
          </div>
        </Group>

        <Divider />

        {/* Logout */}
        <Menu.Item
          color="red"
          leftSection={<LogOutIcon size={16} />}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
