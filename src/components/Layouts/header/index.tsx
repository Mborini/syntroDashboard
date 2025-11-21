"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { NAV_DATA, NavItem } from "../sidebar/data";
import { UserInfo } from "./user-info";
import {
  TextInput,
  Modal,
  ScrollArea,
  Avatar,
  Text,
} from "@mantine/core";
import { Logo } from "@/components/logo";
import { FiSearch } from "react-icons/fi";

export function Header() {
  const { toggleSidebar } = useSidebarContext();
  const [search, setSearch] = useState("");
  const [modalOpened, setModalOpened] = useState(false);

  // فلترة العناصر بشكل recursive
  const filterNavItems = (items: NavItem[], query: string): NavItem[] => {
    return items.flatMap((item) => {
      const filteredSub = filterNavItems(item.items, query);
      if (
        (item.url && item.title.toLowerCase().includes(query.toLowerCase())) ||
        filteredSub.length > 0
      ) {
        return { ...item, items: filteredSub };
      }
      return [];
    });
  };

  const filteredNav = useMemo(() => {
    if (!search) return [];
    return NAV_DATA.flatMap((section) => filterNavItems(section.items, search));
  }, [search]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-3 shadow-md dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      {/* الشعار على اليسار */}
      <div className="flex items-center gap-2">
        <Logo width={130} height={100} />
      </div>

<div className="flex-1 justify-center hidden lg:flex">
  <Text size="xl" fw={700}>
    نظام الادارة المالية المتكامل
  </Text>
</div>




      {/* أيقونة البحث + UserInfo + زر القائمة الجانبية على اليمين */}
      <div className="flex items-center gap-3">
        <Avatar
          radius="xl"
          size={45}
          color="blue"
          className="cursor-pointer"
          onClick={() => setModalOpened(true)}
        >
          <FiSearch size={20} />
        </Avatar>
        <UserInfo />
        <button
          onClick={toggleSidebar}
          className="rounded-lg border px-2 py-1 lg:hidden"
        >
          ☰
        </button>
      </div>

      {/* مودال البحث */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="نتائج البحث"
        size="md"
        centered
        dir="rtl"
      >
        <TextInput
          dir="rtl"
          variant="filled"
          size="md"
          radius="xl"
          placeholder="ابحث..."
          leftSection={<FiSearch className="text-gray-500" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <ScrollArea style={{ height: 300 }}>
          {filteredNav.length > 0 ? (
            filteredNav.map((item) =>
              item.url ? (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={() => {
                    setSearch("");
                    setModalOpened(false);
                  }}
                  className="block rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-3"
                >
                  {item.title}
                </Link>
              ) : (
                item.items.map(
                  (sub) =>
                    sub.url && (
                      <Link
                        key={sub.title}
                        href={sub.url}
                        onClick={() => {
                          setSearch("");
                          setModalOpened(false);
                        }}
                        className="block rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-3"
                      >
                        {sub.title}
                      </Link>
                    ),
                )
              ),
            )
          ) : (
            <p className="text-center text-gray-500">لا توجد نتائج</p>
          )}
        </ScrollArea>
      </Modal>
    </header>
  );
}
