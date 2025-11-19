"use client";

import Link from "next/link";
import { Drawer, Collapse } from "@mantine/core";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_DATA, NavItem, NavSection } from ".";
import { useSidebarContext } from "../sidebar-context";
import {
  TfiArrowCircleDown,
  TfiArrowCircleLeft,
  TfiArrowCircleRight,
  TfiArrowCircleUp,
} from "react-icons/tfi";

export function Sidebar() {
  const { isOpen, toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();

  // خريطة لكل العناصر المفتوحة حسب عنوانها
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
const toggleItem = (key: string) => {
  setExpandedItems((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};


  const renderNavItem = (item: NavItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = !!expandedItems[item.title];
    const isActive = item.url && pathname.startsWith(item.url);

    return (
      <div
        key={item.title}
        className="mb-1"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div
          onClick={() => hasChildren && toggleItem(item.title)}
          dir="rtl"
          className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-gray-200 font-semibold dark:bg-blue-900" : ""} hover:bg-gray-100 dark:hover:bg-gray-800`}
        >
          {Icon && <Icon size={20} color={item.color || undefined} />}
          {item.url ? (
            <Link
              href={item.url}
              className="flex-1"
              onClick={() => {
                if (isMobile) toggleSidebar(); 
              }}
            >
              {item.title}
            </Link>
          ) : (
            <span className="flex-1">{item.title}</span>
          )}

          {hasChildren && (
            <span className="text-gray-400 dark:text-gray-500">
              {isExpanded ? <TfiArrowCircleDown /> : <TfiArrowCircleLeft />}
            </span>
          )}
        </div>

        {hasChildren && (
          <Collapse
            in={isExpanded}
            transitionDuration={600}
            transitionTimingFunction="ease"
            className="pr-4"
          >
            <div className="mt-1 border-r-2 border-gray-200 pr-1  overflow-hidden dark:border-gray-700">
              {item.items.map((child) => renderNavItem(child, level + 1))}
            </div>
          </Collapse>
        )}
      </div>
    );
  };

  const content = (
    <div className="flex h-full w-64 flex-col overflow-auto bg-white p-4 dark:bg-[#0B0F1C]">
      {NAV_DATA.map((section: NavSection) => (
        <div key={section.label} className="mb-6">
          <h2 className="mb-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            {section.label}
          </h2>
          {section.items.map((item) => renderNavItem(item))}
        </div>
      ))}
    </div>
  );

  if (!isMobile) {
    return <div className="flex-shrink-0">{content}</div>;
  }

  return (
    <Drawer
      opened={isOpen}
      onClose={toggleSidebar}
      padding={0}
      size="40%"
      position="right"
      withCloseButton={false}
    >
      {content}
    </Drawer>
  );
}
